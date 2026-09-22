from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

# TODO Day/wave API: wire DRF router, JWT, spectacular here.
urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/", include("apps.main.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
