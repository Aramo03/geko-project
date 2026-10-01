from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.courses.models import PopularCourse, PopularCourseTranslation
from apps.main.models import Category, CategoryTranslation, Language


class PopularCourseApiTests(APITestCase):
    def setUp(self):
        english = Language.objects.create(code="en", name="English")
        russian = Language.objects.create(code="ru", name="Russian")

        self.design = Category.objects.create(order=1)
        CategoryTranslation.objects.create(
            category=self.design, language=english, text="Design"
        )
        CategoryTranslation.objects.create(
            category=self.design, language=russian, text="Дизайн"
        )

        self.coding = Category.objects.create(order=2)
        CategoryTranslation.objects.create(
            category=self.coding, language=english, text="Coding"
        )

        self.figma = PopularCourse.objects.create(category=self.design, order=1)
        PopularCourseTranslation.objects.create(
            popular_course=self.figma,
            language=english,
            title="Figma",
            description="Design tool",
        )
        PopularCourseTranslation.objects.create(
            popular_course=self.figma,
            language=russian,
            title="Фигма",
            description="Инструмент дизайна",
        )

        self.python = PopularCourse.objects.create(category=self.coding, order=2)
        PopularCourseTranslation.objects.create(
            popular_course=self.python,
            language=english,
            title="Python",
            description="Programming",
        )

    def test_popular_courses_include_category(self):
        response = self.client.get("/api/popular_courses/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        figma = response.data[0]
        self.assertEqual(figma["id"], self.figma.id)
        self.assertEqual(figma["category"]["id"], self.design.id)
        self.assertEqual(
            {item["language"] for item in figma["translations"]},
            {"en", "ru"},
        )

    def test_language_filter(self):
        response = self.client.get("/api/popular_courses/", {"language": "ru"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["translations"][0]["language"], "ru")
        self.assertEqual(response.data[0]["translations"][0]["title"], "Фигма")
        self.assertEqual(
            response.data[0]["category"]["translations"][0]["language"],
            "ru",
        )

    def test_courses_by_category(self):
        url = reverse("courses-by-category", args=[self.design.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.figma.id)
        self.assertEqual(response.data[0]["category"]["id"], self.design.id)

    def test_missing_category_returns_404(self):
        response = self.client.get("/api/courses/999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "Category not found")
