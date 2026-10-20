
from rest_framework import serializers

from apps.courses.models import PopularCourse
from apps.main.models import Category, ContactMessage, Comment


class ContactMessageSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "whatsapp",
            "country",
            "category",
            "message",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def to_internal_value(self, data):
        if hasattr(data, "copy"):
            data = data.copy()
        else:
            data = dict(data)

        if data.get("category") == "":
            data["category"] = None

        return super().to_internal_value(data)


class CommentSerializer(serializers.ModelSerializer):
    popular_course = serializers.PrimaryKeyRelatedField(
        queryset=PopularCourse.objects.all(),
        required=True,
        allow_null=False,
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "full_name",
            "email",
            "whatsapp",
            "popular_course",
            "parent",
            "text",
            "is_approved",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "parent",
            "is_approved",
            "created_at",
        ]
