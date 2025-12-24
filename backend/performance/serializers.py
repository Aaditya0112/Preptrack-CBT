from rest_framework import serializers
from .models import ExamAttempt, UserAnswer
from assessments.serializers import CorrectAnswerSerializer
from assessments.models import Question

class UserAnswerSerializer(serializers.ModelSerializer):
    correct_answer = CorrectAnswerSerializer(source='question.correct_answer', read_only=True)
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all(), write_only=True)
    is_correct = serializers.BooleanField(read_only=True)

    class Meta:
        model = UserAnswer
        fields = [
            'answerId', 'exam_attempt', 'question', 'selected_option_identifier', 
            'numerical_answer', 'is_correct', 'time_spent', 'answer_status', 
            'correct_answer'
        ]

class ExamAttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = ExamAttempt
        fields = ['attemptId', 'username', 'exam', 'practice', 'topic', 'start_time', 'end_time', 'score', 'answers']
