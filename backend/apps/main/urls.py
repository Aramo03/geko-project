from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, EventViewSet


router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("events", EventViewSet, basename="event")


urlpatterns = [
    path("", include(router.urls)),
    path("", include("apps.courses.urls")),
    path("", include("apps.team.urls")),
]
