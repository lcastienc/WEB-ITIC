from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.list_post, name='list_post'),
    path('add_post/', views.add_post, name='add_post'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)