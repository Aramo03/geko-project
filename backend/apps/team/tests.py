from django.contrib import admin
from rest_framework import status
from rest_framework.test import APITestCase
from unfold.admin import ModelAdmin

from apps.main.models import Language
from apps.team.models import Team, TeamTranslation

import apps.team.admin  # noqa: F401  registers Unfold Team without changing it


class TeamLanguageTests(APITestCase):
    def setUp(self):
        self.english = Language.objects.create(code="en", name="English")
        self.armenian = Language.objects.create(code="am", name="Armenian")

        self.member = Team.objects.create(order=1)
        TeamTranslation.objects.create(
            team=self.member,
            language=self.armenian,
            name="Անի",
            role="Դասախոս",
            desc="Թիմի անդամ առանց անգլերեն թարգմանության",
        )

    def test_member_without_english_stays_in_list_and_detail(self):
        listing = self.client.get("/api/teams/", {"language": "en"})
        detail = self.client.get(f"/api/teams/{self.member.id}/", {"language": "en"})

        self.assertEqual(listing.status_code, status.HTTP_200_OK)
        self.assertEqual(len(listing.data), 1)
        self.assertEqual(listing.data[0]["id"], self.member.id)
        self.assertEqual(listing.data[0]["translations"][0]["language"], "am")
        self.assertEqual(listing.data[0]["translations"][0]["name"], "Անի")
        self.assertEqual(listing.data[0]["translations"][0]["role"], "Դասախոս")

        self.assertEqual(detail.status_code, status.HTTP_200_OK)
        self.assertEqual(detail.data["id"], self.member.id)
        self.assertEqual(detail.data["translations"][0]["language"], "am")
        self.assertEqual(detail.data["translations"][0]["name"], "Անի")

    def test_english_translation_is_used_when_it_exists(self):
        TeamTranslation.objects.create(
            team=self.member,
            language=self.english,
            name="Ani",
            role="Teacher",
            desc="English copy",
        )

        response = self.client.get("/api/teams/", {"language": "en"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["translations"][0]["language"], "en")
        self.assertEqual(response.data[0]["translations"][0]["name"], "Ani")

    def test_team_stays_registered_in_unfold(self):
        model_admin = admin.site._registry[Team]

        self.assertIsInstance(model_admin, ModelAdmin)
        self.assertEqual(model_admin.ordering, ("order", "id"))
        self.assertTrue(model_admin.inlines)
        self.assertIn("name", model_admin.list_display)
