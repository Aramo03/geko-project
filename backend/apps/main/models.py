from django.db import models

class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
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
