from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import ExamAttempt, UserAnswer, Stats
from .serializers import ExamAttemptSerializer, UserAnswerSerializer, StatsSerializer
from assessments.serializers import QuestionSerializer
from assessments.models import Question

class ExamAttemptViewSet(viewsets.ModelViewSet):
    queryset = ExamAttempt.objects.all()
    serializer_class = ExamAttemptSerializer

class UserAnswerViewSet(viewsets.ModelViewSet):
    queryset = UserAnswer.objects.all()
    serializer_class = UserAnswerSerializer

class UserAnswerSubmitView(APIView):
    """
    API view to handle bulk creation of UserAnswer objects.
    Expects a list of answer objects in the request body.
    Example payload:
    [
        {
            "exam_attempt": "uuid-of-attempt",
            "question": "uuid-of-question-1",
            "selected_option_identifier": "A"
        },
        {
            "exam_attempt": "uuid-of-attempt",
            "question": "uuid-of-question-2",
            "numerical_answer": "123.45"
        }
    ]
    """
    serializer_class = UserAnswerSerializer

    def post(self, request, *args, **kwargs):
        serializer = UserAnswerSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        instances = serializer.save()
        resp_item = {}

        # After saving answers, recalculate and persist score(s) for affected attempts
        # serializer.save() with many=True returns list of created instances
        try:
            saved_instances = instances if isinstance(instances, list) else [instances]
            attempt_objs = set(inst.exam_attempt for inst in saved_instances if hasattr(inst, 'exam_attempt'))
            for attempt in attempt_objs:
                simplified_question_answer = []
                try:
                    attempt.calculate_and_save_score()
                except Exception:
                    # don't fail the request just because scoring had an issue
                    pass
                # mark the attempt as completed and set end_time
                try:
                    attempt.status = 'completed'
                    attempt.end_time = timezone.now()
                    attempt.total_attempts = (attempt.total_attempts or 0) + 1
                    attempt.save(update_fields=['status', 'end_time', 'total_attempts'])
                except Exception:
                    # best-effort: do not raise on failure to update status
                    pass

                # Create or update aggregated stats for this attempt
                try:
                    answers_qs = attempt.answers.select_related('question')
                    total_questions = attempt.answers.count()

                    questions_attempted = 0
                    correct_answers = 0
                    difficulty_stats = {}

                    for ans in answers_qs:
                        q = ans.question

                        
                        # handling attempted questions
                        attempted = False
                        q_id = getattr(q, 'questionId', None) or getattr(q, 'pk', None)
                        q_id = str(q_id) if q_id is not None else None
                        if ans.selected_option_identifier is not None and ans.selected_option_identifier != '':
                            attempted = True
                            # aggregated simplified view: question id + submitted answer
                            simplified_question_answer.append({
                                "question": q_id,
                                "submitted_answer": ans.selected_option_identifier
                            })
                        elif ans.numerical_answer is not None:
                            attempted = True
                            simplified_question_answer.append({
                                "question": q_id,
                                "submitted_answer": float(ans.numerical_answer)
                            })
                        else:
                            # not attempted
                            simplified_question_answer.append({
                                "question": q_id,
                                "submitted_answer": None
                            })

                        if attempted:
                            questions_attempted += 1

                        # handling correct_answers
                        if getattr(ans, 'is_correct', False):
                            correct_answers += 1

                        # difficulty wise stats

                        diff = getattr(q, 'difficulty', 'Unknown') or 'Unknown'
                        if diff not in difficulty_stats:
                            difficulty_stats[diff] = {'attempted': 0, 'correct': 0, 'total': 0 }
                        if attempted:
                            difficulty_stats[diff]['attempted'] += 1
                        if getattr(ans, 'is_correct', False):
                            difficulty_stats[diff]['correct'] += 1
                        difficulty_stats[diff]['total'] += 1

                    # attempt_rate and accuracy calculations
                    attempt_rate = 0.0
                    accuracy = 0.0

                    total_time_spent_seconds = 0
                    for ans in answers_qs:
                        total_time_spent_seconds += int(ans.time_spent or 0)


                    if questions_attempted > 0:
                        attempt_rate = (total_time_spent_seconds / questions_attempted)

                    if questions_attempted > 0:
                        accuracy = (correct_answers / questions_attempted) * 100.0

                    # upsert Stats
                    stats_obj, created = Stats.objects.update_or_create(
                        exam_attempt=attempt,
                        defaults={
                            'username': attempt.username,
                            'total_questions': total_questions,
                            'marks': attempt.score,
                            'questions_attempted': questions_attempted,
                            'correct_answers': correct_answers,
                            'not_attempted': max((total_questions - questions_attempted), 0),
                            'attempt_rate': round(attempt_rate, 2),
                            'accuracy': round(accuracy, 2),
                            'difficulty_wise_stats': difficulty_stats,
                        }
                    )

                    # all_questions = QuestionSerializer(attempt.exam.questions.all(), many=True).data if attempt.exam else []

                    # build response object for this attempt
                    attempt_serialized = ExamAttemptSerializer(attempt).data
                    resp_item = {
                        'attempt': attempt_serialized,
                        'stats': StatsSerializer(stats_obj).data,
                    }
                except Exception as e:
                    # don't fail primary operation if stats creation fails
                    print("Failed to create/update Stats for attempt:", attempt.attemptId, "Error:", e)
        except Exception:
            # best-effort; ignore if structure unexpected
            pass

        return Response(resp_item, status=status.HTTP_201_CREATED)


class StatsViewSet(viewsets.ModelViewSet):
    queryset = Stats.objects.all()
    serializer_class = StatsSerializer