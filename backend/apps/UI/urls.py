from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import UIBlockViewSet


router = DefaultRouter()

router.register(
    r"ui-blocks",
    UIBlockViewSet,
    basename="ui-block",
)

urlpatterns = [
    path("", include(router.urls)),
]