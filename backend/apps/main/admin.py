from django.contrib import admin

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
    PopularCourse,
    PopularCourseTranslation,
    Review,
    Team,
    TeamTranslation,
    UIBlock,
)

# TODO: Unfold, inlines, sortable, language switcher — student wave (admin).


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("code", "name")


class CategoryTranslationInline(admin.TabularInline):
    model = CategoryTranslation
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "order")
    inlines = [CategoryTranslationInline]


class PopularCourseTranslationInline(admin.TabularInline):
    model = PopularCourseTranslation
    extra = 1


@admin.register(PopularCourse)
class PopularCourseAdmin(admin.ModelAdmin):
    list_display = ("id", "category", "duration", "order")
    inlines = [PopularCourseTranslationInline]


class EventTranslationInline(admin.TabularInline):
    model = EventTranslation
    extra = 1


class EventGalleryInline(admin.TabularInline):
    model = EventGallery
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "start_date", "order")
    list_filter = ("status",)
    inlines = [EventTranslationInline, EventGalleryInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name",)


class LessonInfoTranslationInline(admin.TabularInline):
    model = LessonInfoTranslation
    extra = 1


@admin.register(LessonInfo)
class LessonInfoAdmin(admin.ModelAdmin):
    list_display = ("id", "order")
    inlines = [LessonInfoTranslationInline]


class TeamTranslationInline(admin.TabularInline):
    model = TeamTranslation
    extra = 1


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "order")
    inlines = [TeamTranslationInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "whatsapp", "created_at")
    readonly_fields = ("created_at",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "category", "popular_course", "is_approved", "created_at")
    list_filter = ("is_approved",)
    search_fields = ("full_name", "email", "whatsapp", "text")


@admin.register(UIBlock)
class UIBlockAdmin(admin.ModelAdmin):
    list_display = ("key", "section", "order", "is_visible")
    list_editable = ("order", "is_visible")

    def has_add_permission(self, request):
        return bool(request.user.is_superuser)
