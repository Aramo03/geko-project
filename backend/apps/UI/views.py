from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import UIBlock
from .serializers import UIBlockSerializer


class UIBlockViewSet(ReadOnlyModelViewSet):
    queryset = UIBlock.objects.filter(is_visible=True)
    serializer_class = UIBlockSerializer
    permission_classes = [AllowAny]