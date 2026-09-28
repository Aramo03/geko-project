from django.db import models


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Review(models.Model):
    name = models.CharField(max_length=100)
    comment = models.TextField()
    local_image = models.ImageField(upload_to="review_images/", blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)

    def get_image(self):
        if self.local_image:
            return self.local_image.url
        return self.image_url

    def __str__(self):
        return self.name


class LessonInfo(models.Model):
    local_image = models.ImageField(upload_to='lesson_images/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def get_translation(self):
        ...

#    def __str__(self): Քանի որ այս կոդը դեռ չի աշխատում , որովհետև get_translation ու __str__ պետք է սարքել backup-ի լոգիկայով
#       ...

class LessonInfoTranslation(models.Model):
    lesson_info = models.ForeignKey(LessonInfo, on_delete=models.CASCADE, related_name='translations')
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)

    class Meta:
        unique_together = ('lesson_info', 'language')