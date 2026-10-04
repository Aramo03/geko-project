from django.db import models

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
