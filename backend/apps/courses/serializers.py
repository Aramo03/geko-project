from rest_framework import serializers
from apps.main.models import Category, CategoryTranslation  # Ճիշտ տեղից ներմուծում

class CategoryTranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryTranslation
        fields = ['language', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    translations = CategoryTranslationSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'translations']