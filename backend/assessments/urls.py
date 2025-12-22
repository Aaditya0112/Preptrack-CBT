from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExamViewSet,
    SectionViewSet,
    QuestionViewSet,
    OptionViewSet,
    PracticeViewSet,
    TopicViewSet,
    CorrectAnswerViewSet
)

router = DefaultRouter()
router.register(r'exams', ExamViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'options', OptionViewSet)
router.register(r'practices', PracticeViewSet)
router.register(r'topics', TopicViewSet)
router.register(r'correct-answers', CorrectAnswerViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
