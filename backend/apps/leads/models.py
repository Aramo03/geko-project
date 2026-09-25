
from django.core.exceptions import ValidationError
from django.db import models

from apps.categories.models import Category
from apps.courses.models import PopularCourse


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    country = models.CharField(max_length=100)
    whatsapp = models.CharField(max_length=50, blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_messages",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class Comment(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    whatsapp = models.CharField(max_length=50, blank=True)
    text = models.TextField()

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="comments",
    )

    popular_course = models.ForeignKey(
        PopularCourse,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="comments",
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies",
    )

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if bool(self.category) == bool(self.popular_course):
            raise ValidationError(
                "Comment must have either category or popular_course, but not both."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name
    