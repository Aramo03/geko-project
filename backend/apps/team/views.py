from rest_framework import viewsets

from .models import Team
from .serializers import TeamSerializer


class TeamViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TeamSerializer

    def get_queryset(self):
        queryset = Team.objects.prefetch_related(
            "translations__language"
        ).all()

        language = self.request.query_params.get("language")

        if language:
            queryset = queryset.filter(
                translations__language__code=language
            ).distinct()

        return queryset