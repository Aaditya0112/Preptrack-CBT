from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from .views import media_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/performance/', include('performance.urls')),
    re_path(r'^media/(?P<path>.*)$', media_view, name='media'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
