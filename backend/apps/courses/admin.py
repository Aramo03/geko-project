from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import PopularCourse, PopularCourseTranslation


class PopularCourseTranslationInline(TabularInline):
    model = PopularCourseTranslation
    extra = 0


@admin.register(PopularCourse)
class PopularCourseAdmin(ModelAdmin):
    list_display = ("id", "category", "order")
    list_filter = ("category",)
    ordering = ("order",)
    inlines = [PopularCourseTranslationInline]
