from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet

router = DefaultRouter()
router.register(r'course-category', CategoryViewSet, basename='course-category')

urlpatterns = [
    path('', include(router.urls)),
]