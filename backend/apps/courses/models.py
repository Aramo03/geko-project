from django.db import models
from django.utils.translation import gettext_lazy as _

LANGUAGE_CHOICES = (
    ("am", "Armenian"),
    ("en", "English"),
    ("ru", "Russian"),
)


class PopularCourse(models.Model):
    category = models.ForeignKey(
        "main.Category",
        on_delete=models.CASCADE,
        related_name="popular_courses",
        verbose_name=_("category"),
    )
    image = models.ImageField(upload_to="popular_courses/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name = _("Popular Course")
        verbose_name_plural = _("Popular Courses")

    def __str__(self):
        translation = self.translations.filter(language="en").first()
        return translation.title if translation else f"PopularCourse #{self.pk}"


class PopularCourseTranslation(models.Model):
    popular_course = models.ForeignKey(
        PopularCourse,
        on_delete=models.CASCADE,
        related_name="translations",
    )
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ("popular_course", "language")
        verbose_name = _("Popular Course Translation")
        verbose_name_plural = _("Popular Course Translations")

    def __str__(self):
        return f"{self.title} ({self.language})"