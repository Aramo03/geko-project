from rest_framework.routers import DefaultRouter

from .views import TeamViewSet


router = DefaultRouter()

router.register("teams", TeamViewSet, basename="team")

urlpatterns = router.urls