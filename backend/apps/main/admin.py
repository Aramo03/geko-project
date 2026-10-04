from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import (
    Category,
    CategoryTranslation,
    Comment,
    ContactMessage,
    Event,
    EventGallery,
    EventTranslation,
    Language,
    LessonInfo,
    LessonInfoTranslation,
    Review,
    UIBlock,
)


class CategoryTranslationInline(TabularInline):
    model = CategoryTranslation
    extra = 0


class EventTranslationInline(TabularInline):
    model = EventTranslation
    extra = 0


class EventGalleryInline(TabularInline):
    model = EventGallery
    extra = 0


class LessonInfoTranslationInline(TabularInline):
    model = LessonInfoTranslation
    extra = 0


@admin.register(Language)
class LanguageAdmin(ModelAdmin):
    list_display = ("code", "name")
    search_fields = ("code", "name")


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("id", "order")
    ordering = ("order",)
    inlines = [CategoryTranslationInline]


@admin.register(Event)
class EventAdmin(ModelAdmin):
    list_display = ("id", "date", "status")
    list_filter = ("status",)
    inlines = [EventTranslationInline, EventGalleryInline]


@admin.register(Review)
class ReviewAdmin(ModelAdmin):
    list_display = ("full_name", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("full_name", "text")


@admin.register(LessonInfo)
class LessonInfoAdmin(ModelAdmin):
    list_display = ("id", "order")
    ordering = ("order",)
    inlines = [LessonInfoTranslationInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ("full_name", "email", "phone", "created_at")
    search_fields = ("full_name", "email", "message")
    readonly_fields = ("created_at",)


@admin.register(Comment)
class CommentAdmin(ModelAdmin):
    list_display = (
        "full_name",
        "email",
        "is_approved",
        "category",
        "popular_course",
        "created_at",
    )
    list_filter = ("is_approved",)
    search_fields = ("full_name", "email", "text")


@admin.register(UIBlock)
class UIBlockAdmin(ModelAdmin):
    list_display = ("key", "section", "order", "is_visible")
    list_filter = ("section", "is_visible")
    search_fields = ("key", "section")
    ordering = ("order",)

    def has_add_permission(self, request):
        return bool(getattr(request.user, "is_superuser", False))
