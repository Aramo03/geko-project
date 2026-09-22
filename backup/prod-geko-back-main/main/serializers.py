from rest_framework import serializers
from .models import Language, Category, Review, Event, PopularCourse, CategoryTranslation, PopularCourseTranslation, \
    EventTranslation, LessonInfoTranslation, LessonInfo, EventGallery, TeamTranslation, Team, ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'message', 'country', 'whatsapp', 'category']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ('code', 'name')


class CategoryTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()

    class Meta:
        model = CategoryTranslation
        fields = ('language', 'text')


class TeamTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()

    class Meta:
        model = TeamTranslation
        fields = ('language', 'desc', 'name', 'role')


class PopularCourseTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()

    class Meta:
        model = PopularCourseTranslation
        fields = ('language', 'lang', 'title', 'desc')


class EventTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()

    class Meta:
        model = EventTranslation
        fields = ('language', 'title', 'description', 'place')


class LessonInfoTranslationSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()

    class Meta:
        model = LessonInfoTranslation
        fields = ['language', 'title']


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    translations = CategoryTranslationSerializer(many=True)

    class Meta:
        model = Category
        fields = ('id', 'image', 'translations', 'order')

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None

    def to_representation(self, instance):
        language_code = self.context.get('language_code', None)
        representation = super().to_representation(instance)

        if language_code:
            translation = next((t for t in representation['translations'] if t['language']['code'] == language_code),
                               None)
            representation['translation'] = translation
            representation.pop('translations')
        return representation


class TeamSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    translations = TeamTranslationSerializer(many=True)

    class Meta:
        model = Team
        fields = ('id', 'image', 'translations', 'order')

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None

    def to_representation(self, instance):
        language_code = self.context.get('language_code', None)
        representation = super().to_representation(instance)

        if language_code:
            translation = next((t for t in representation['translations'] if t['language']['code'] == language_code),
                               None)
            representation['translation'] = translation
            representation.pop('translations')
        return representation


class PopularCourseSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    translations = PopularCourseTranslationSerializer(many=True)
    category = CategorySerializer()

    class Meta:
        model = PopularCourse
        fields = ('id', 'category', 'image', 'duration', 'certification', 'students', 'studentGroup', 'assessments',
                  'translations')

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None

    def to_representation(self, instance):
        language_code = self.context.get('language_code', None)
        representation = super().to_representation(instance)

        if language_code:
            translation = next((t for t in representation['translations'] if t['language']['code'] == language_code),
                               None)
            representation['translation'] = translation
            representation.pop('translations')
        return representation


class EventGallerySerializer(serializers.ModelSerializer):
    event_gallery_name = serializers.CharField(source='event.name', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = EventGallery
        fields = ['id', 'event', 'event_gallery_name', 'image', 'order']

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None


class EventSerializer(serializers.ModelSerializer):
    translations = EventTranslationSerializer(many=True)
    available_slots = serializers.ReadOnlyField()
    event_galleries = EventGallerySerializer(many=True, required=False)

    class Meta:
        model = Event
        fields = (

            'id', 'start_date', 'end_date','image', 'status', 'available_slots',
            'order', 'event_galleries', 'translations')

    def to_representation(self, instance):
        language_code = self.context.get('language_code', None)
        representation = super().to_representation(instance)

        if language_code:
            translation = next((t for t in representation['translations'] if t['language']['code'] == language_code),
                               None)
            representation['translation'] = translation
            representation.pop('translations')
        return representation


class ReviewSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'image', 'name', 'comment']

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None


class LessonInfoSerializer(serializers.ModelSerializer):
    translations = LessonInfoTranslationSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = LessonInfo
        fields = ['id', 'image', 'order', 'translations']

    def get_image(self, obj):
        if obj.local_image:
            return obj.local_image.url
        elif obj.image_url:
            return obj.image_url
        return None

    def to_representation(self, instance):
        language_code = self.context.get('language_code', None)
        representation = super().to_representation(instance)

        if language_code:
            translation = next(
                (t for t in representation['translations'] if t['language']['code'] == language_code),
                None)
            representation['translation'] = translation
            representation.pop('translations')
        return representation
