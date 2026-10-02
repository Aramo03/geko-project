from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (CategoryViewSet, ReviewViewSet, LessonInfoViewSet,)

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category",)
router.register("reviews", ReviewViewSet, basename="review",)
router.register("lesson-info", LessonInfoViewSet, basename="lesson-info",)


urlpatterns = [
    path("", include(router.urls)),
    path("", include("apps.courses.urls")),
]