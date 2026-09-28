import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("main", "0003_comment_is_approved"),
    ]

    # The main app's initial migration already created these tables. Add the
    # models to the courses app's migration state without recreating the tables.
    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name="PopularCourse",
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
                                upload_to="courses/",
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
                        (
                            "category",
                            models.ForeignKey(
                                blank=True,
                                null=True,
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="courses",
                                to="main.category",
                            ),
                        ),
                    ],
                    options={
                        "db_table": "main_popularcourse",
                        "ordering": ["order"],
                    },
                ),
                migrations.CreateModel(
                    name="PopularCourseTranslation",
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
                        ("title", models.CharField(max_length=255)),
                        (
                            "description",
                            models.TextField(blank=True, null=True),
                        ),
                        (
                            "language",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                to="main.language",
                            ),
                        ),
                        (
                            "popular_course",
                            models.ForeignKey(
                                on_delete=django.db.models.deletion.CASCADE,
                                related_name="translations",
                                to="courses.popularcourse",
                            ),
                        ),
                    ],
                    options={
                        "db_table": "main_popularcoursetranslation",
                        "unique_together": {("popular_course", "language")},
                    },
                ),
            ],
        ),
    ]
