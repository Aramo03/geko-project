from django.contrib import admin
from django import forms

from .forms import EventGalleryForm
from .models import Event, EventTranslation, Category, CategoryTranslation, PopularCourse, PopularCourseTranslation, \
    Review, Language, LessonInfoTranslation, LessonInfo, EventGallery, Team, TeamTranslation, ContactMessage
from .filters import ReviewLanguageFilter
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin


class LanguageSwitcherMixin:
    @staticmethod
    def get_language_switcher_form(request, session_key, default_language='en'):
        languages = Language.objects.all()
        current_language = request.session.get(session_key, default_language)

        class LanguageForm(forms.Form):
            language = forms.ChoiceField(choices=[(lang.code, lang.name) for lang in languages])

        if request.method == 'POST':
            language_form = LanguageForm(request.POST)
            if language_form.is_valid():
                current_language = language_form.cleaned_data['language']
                request.session[session_key] = current_language
        else:
            language_form = LanguageForm(initial={'language': current_language})

        return language_form, current_language

    def changeform_view(self, request, object_id=None, form_url='', extra_context=None):
        language_form, current_language = self.get_language_switcher_form(request, session_key=self.session_key)
        extra_context = extra_context or {}
        extra_context['language_form'] = language_form

        return super().changeform_view(request, object_id, form_url, extra_context)


class LanguageAdmin(admin.ModelAdmin):
    list_display = ('code', 'name')
    search_fields = ('code', 'name')


admin.site.register(Language, LanguageAdmin)


class PopularCourseTranslationInline(admin.StackedInline):
    model = PopularCourseTranslation
    extra = 1


class PopularCourseAdmin(SortableAdminMixin, admin.ModelAdmin):
    inlines = [PopularCourseTranslationInline]
    list_display = ('id', 'category', 'duration', 'certification', 'students', 'studentGroup', 'assessments', 'order')
    search_fields = ('translations__title', 'category__translations__text')
    list_filter = ('category', 'students', 'certification', 'studentGroup', 'assessments')
    session_key = 'popular_course_translation_language'


admin.site.register(PopularCourse, PopularCourseAdmin)


class CategoryTranslationInline(admin.StackedInline):
    model = CategoryTranslation
    extra = 1


class CategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    inlines = [CategoryTranslationInline]
    list_display = ('id', 'get_text', 'order')
    list_editable = ['order']
    search_fields = ('translations__text', 'local_image', 'image_url')
    list_filter = ('translations__language',)
    session_key = 'category_translation_language'
    ordering = ['order']

    def get_text(self, obj):
        # Retrieves the English translation or any other language if specified
        translation = obj.get_translation('en')  # Default to English
        return translation if translation else "No translation available"

    get_text.short_description = 'Text (EN)'  # Column header in admin

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


admin.site.register(Category, CategoryAdmin)


class TeamTranslationInline(admin.StackedInline):
    model = TeamTranslation
    extra = 1


class TeamAdmin(SortableAdminMixin, LanguageSwitcherMixin, admin.ModelAdmin):
    inlines = [TeamTranslationInline]
    list_display = ('id', 'get_name', 'order')
    list_editable = ['order']
    search_fields = ('translations__name', 'local_image', 'image_url')
    list_filter = ('translations__language',)
    session_key = 'team_translation_language'
    ordering = ['order']

    def get_name(self, obj):
        # Retrieves the English translation or any other language if specified
        translation = obj.get_translation('en')  # Default to English
        return translation if translation else "No translation available"

    get_name.short_description = 'Name (EN)'  # Column header in admin

    def save_model(self, request, obj, form, change):
        # Custom save logic if needed
        super().save_model(request, obj, form, change)


admin.site.register(Team, TeamAdmin)


class LessonInfoTranslationInline(admin.StackedInline):
    model = LessonInfoTranslation
    extra = 1
    fields = (
        'language',
        'title',
    )


class LessonInfoAdmin(SortableAdminMixin, LanguageSwitcherMixin, admin.ModelAdmin):
    inlines = [LessonInfoTranslationInline]
    list_display = ('id', 'get_text', 'order')
    list_editable = ['order']
    search_fields = ('translations__title', 'local_image', 'image_url', 'order')
    session_key = 'lesson_info_translation_language'
    ordering = ['order']

    def get_text(self, obj):
        # Retrieves the English translation or any other language if specified
        translation = obj.get_translation('en')  # Default to English
        return translation if translation else "No translation available"

    get_text.short_description = 'Text (EN)'  # Column header in admin


admin.site.register(LessonInfo, LessonInfoAdmin)


class EventTranslationInline(admin.StackedInline):
    model = EventTranslation
    extra = 1
    fields = (
        'language',
        'title',
        'description',
        'place'
    )


class EventGalleryInline(SortableInlineAdminMixin, admin.TabularInline):
    model = EventGallery
    extra = 1


class EventAdmin(SortableAdminMixin, LanguageSwitcherMixin, admin.ModelAdmin):
    inlines = [EventTranslationInline, EventGalleryInline]
    form = EventGalleryForm
    list_display = ('id', 'get_text', 'start_date', 'end_date', 'status', 'order')
    field = '__all__'
    search_fields = ('translations__title',)
    session_key = 'event_translation_language'
    ordering = ['order']

    def get_text(self, obj):
        # Retrieves the English translation or any other language if specified
        translation = obj.get_translation('am')  # Default to English
        return translation if translation else "No translation available"

    get_text.short_description = 'Text (AM)'  # Column header in admin

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


admin.site.register(Event, EventAdmin)


class ReviewAdmin(LanguageSwitcherMixin, admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('translations__comment', 'name', 'comment')
    list_filter = (ReviewLanguageFilter,)
    session_key = 'review_translation_language'


admin.site.register(Review, ReviewAdmin)


class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'message', 'country', 'whatsapp', 'category')


admin.site.register(ContactMessage, ContactMessageAdmin)
