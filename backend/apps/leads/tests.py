from django.test import TestCase
from rest_framework.test import APIClient

from apps.courses.models import PopularCourse
from apps.main.models import Category, ContactMessage


class ContactAPITest(TestCase):
    def test_post_contact(self):
        client = APIClient()
        response = client.post(
            "/api/contact/",
            {
                "full_name": "Test User",
                "email": "test@example.com",
                "phone": "+123",
                "message": "Hello",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["full_name"], "Test User")
        self.assertEqual(response.data["phone"], "+123")

    def test_post_contact_backup_fields(self):
        category = Category.objects.create(order=1)
        client = APIClient()
        response = client.post(
            "/api/contact/",
            {
                "full_name": "Mariam",
                "email": "mariam@example.com",
                "whatsapp": "+374000000",
                "country": "Armenia",
                "category": category.id,
                "message": "I want this course",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["whatsapp"], "+374000000")
        self.assertEqual(response.data["country"], "Armenia")
        self.assertEqual(response.data["category"], category.id)
        saved = ContactMessage.objects.get(pk=response.data["id"])
        self.assertEqual(saved.category_id, category.id)

    def test_post_contact_blank_category(self):
        client = APIClient()
        response = client.post(
            "/api/contact/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "whatsapp": "",
                "country": "",
                "category": "",
                "message": "Hello",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertIsNone(response.data["category"])


class CommentAPITest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(order=1)
        self.course = PopularCourse.objects.create(category=self.category, order=1)
        self.client = APIClient()

    def test_guest_can_post_comment_without_token(self):
        response = self.client.post(
            "/api/comments/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "whatsapp": "+374111111",
                "text": "Hello",
                "category": self.category.id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["text"], "Hello")
        self.assertFalse(response.data["is_approved"])
        self.assertIsNone(response.data["parent"])

    def test_comment_rejects_both_targets(self):
        response = self.client.post(
            "/api/comments/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "text": "Hello",
                "category": self.category.id,
                "popular_course": self.course.id,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_comment_rejects_missing_target(self):
        response = self.client.post(
            "/api/comments/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "text": "Hello",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
