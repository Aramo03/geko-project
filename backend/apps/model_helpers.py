from django.utils.translation import get_language


def image_url_or_file(instance):
    if instance.local_image:
        return instance.local_image.url
    return instance.image_url


def first_translation(instance, language_code=None, *, fallback=True):
    if not language_code:
        language_code = get_language()
    translation = instance.translations.filter(language__code=language_code).first()
    if translation is None and fallback:
        translation = instance.translations.first()
    return translation
