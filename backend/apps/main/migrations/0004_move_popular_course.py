import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0003_comment_is_approved"),
        ("courses", "0001_initial"),
    ]

    # Popular course tables stay in the database and are now owned by apps.courses.
    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.AlterField(
                    model_name="comment",
                    name="popular_course",
                    field=models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="comments",
                        to="courses.popularcourse",
                    ),
                ),
                migrations.DeleteModel(name="PopularCourseTranslation"),
                migrations.DeleteModel(name="PopularCourse"),
            ],
        ),
    ]
