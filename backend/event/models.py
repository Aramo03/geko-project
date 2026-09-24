
from django.db import models
from django.utils.translation import get_language


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


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
    date = models.DateTimeField(
        blank=True,
        null=True
    )

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        return self.image_url

    def get_translation(self, language_code=None):
        if not language_code:
            language_code = get_language()

        translation = self.translations.filter(
            language__code=language_code
        ).first()

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
    description = models.TextField(
        blank=True,
        null=True
    )

    class Meta:
        unique_together = ('event', 'language')


class EventGallery(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='gallery'
    )
    image = models.ImageField(
        upload_to='event_gallery/'
    )