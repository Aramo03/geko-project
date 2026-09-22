from django.contrib.admin import SimpleListFilter

from main.models import PopularCourseTranslation, Language


class SkillLevelFilter(SimpleListFilter):
    title = 'skill level'
    parameter_name = 'skill_level'

    def lookups(self, request, model_admin):
        skill_levels = PopularCourseTranslation.objects.values_list('skill_level', flat=True).distinct()
        return [(level, level) for level in skill_levels]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(translations__skill_level=self.value())
        return queryset


class ReviewLanguageFilter(SimpleListFilter):
    title = 'Language'
    parameter_name = 'language'

    def lookups(self, request, model_admin):
        languages = [(lang.code, lang.name) for lang in Language.objects.all()]
        return languages

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(translations__language__code=self.value())
        return queryset
