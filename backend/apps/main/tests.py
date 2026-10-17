from rest_framework import status
from rest_framework.test import APITestCase

from apps.main.models import (
    Category,
    CategoryTranslation,
    Event,
    EventTranslation,
    Language,
    LessonInfo,
    LessonInfoTranslation,
)


class MissingTranslationListTests(APITestCase):
    def setUp(self):
        self.english = Language.objects.create(code="en", name="English")
        self.russian = Language.objects.create(code="ru", name="Russian")

        self.category = Category.objects.create(order=1)
        CategoryTranslation.objects.create(
            category=self.category,
            language=self.russian,
            text="Дизайн",
        )

        self.event = Event.objects.create(status="upcoming")
        EventTranslation.objects.create(
            event=self.event,
            language=self.russian,
            title="Событие",
            description="Описание",
        )

        self.lesson = LessonInfo.objects.create(order=1)
        LessonInfoTranslation.objects.create(
            lesson_info=self.lesson,
            language=self.russian,
            title="Урок",
            content="Текст",
        )

    def test_rows_without_english_stay_in_the_list(self):
        categories = self.client.get("/api/categories/", {"language": "en"})
        events = self.client.get("/api/events/", {"language": "en"})
        lessons = self.client.get("/api/lesson_info/", {"language": "en"})

        self.assertEqual(categories.status_code, status.HTTP_200_OK)
        self.assertEqual(len(categories.data), 1)
        self.assertEqual(categories.data[0]["translations"][0]["language"], "ru")
        self.assertEqual(categories.data[0]["translations"][0]["text"], "Дизайн")

        self.assertEqual(events.status_code, status.HTTP_200_OK)
        self.assertEqual(len(events.data), 1)
        self.assertEqual(events.data[0]["translations"][0]["language"], "ru")
        self.assertEqual(events.data[0]["translations"][0]["title"], "Событие")

        self.assertEqual(lessons.status_code, status.HTTP_200_OK)
        self.assertEqual(len(lessons.data), 1)
        self.assertEqual(lessons.data[0]["translations"][0]["language"], "ru")
        self.assertEqual(lessons.data[0]["translations"][0]["title"], "Урок")

    def test_event_status_filter_still_applies(self):
        completed = Event.objects.create(status="completed")
        EventTranslation.objects.create(
            event=completed,
            language=self.english,
            title="Done",
            description="",
        )

        response = self.client.get(
            "/api/events/",
            {"language": "en", "status": "upcoming"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["id"] for item in response.data], [self.event.id])
