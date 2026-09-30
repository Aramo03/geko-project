from rest_framework import serializers

from .models import Event, EventTranslation, EventGallery


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