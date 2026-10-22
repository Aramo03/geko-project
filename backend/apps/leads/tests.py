from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.courses.models import PopularCourse
from apps.main.models import Category, Comment, ContactMessage


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

    def test_guest_comment_stays_hidden_until_approved(self):
        created = self.client.post(
            "/api/comments/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "text": "Waiting",
                "category": self.category.id,
            },
            format="json",
        )
        self.assertEqual(created.status_code, 201)
        self.assertFalse(created.data["is_approved"])

        hidden = self.client.get("/api/comments/", {"category": self.category.id})
        self.assertEqual(hidden.status_code, 200)
        self.assertNotIn(created.data["id"], [item["id"] for item in hidden.data])

        Comment.objects.filter(pk=created.data["id"]).update(is_approved=True)
        visible = self.client.get("/api/comments/", {"category": self.category.id})
        self.assertIn(created.data["id"], [item["id"] for item in visible.data])

    def test_guest_course_comment_is_hidden_and_xor_filters_stay_empty(self):
        created = self.client.post(
            "/api/comments/",
            {
                "full_name": "Guest",
                "email": "guest@example.com",
                "text": "About this course",
                "popular_course": self.course.id,
            },
            format="json",
        )
        self.assertEqual(created.status_code, 201)
        self.assertFalse(created.data["is_approved"])
        self.assertEqual(created.data["popular_course"], self.course.id)

        listing = self.client.get(
            "/api/comments/",
            {"popular_course": self.course.id},
        )
        self.assertNotIn(created.data["id"], [item["id"] for item in listing.data])

        Comment.objects.filter(pk=created.data["id"]).update(is_approved=True)
        both = self.client.get(
            "/api/comments/",
            {
                "category": self.category.id,
                "popular_course": self.course.id,
            },
        )
        self.assertEqual(both.status_code, 200)
        self.assertEqual(both.data, [])

    def test_reply_without_jwt_is_forbidden(self):
        parent = Comment.objects.create(
            full_name="Guest",
            email="guest@example.com",
            text="Hello",
            category=self.category,
            is_approved=True,
        )
        response = self.client.post(
            f"/api/comments/{parent.id}/reply/",
            {"text": "Answer"},
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(parent.replies.count(), 0)

    def test_admin_reply_with_jwt_stays_out_of_the_public_list(self):
        parent = Comment.objects.create(
            full_name="Guest",
            email="guest@example.com",
            text="Hello",
            category=self.category,
            is_approved=True,
        )
        User.objects.create_user(
            "admin@example.com",
            "Admin-pass-123",
            role="admin",
        )
        token = self.client.post(
            "/api/auth/token/",
            {"email": "admin@example.com", "password": "Admin-pass-123"},
            format="json",
        )
        self.assertEqual(token.status_code, 200)
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token.data['access']}"
        )
        response = self.client.post(
            f"/api/comments/{parent.id}/reply/",
            {"text": "Answer"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.data["is_approved"])
        self.assertEqual(response.data["parent"], parent.id)
        self.assertEqual(response.data["category"], self.category.id)

        listing = self.client.get("/api/comments/", {"category": self.category.id})
        ids = [item["id"] for item in listing.data]
        self.assertIn(parent.id, ids)
        self.assertNotIn(response.data["id"], ids)
