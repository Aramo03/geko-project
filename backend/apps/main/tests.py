import base64

from django.core.files.uploadedfile import SimpleUploadedFile
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

    def test_details_without_english_translation_still_exist(self):
        category = self.client.get(
            f"/api/categories/{self.category.id}/",
            {"language": "en"},
        )
        event = self.client.get(
            f"/api/events/{self.event.id}/",
            {"language": "en"},
        )
        lesson = self.client.get(
            f"/api/lesson_info/{self.lesson.id}/",
            {"language": "en"},
        )

        self.assertEqual(category.status_code, status.HTTP_200_OK)
        self.assertEqual(category.data["id"], self.category.id)
        self.assertEqual(category.data["translations"][0]["language"], "ru")
        self.assertEqual(category.data["translations"][0]["text"], "Дизайн")

        self.assertEqual(event.status_code, status.HTTP_200_OK)
        self.assertEqual(event.data["id"], self.event.id)
        self.assertEqual(event.data["translations"][0]["language"], "ru")
        self.assertEqual(event.data["translations"][0]["title"], "Событие")

        self.assertEqual(lesson.status_code, status.HTTP_200_OK)
        self.assertEqual(lesson.data["id"], self.lesson.id)
        self.assertEqual(lesson.data["translations"][0]["language"], "ru")
        self.assertEqual(lesson.data["translations"][0]["title"], "Урок")

    def test_english_translation_is_preferred_when_it_exists(self):
        CategoryTranslation.objects.create(
            category=self.category,
            language=self.english,
            text="Design",
        )
        EventTranslation.objects.create(
            event=self.event,
            language=self.english,
            title="Event",
            description="Description",
        )
        LessonInfoTranslation.objects.create(
            lesson_info=self.lesson,
            language=self.english,
            title="Lesson",
            content="Content",
        )

        category = self.client.get("/api/categories/", {"language": "en"})
        event = self.client.get(
            f"/api/events/{self.event.id}/",
            {"language": "en"},
        )
        lesson = self.client.get("/api/lesson_info/", {"language": "en"})

        self.assertEqual(
            [item["language"] for item in category.data[0]["translations"]],
            ["en"],
        )
        self.assertEqual(category.data[0]["translations"][0]["text"], "Design")
        self.assertEqual(
            [item["language"] for item in event.data["translations"]],
            ["en"],
        )
        self.assertEqual(event.data["translations"][0]["title"], "Event")
        self.assertEqual(
            [item["language"] for item in lesson.data[0]["translations"]],
            ["en"],
        )
        self.assertEqual(lesson.data[0]["translations"][0]["title"], "Lesson")

    def test_lesson_image_comes_from_backend(self):
        self.lesson.image_url = "https://cdn.example/lesson.webp"
        self.lesson.save(update_fields=["image_url"])

        remote = self.client.get(f"/api/lesson_info/{self.lesson.id}/")
        self.assertEqual(remote.status_code, status.HTTP_200_OK)
        self.assertEqual(remote.data["image"], "https://cdn.example/lesson.webp")
        self.assertEqual(remote.data["image_url"], "https://cdn.example/lesson.webp")

        png = base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
        )
        uploaded = LessonInfo.objects.create(
            order=2,
            image_url="https://cdn.example/ignored.webp",
            local_image=SimpleUploadedFile("dot.png", png, content_type="image/png"),
        )

        response = self.client.get(f"/api/lesson_info/{uploaded.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("/lesson_images/", response.data["image"])
        self.assertTrue(response.data["image"].startswith("http://"))
        self.assertNotIn("ignored.webp", response.data["image"])
