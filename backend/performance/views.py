from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import ExamAttempt, UserAnswer
from .serializers import ExamAttemptSerializer, UserAnswerSerializer

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

        # After saving answers, recalculate and persist score(s) for affected attempts
        # serializer.save() with many=True returns list of created instances
        try:
            saved_instances = instances if isinstance(instances, list) else [instances]
            attempt_objs = set(inst.exam_attempt for inst in saved_instances if hasattr(inst, 'exam_attempt'))
            for attempt in attempt_objs:
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
        except Exception:
            # best-effort; ignore if structure unexpected
            pass

        return Response(serializer.data, status=status.HTTP_201_CREATED)

