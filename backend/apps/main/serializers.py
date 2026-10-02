from rest_framework import serializers

from apps.model_helpers import get_translation
from .models import Category, CategoryTranslation


class TranslationSerializerMixin:
    def get_translation(self, obj):
        request = self.context.get("request")
        language = request.query_params.get("language") if request else None

        return get_translation(obj, language)


class CategoryTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.code", read_only=True)

    class Meta:
        model = CategoryTranslation
        fields = ["language", "text"]


class CategorySerializer(serializers.ModelSerializer):
    translations = CategoryTranslationSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "local_image",
            "image_url",
            "order",
            "translations",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        language = self.context["request"].query_params.get("language")

        if language:
            data["translations"] = [
                translation
                for translation in data["translations"]
                if translation["language"] == language
            ]

        return data
