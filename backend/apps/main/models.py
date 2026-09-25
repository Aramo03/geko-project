"""
TODO (student wave — models): implement each class below in this file.

Names must match backup (do not rename PopularCourse, ContactMessage, etc.).
Fields: backup/prod-geko-back-main/main/models.py
New models: Comment, UIBlock — see docs/backend.md

Backup-style models:
  - Language
  - Category, CategoryTranslation
  - PopularCourse, PopularCourseTranslation
  - Event, EventTranslation, EventGallery
  - Review
  - LessonInfo, LessonInfoTranslation
  - Team, TeamTranslation
  - ContactMessage

New for this project:
  - Comment (guest: full_name, email, whatsapp; category OR popular_course; parent/reply)
  - UIBlock (key, section, payload JSON, order, is_visible — slots from init_ui)
"""
from django.db import models


class Team(models.Model):
    local_image = models.ImageField(upload_to='team_images/', blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.get_translation('en') or "No translation available"

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return "No image available"

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.name if translation else "No translation available"


class TeamTranslation(models.Model):
    team = models.ForeignKey(
        Team,
        related_name='translations',
        on_delete=models.CASCADE,
    )
    language = models.ForeignKey(
        'Language',
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    desc = models.TextField()

    class Meta:
        unique_together = ('team', 'language')

    def __str__(self):
        return f'{self.language.code}: {self.name}'
