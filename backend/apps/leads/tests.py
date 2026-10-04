from django.test import TestCase
from rest_framework.test import APIClient


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
