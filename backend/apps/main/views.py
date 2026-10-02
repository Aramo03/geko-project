from rest_framework import viewsets
from rest_framework.generics import ListAPIView

from .models import Category
from .serializers import CategorySerializer, ReviewSerializer, LessonInfoSerializer
from apps.content.models import Review, LessonInfo
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self): # type: ignore
        queryset = Category.objects.prefetch_related(
            "translations__language"
        ).all()

        language = self.request.query_params.get("language") # type: ignore

        if language:
            queryset = queryset.filter(
                translations__language__code=language
            ).distinct()

        return queryset

class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class LessonInfoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LessonInfo.objects.all()
    serializer_class = LessonInfoSerializer