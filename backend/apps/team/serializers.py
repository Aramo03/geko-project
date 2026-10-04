from rest_framework import serializers

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
        language = (
            request.query_params.get("language")
            if request
            else None
        )

        if language:
            data["translations"] = [
                translation
                for translation in data["translations"]
                if translation["language"] == language
            ]

        return data