from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0001_initial"),
        ("team", "0001_initial"),
    ]

    # Team's database tables are retained and now owned by apps.team.
    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RenameField(
                    model_name="team",
                    old_name="image",
                    new_name="local_image",
                ),
                migrations.AddField(
                    model_name="team",
                    name="image_url",
                    field=models.URLField(blank=True, null=True),
                ),
                migrations.AddField(
                    model_name="teamtranslation",
                    name="desc",
                    field=models.TextField(default="Default desc"),
                ),
            ],
            state_operations=[
                migrations.DeleteModel(name="TeamTranslation"),
                migrations.DeleteModel(name="Team"),
            ],
        ),
    ]
