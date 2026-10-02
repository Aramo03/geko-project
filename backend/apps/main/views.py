from rest_framework import viewsets

from .models import Category, Event
from .serializers import CategorySerializer, EventSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        queryset = Category.objects.prefetch_related(
            "translations__language"
        ).all()

        language = self.request.query_params.get("language")

        if language:
            queryset = queryset.filter(
                translations__language__code=language
            ).distinct()

        return queryset


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.prefetch_related(
            "translations__language",
            "gallery",
        ).all()

        status = self.request.query_params.get("status")
        language = self.request.query_params.get("language")

        if status:
            queryset = queryset.filter(status=status)

        if language:
            queryset = queryset.filter(
                translations__language__code=language
            ).distinct()

        return queryset
