from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Exam, Section, Question, Option, Practice, Topic, CorrectAnswer
from .serializers import (
    ExamSerializer,
    SectionSerializer,
    QuestionSerializer,
    OptionSerializer,
    PracticeSerializer,
    TopicSerializer,
    CorrectAnswerSerializer
)


class TopicViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class OptionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class SectionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class ExamViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class PracticeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Practice.objects.all()
    serializer_class = PracticeSerializer

class CorrectAnswerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = CorrectAnswer.objects.all()
    serializer_class = CorrectAnswerSerializer
