from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("main", "0001_initial"),
    ]

    # The main app's initial migration already created these tables. Add the
    # models to the team app's migration state without recreating the tables.
    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name="Team",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        (
                            "local_image",
                            models.ImageField(
                                blank=True,
                                null=True,
                                upload_to="team_images/",
                            ),
                        ),
                        ("image_url", models.URLField(blank=True, null=True)),
                        (
                            "order",
                            models.PositiveIntegerField(
                                blank=True,
                                default=0,
                                null=True,
                            ),
                        ),
                    ],
                    options={
                        "db_table": "main_team",
                        "ordering": ["order"],
                    },
                ),
                migrations.CreateModel(
                    name="TeamTranslation",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        (
                            "desc",
                            models.TextField(default="Default desc"),
                        ),
                        (
                            "name",
                            models.CharField(
                                default="Default name",
                                max_length=255,
                            ),
                        ),
                        (
                            "role",
                            models.CharField(
                                default="Default role",
                                max_length=255,
                            ),
                        ),
                        (
                            "language",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                to="main.language",
                            ),
                        ),
                        (
                            "team",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="translations",
                                to="team.team",
                            ),
                        ),
                    ],
                    options={
                        "db_table": "main_teamtranslation",
                        "unique_together": {("team", "language")},
                    },
                ),
            ],
        ),
    ]
