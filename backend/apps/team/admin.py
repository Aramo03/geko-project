from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Team, TeamTranslation


class TeamTranslationInline(TabularInline):
    model = TeamTranslation
    extra = 0
    fields = ("language", "name", "role", "desc")
    autocomplete_fields = ("language",)


@admin.register(Team)
class TeamAdmin(ModelAdmin):
    list_display = ("id", "name", "order")
    list_display_links = ("id", "name")
    ordering = ("order", "id")
    search_fields = ("translations__name", "translations__role")
    inlines = [TeamTranslationInline]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .prefetch_related("translations__language")
            .distinct()
        )

    @admin.display(description="Name")
    def name(self, obj):
        parts = []
        for item in obj.translations.all():
            code = getattr(item.language, "code", "")
            label = item.name.strip() if item.name else ""
            if not label:
                continue
            parts.append(f"{label} ({code})" if code else label)
        return ", ".join(parts) or "—"
