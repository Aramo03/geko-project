from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("team", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="teamtranslation",
            name="desc",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="teamtranslation",
            name="name",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AlterField(
            model_name="teamtranslation",
            name="role",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
    ]
