import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0005_event_status"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactmessage",
            name="country",
            field=models.CharField(blank=True, default="", max_length=100),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="whatsapp",
            field=models.CharField(blank=True, default="", max_length=50),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="category",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="contact_messages",
                to="main.category",
            ),
        ),
    ]
