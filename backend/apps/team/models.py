from django.db import models

from apps.model_helpers import first_translation, image_url_or_file


class Team(models.Model):
    local_image = models.ImageField(
        upload_to="team_images/",
        blank=True,
        null=True,
    )
    image_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        db_table = "main_team"
        ordering = ["order"]

    def get_image(self):
        return image_url_or_file(self) or "No image available"

    def get_translation(self, language_code):
        translation = first_translation(self, language_code, fallback=False)
        return translation.name if translation else "No translation available"

    def __str__(self):
        return self.get_translation("en")


class TeamTranslation(models.Model):
    team = models.ForeignKey(
        Team,
        related_name="translations",
        on_delete=models.CASCADE,
    )
    language = models.ForeignKey(
        "main.Language",
        on_delete=models.CASCADE,
    )
    desc = models.TextField(default="Default desc")
    name = models.CharField(max_length=255, default="Default name")
    role = models.CharField(max_length=255, default="Default role")

    class Meta:
        db_table = "main_teamtranslation"
        unique_together = ("team", "language")

    def __str__(self):
        return f"{self.language.code}: {self.name}"
