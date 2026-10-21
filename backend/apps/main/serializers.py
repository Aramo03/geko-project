from rest_framework import serializers

from apps.model_helpers import get_translation, resolve_language_code
from .models import (
    Category,
    CategoryTranslation,
    Event,
    EventGallery,
    EventTranslation,
    LessonInfo,
    LessonInfoTranslation,
    Review,
    UIBlock,
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
        request = self.context.get("request")
        language = resolve_language_code(request)

        data["translations"] = [
            translation
            for translation in data["translations"]
            if translation["language"] == language
        ] or data["translations"]

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
    image = serializers.SerializerMethodField()

    class Meta:
        model = LessonInfo
        fields = ["id", "order", "local_image", "image_url", "image", "translations"]

    def get_image(self, obj):
        """Uploaded file wins over image_url. Relative media paths become absolute."""
        value = obj.get_image() or ""
        if not value:
            return ""
        if value.startswith(("http://", "https://")):
            return value
        request = self.context.get("request")
        path = value if value.startswith("/") else f"/{value}"
        if request is not None:
            return request.build_absolute_uri(path)
        return path

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


class UIBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UIBlock
        fields = ["id", "key", "section", "payload", "order", "is_visible"]
