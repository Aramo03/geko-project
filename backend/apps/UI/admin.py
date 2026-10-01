from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import UIBlock


@admin.register(UIBlock)
class UIBlockAdmin(ModelAdmin):
    list_display = (
        "key",
        "section",
        "order",
        "is_visible",
    )

    list_filter = (
        "section",
        "is_visible",
    )

    search_fields = (
        "key",
        "section",
    )

    ordering = (
        "order",
    )