from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0004_move_popular_course"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="status",
            field=models.CharField(
                choices=[
                    ("upcoming", "Upcoming"),
                    ("happening", "Happening"),
                    ("completed", "Completed"),
                ],
                default="upcoming",
                max_length=20,
            ),
        ),
    ]
