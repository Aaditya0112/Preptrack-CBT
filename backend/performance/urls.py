from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExamAttemptViewSet, StatsViewSet, UserAnswerSubmitView, UserAnswerViewSet

router = DefaultRouter()
router.register(r'attempts', ExamAttemptViewSet)
router.register(r'answers', UserAnswerViewSet)
router.register(r'stats', StatsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('submit/', UserAnswerSubmitView.as_view(), name='useranswer-submit'),
]
