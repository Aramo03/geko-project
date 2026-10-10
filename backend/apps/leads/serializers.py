from rest_framework import serializers

from apps.courses.models import PopularCourse
from apps.main.models import Category, CategoryTranslation, ContactMessage, Comment


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
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        required=False,
        allow_null=True,
    )

    popular_course = serializers.PrimaryKeyRelatedField(
        queryset=PopularCourse.objects.all(),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "full_name",
            "email",
            "whatsapp",
            "category",
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

    def validate(self, e):
        category = e.get("category")
        popular_course = e.get("popular_course")

        if bool(category) == bool(popular_course):
            raise serializers.ValidationError(
                "Comment must have either category or popular_course, but not both."
            )
        return e