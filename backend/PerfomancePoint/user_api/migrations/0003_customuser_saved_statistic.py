# Generated by Django 4.2.7 on 2024-04-27 19:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0002_customuser_confirm_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='saved_statistic',
            field=models.JSONField(default={}),
            preserve_default=False,
        ),
    ]
