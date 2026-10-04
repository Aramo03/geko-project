from rest_framework import status, viewsets
from rest_framework.response import Response

from apps.main.models import Category

from .models import PopularCourse
from .serializers import PopularCourseSerializer


def popular_course_queryset(request, category_id=None):
    queryset = PopularCourse.objects.select_related("category").prefetch_related(
        "translations__language",
        "category__translations__language",
    )
    if category_id is not None:
        queryset = queryset.filter(category_id=category_id)

    language = request.query_params.get("language")
    if language:
        queryset = queryset.filter(
            translations__language__code=language
        ).distinct()

    return queryset


class PopularCourseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PopularCourseSerializer

    def get_queryset(self):
        return popular_course_queryset(self.request)


class CoursesViewSet(viewsets.ReadOnlyModelViewSet):
    """Popular courses that belong to one category: GET /api/courses/<category_id>/."""

    serializer_class = PopularCourseSerializer

    def get_queryset(self):
        return popular_course_queryset(
            self.request,
            category_id=self.kwargs["category_id"],
        )

    def list(self, request, *args, **kwargs):
        category_id = self.kwargs["category_id"]
        if not Category.objects.filter(pk=category_id).exists():
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return super().list(request, *args, **kwargs)
