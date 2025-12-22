from django.shortcuts import render
from rest_framework import viewsets
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

# Create your views here.

class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

class OptionViewSet(viewsets.ModelViewSet):
    queryset = Option.objects.all()
    serializer_class = OptionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class PracticeViewSet(viewsets.ModelViewSet):
    queryset = Practice.objects.all()
    serializer_class = PracticeSerializer

class CorrectAnswerViewSet(viewsets.ModelViewSet):
    queryset = CorrectAnswer.objects.all()
    serializer_class = CorrectAnswerSerializer
