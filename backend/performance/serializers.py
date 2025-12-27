from rest_framework import serializers
from .models import ExamAttempt, UserAnswer, Stats
from assessments.serializers import CorrectAnswerSerializer, QuestionMinimalSerializer
from assessments.models import Question

class UserAnswerSerializer(serializers.ModelSerializer):
    correct_answer = CorrectAnswerSerializer(source='question.correct_answer', read_only=True)
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all(), write_only=True)
    question_detail = QuestionMinimalSerializer(source='question', read_only=True)
    # question_detail = QuestionSerializer(source='question', read_only=True)
    is_correct = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserAnswer
        fields = [
            'answerId', 'exam_attempt','question', 'question_detail', 'selected_option_identifier', 
            'numerical_answer', 'is_correct', 'time_spent', 'answer_status', 
            'correct_answer'
        ]



class ExamAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)


    class Meta:
        model = ExamAttempt
        fields = ['attemptId', 'username', 'exam', 'practice', 'topic', 'start_time', 'end_time', 'score', 'answers', 'totalTimeTaken']


class StatsSerializer(serializers.ModelSerializer):
    # exam_attempt = ExamAttemptSerializer( read_only=True)

    class Meta:
        model = Stats
        fields = ['statsId','username', 'exam_attempt', 'total_questions', 'marks', 'questions_attempted', 'correct_answers', 'not_attempted', 'attempt_rate', 'accuracy', 'difficulty_wise_stats']

