from django.utils.translation import get_language

DEFAULT_API_LANGUAGE = "en"


def resolve_language_code(request=None, explicit=None):
    if explicit:
        return explicit
    if request is not None:
        param = request.query_params.get("language")
        if param:
            return param
    return DEFAULT_API_LANGUAGE


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


def get_translation(instance, language_code=None):
    return first_translation(instance, language_code)
