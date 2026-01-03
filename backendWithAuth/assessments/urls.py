from rest_framework import routers
from django.urls import path, include
from .views import (
    TopicViewSet, OptionViewSet, QuestionViewSet, SectionViewSet, ExamViewSet, PracticeViewSet, CorrectAnswerViewSet
)

router = routers.DefaultRouter()
router.register(r'topics', TopicViewSet)
router.register(r'options', OptionViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'practices', PracticeViewSet)
router.register(r'correct-answers', CorrectAnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
