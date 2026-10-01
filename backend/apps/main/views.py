from rest_framework import viewsets

from .models import Category
from .serializers import CategorySerializer


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
