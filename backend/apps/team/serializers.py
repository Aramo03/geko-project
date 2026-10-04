from rest_framework import serializers

from apps.model_helpers import resolve_language_code

from .models import Team, TeamTranslation


class TeamTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(
        source="language.code",
        read_only=True,
    )

    class Meta:
        model = TeamTranslation
        fields = [
            "language",
            "name",
            "role",
            "desc",
        ]


class TeamSerializer(serializers.ModelSerializer):
    translations = TeamTranslationSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Team
        fields = [
            "id",
            "local_image",
            "image_url",
            "order",
            "translations",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")
        language = resolve_language_code(request)

        data["translations"] = [
            translation
            for translation in data["translations"]
            if translation["language"] == language
        ] or data["translations"]

        return data