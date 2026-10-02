from django.contrib import admin
import apps.main.models 

admin.site.register(apps.main.models.Category)
admin.site.register(apps.main.models.CategoryTranslation)
admin.site.register(apps.main.models.Comment)
admin.site.register(apps.main.models.ContactMessage)
