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
from django.db import models
from django.utils.translation import get_language


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Category(models.Model):
    local_image = models.ImageField(
        upload_to='images/',
        blank=True,
        null=True
    )
    image_url = models.URLField(
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(
        default=0,
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['order']

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        return self.image_url

    def get_translation(self, language_code=None):
        if not language_code:
            language_code = get_language()
        
        translation = self.translations.filter(language__code=language_code).first()
        if not translation:
            translation = self.translations.first()
        return translation

    def __str__(self):
        translation = self.get_translation()
        return translation.text if translation else f"Category {self.id}"


class CategoryTranslation(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='translations'
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=255)

    class Meta:
        unique_together = ('category', 'language')

    def __str__(self):
        return f"{self.category_id} - {self.language.code}: {self.text}"


class PopularCourse(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='courses',
        blank=True,
        null=True
    )
    local_image = models.ImageField(
        upload_to='courses/',
        blank=True,
        null=True
    )
    image_url = models.URLField(
        blank=True,
        null=True
    )
    order = models.PositiveIntegerField(
        default=0,
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['order']

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        return self.image_url

    def get_translation(self, language_code=None):
        if not language_code:
            language_code = get_language()
        
        translation = self.translations.filter(language__code=language_code).first()
        if not translation:
            translation = self.translations.first()
        return translation

    def __str__(self):
        translation = self.get_translation()
        return translation.title if translation else f"PopularCourse {self.id}"


class PopularCourseTranslation(models.Model):
    popular_course = models.ForeignKey(
        PopularCourse,
        on_delete=models.CASCADE,
        related_name='translations'
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('popular_course', 'language')

    def __str__(self):
        return f"{self.popular_course_id} - {self.language.code}: {self.title}"


class Event(models.Model):
    local_image = models.ImageField(
        upload_to='events/',
        blank=True,
        null=True
    )
    image_url = models.URLField(
        blank=True,
        null=True
    )
    date = models.DateTimeField(blank=True, null=True)

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        return self.image_url

    def get_translation(self, language_code=None):
        if not language_code:
            language_code = get_language()
        
        translation = self.translations.filter(language__code=language_code).first()
        if not translation:
            translation = self.translations.first()
        return translation

    def __str__(self):
        translation = self.get_translation()
        return translation.title if translation else f"Event {self.id}"


class EventTranslation(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='translations'
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('event', 'language')


class EventGallery(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='gallery'
    )
    image = models.ImageField(upload_to='event_gallery/')


class Review(models.Model):
    full_name = models.CharField(max_length=255)
    rating = models.PositiveIntegerField(default=5)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.rating}/5)"


class LessonInfo(models.Model):
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class LessonInfoTranslation(models.Model):
    lesson_info = models.ForeignKey(
        LessonInfo,
        on_delete=models.CASCADE,
        related_name='translations'
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    content = models.TextField()

    class Meta:
        unique_together = ('lesson_info', 'language')


class Team(models.Model):
    image = models.ImageField(upload_to='team/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class TeamTranslation(models.Model):
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='translations'
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=255)

    class Meta:
        unique_together = ('team', 'language')


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.full_name}"


# --- NEW MODELS FOR THIS PROJECT ---

class Comment(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=50, blank=True, null=True)
    
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='comments',
        blank=True,
        null=True
    )
    popular_course = models.ForeignKey(
        PopularCourse,
        on_delete=models.CASCADE,
        related_name='comments',
        blank=True,
        null=True
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='replies',
        blank=True,
        null=True
    )
    
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.full_name}"


class UIBlock(models.Model):
    key = models.CharField(max_length=100, unique=True)
    section = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.section} - {self.key}"

rmbulik