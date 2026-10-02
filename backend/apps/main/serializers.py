from rest_framework import serializers

from apps.model_helpers import get_translation
from .models import (
    Category,
    CategoryTranslation,
    Event,
    EventGallery,
    EventTranslation,
    LessonInfo,
    LessonInfoTranslation,
    Review,
)


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


class EventTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.code")

    class Meta:
        model = EventTranslation
        fields = [
            "language",
            "title",
            "description",
        ]


class EventGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventGallery
        fields = [
            "id",
            "image",
        ]
        read_only_fields = [
            "id",
            "image",
        ]


class EventSerializer(serializers.ModelSerializer):
    translations = EventTranslationSerializer(many=True, read_only=True)
    gallery = EventGallerySerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "local_image",
            "image_url",
            "date",
            "status",
            "translations",
            "gallery",
        ]


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "full_name", "rating", "text", "created_at"]


class LessonInfoTranslationSerializer(serializers.ModelSerializer):
    language = serializers.CharField(source="language.code", read_only=True)

    class Meta:
        model = LessonInfoTranslation
        fields = ["language", "title", "content"]


class LessonInfoSerializer(serializers.ModelSerializer):
    translations = LessonInfoTranslationSerializer(many=True, read_only=True)

    class Meta:
        model = LessonInfo
        fields = ["id", "order", "translations"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        language = request.query_params.get("language") if request else None

        if language:
            data["translations"] = [
                translation
                for translation in data["translations"]
                if translation["language"] == language
            ]

        return data
