from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Team, TeamTranslation


class TeamTranslationInline(TabularInline):
    model = TeamTranslation
    extra = 0


@admin.register(Team)
class TeamAdmin(ModelAdmin):
    list_display = ("id", "order")
    ordering = ("order",)
    inlines = [TeamTranslationInline]
