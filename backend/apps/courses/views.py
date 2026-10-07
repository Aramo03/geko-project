from rest_framework import viewsets
from apps.main.models import Category  # Կամ հիմնական մոդելների տեղից
from .serializers import CategorySerializer  # Կամ համապատասխան serializer-ը

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer