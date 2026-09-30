from django.utils.translation import get_language


def get_translation(instance, language_code=None):
    if not language_code:
        language_code = get_language()
    translation = instance.translations.filter(
        language__code=language_code
    ).first()

    if not translation:
        translation = instance.translations.first()

    return translation