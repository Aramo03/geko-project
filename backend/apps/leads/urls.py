from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CommentViewSet,
    ContactMessageViewSet,
)


router = DefaultRouter()

router.register(
    "contact",
    ContactMessageViewSet,
    basename="contact",
)

router.register(
    "comments",
    CommentViewSet,
    basename="comment",
)


urlpatterns = [
    path("", include(router.urls)),
]