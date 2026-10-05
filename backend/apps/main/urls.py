from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    EventViewSet,
    LessonInfoViewSet,
    ReviewViewSet,
    UIBlockViewSet,
)


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("events", EventViewSet, basename="event")
router.register("reviews", ReviewViewSet, basename="review")
router.register("lesson_info", LessonInfoViewSet, basename="lesson-info")
router.register("ui-blocks", UIBlockViewSet, basename="ui-block")


urlpatterns = [
    path("", include(router.urls)),
    path("", include("apps.courses.urls")),
    path("", include("apps.team.urls")),
]
