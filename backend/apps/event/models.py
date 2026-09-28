from django.db import models
from django.utils.translation import get_language


class Event(models.Model):
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    image = models.ImageField(
        upload_to='event_gallery_photos/',
        blank=True,
        null=True
    )

    order = models.PositiveIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=[
            ('upcoming', 'Upcoming'),
            ('happening', 'Happening'),
            ('completed', 'Completed'),
        ],
        default='upcoming'
    )

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

        if translation:
            return translation.title

        return f'Event {self.id}'


class EventTranslation(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='translations'
    )

    language = models.ForeignKey(
        'main.Language',
        on_delete=models.CASCADE
    )

    place = models.CharField(
        max_length=255
    )

    title = models.CharField(
        max_length=255
    )

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
        related_name='event_galleries'
    )

    local_image = models.ImageField(
        upload_to='event_gallery_images/',
        blank=True,
        null=True
    )

    image_url = models.URLField(
        blank=True,
        null=True
    )

    order = models.PositiveIntegerField(
        default=0
    )

    def get_image(self):
        if self.local_image:
            return self.local_image.url

        return self.image_url