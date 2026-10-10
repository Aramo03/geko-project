from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CoursesViewSet, PopularCourseViewSet

router = DefaultRouter()
router.register("popular_courses", PopularCourseViewSet, basename="popular-course")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "courses/<int:category_id>/",
        CoursesViewSet.as_view({"get": "list"}),
        name="courses-by-category",
    ),
]
