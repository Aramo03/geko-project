from datetime import date

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

STATUS_CHOICES = [
    ("yes", "Yes"),
    ("no", "No"),
]
STATUS_CHOICES_EVENT = [
    ("upcoming", "Upcoming"),
    ("happening", "Happening"),
    ("completed", "Completed"),
]


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Category(models.Model):
    local_image = models.ImageField(upload_to="images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_translation("en") or "No translation available"

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return None

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.text if translation else "No translation available"


class CategoryTranslation(models.Model):
    category = models.ForeignKey(Category, related_name="translations", on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    text = models.CharField(default="Default text", max_length=255)

    class Meta:
        unique_together = ("category", "language")

    def __str__(self):
        return f"{self.language.code}: {self.text}"


class PopularCourse(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    local_image = models.ImageField(upload_to="images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    duration = models.CharField(max_length=50)
    certification = models.TextField(default="yes", choices=STATUS_CHOICES)
    students = models.TextField(default="yes", choices=STATUS_CHOICES)
    studentGroup = models.TextField(default="yes", choices=STATUS_CHOICES)
    assessments = models.TextField(default="yes", choices=STATUS_CHOICES)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_translation("en")

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return None

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.title if translation else "No translation available"


class PopularCourseTranslation(models.Model):
    popular_course = models.ForeignKey(
        PopularCourse, related_name="translations", on_delete=models.CASCADE
    )
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    lang = models.CharField(max_length=50)
    desc = models.TextField()

    class Meta:
        unique_together = ("popular_course", "language")

    def __str__(self):
        return f"{self.language.code}: {self.title}"


class Event(models.Model):
    start_date = models.DateField(default=date.today)
    end_date = models.DateField(default=date.today)
    image = models.ImageField(upload_to="event_gallery_photos/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES_EVENT)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_translation("am") or "No translation available"

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.title if translation else "No translation available"


class EventTranslation(models.Model):
    place = models.CharField(default="Default place", max_length=255)
    event = models.ForeignKey(Event, related_name="translations", on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    title = models.CharField(default="Default title", max_length=255)
    description = models.CharField(default="Default description", max_length=255)

    class Meta:
        unique_together = ("event", "language")

    def __str__(self):
        return f"{self.language.code}: {self.title}"


class EventGallery(models.Model):
    event = models.ForeignKey(Event, related_name="event_galleries", on_delete=models.CASCADE)
    local_image = models.ImageField(upload_to="event_gallery_images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Event gallery {self.id}"

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return None


class Review(models.Model):
    local_image = models.ImageField(upload_to="review_images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255)
    comment = models.TextField()

    def __str__(self):
        return self.name

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return None


class LessonInfo(models.Model):
    local_image = models.ImageField(upload_to="lesson_images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_translation("en")

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.title if translation else "No translation available"


class LessonInfoTranslation(models.Model):
    lesson_info = models.ForeignKey(
        LessonInfo, related_name="translations", on_delete=models.CASCADE
    )
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    title = models.CharField(default="Default title", max_length=255)

    class Meta:
        unique_together = ("lesson_info", "language")

    def __str__(self):
        return f"{self.language.code}: {self.title}"


class Team(models.Model):
    local_image = models.ImageField(upload_to="team_images/", blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    order = models.PositiveIntegerField(default=0, blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.get_translation("en") or "No translation available"

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        if self.image_url:
            return self.image_url
        return None

    def get_translation(self, language_code):
        translation = self.translations.filter(language__code=language_code).first()
        return translation.name if translation else "No translation available"


class TeamTranslation(models.Model):
    team = models.ForeignKey(Team, related_name="translations", on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    desc = models.TextField(default="Default desc")
    name = models.CharField(default="Default name", max_length=255)
    role = models.CharField(default="Default role", max_length=255)

    class Meta:
        unique_together = ("team", "language")

    def __str__(self):
        return f"{self.language.code}: {self.name}"


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    country = models.CharField(max_length=255)
    whatsapp = models.CharField(max_length=20)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.full_name}"


class UIBlock(models.Model):
    """Slots are created by `python manage.py init_ui` only."""

    key = models.SlugField(unique=True)
    section = models.CharField(max_length=50)
    payload = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "key"]

    def __str__(self):
        return self.key


class Comment(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, blank=True, related_name="comments"
    )
    popular_course = models.ForeignKey(
        PopularCourse, on_delete=models.CASCADE, null=True, blank=True, related_name="comments"
    )
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=32, blank=True)
    text = models.TextField()
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )
    replied_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="comment_replies",
    )
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def clean(self):
        has_category = self.category_id is not None
        has_course = self.popular_course_id is not None
        if has_category == has_course:
            raise ValidationError("Set either category or popular_course, not both.")

    def __str__(self):
        target = self.category or self.popular_course
        return f"{self.full_name} on {target}"
