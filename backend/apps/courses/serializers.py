from rest_framework import serializers

from apps.model_helpers import resolve_language_code
from apps.main.serializers import CategorySerializer

from .models import PopularCourse, PopularCourseTranslation


class PopularCourseTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.code", read_only=True)

    class Meta:
        model = PopularCourseTranslation
        fields = ["language", "title", "description"]


class PopularCourseSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True, allow_null=True)
    translations = PopularCourseTranslationSerializer(many=True, read_only=True)

    class Meta:
        model = PopularCourse
        fields = [
            "id",
            "category",
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
