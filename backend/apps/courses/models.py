from django.db import models

from apps.model_helpers import first_translation, image_url_or_file


class PopularCourse(models.Model):
    category = models.ForeignKey(
        "main.Category",
        on_delete=models.CASCADE,
        related_name="courses",
        blank=True,
        null=True,
    )
    local_image = models.ImageField(
        upload_to="courses/",
        blank=True,
        null=True,
    )
    image_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        db_table = "main_popularcourse"
        ordering = ["order"]

    def get_image(self):
        return image_url_or_file(self)

    def get_translation(self, language_code=None):
        return first_translation(self, language_code)

    def __str__(self):
        translation = self.get_translation()
        return translation.title if translation else f"PopularCourse {self.id}"


class PopularCourseTranslation(models.Model):
    popular_course = models.ForeignKey(
        PopularCourse,
        on_delete=models.CASCADE,
        related_name="translations",
    )
    language = models.ForeignKey(
        "main.Language",
        on_delete=models.CASCADE,
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "main_popularcoursetranslation"
        unique_together = ("popular_course", "language")

    def __str__(self):
        return f"{self.popular_course_id} - {self.language.code}: {self.title}"
