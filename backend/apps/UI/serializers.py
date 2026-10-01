from rest_framework import serializers

from .models import UIBlock


class UIBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = UIBlock
        fields = (
            "id",
            "key",
            "section",
            "payload",
            "order",
            "is_visible",
        )