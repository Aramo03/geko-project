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

class CategorySerializer(TranslationSerializerMixin, serializers.ModelSerializer):
    translation = serializers.SerializerMethodField(method_name="get_translation")
    
    class Meta:
        model = Category
        fields = ["id", "local_image", "image_url", "order"]