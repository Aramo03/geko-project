from rest_framework import viewsets

from .models import Category, Event, LessonInfo, Review, UIBlock
from .serializers import (
    CategorySerializer,
    EventSerializer,
    LessonInfoSerializer,
    ReviewSerializer,
    UIBlockSerializer,
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.prefetch_related(
            "translations__language"
        ).all()

        

class EventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.prefetch_related(
            "translations__language",
            "gallery",
        ).all()

        status = self.request.query_params.get("status")

        if status:
            queryset = queryset.filter(status=status)
       
        return queryset


class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.all().order_by("-created_at")


class LessonInfoViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LessonInfoSerializer

    def get_queryset(self):
        return LessonInfo.objects.prefetch_related(
            "translations__language"
        ).order_by("order")

       


class UIBlockViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UIBlock.objects.filter(is_visible=True)
    serializer_class = UIBlockSerializer
