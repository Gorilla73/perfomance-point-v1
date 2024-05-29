# Generated by Django 4.2.7 on 2024-04-16 18:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Championship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('championship', models.CharField(max_length=40, unique=True, verbose_name='Чемпионат')),
                ('image_country_championship', models.FileField(upload_to='svg/')),
            ],
            options={
                'verbose_name': 'Чемпионат',
                'verbose_name_plural': 'Чемпионаты',
            },
        ),
        migrations.CreateModel(
            name='Teams',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_name', models.CharField(max_length=50, unique=True, verbose_name='Название команды')),
                ('image_team', models.FileField(upload_to='svg/')),
                ('championship', models.ForeignKey(max_length=60, on_delete=django.db.models.deletion.CASCADE, to='ParserFlashScore.championship')),
            ],
            options={
                'verbose_name': 'Команда',
                'verbose_name_plural': 'Команды',
            },
        ),
        migrations.CreateModel(
            name='MatchesShedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_home', models.CharField(max_length=100, verbose_name='Название домашней команды')),
                ('team_away', models.CharField(max_length=100, verbose_name='Название гостевой команды')),
                ('date', models.DateTimeField(verbose_name='Дата')),
                ('championship', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ParserFlashScore.championship', verbose_name='Чемпионат')),
            ],
            options={
                'verbose_name': 'Расписание',
                'verbose_name_plural': 'Расписание',
            },
        ),
        migrations.CreateModel(
            name='Matches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('coach', models.CharField(max_length=100, verbose_name='Тренер')),
                ('season', models.CharField(max_length=50, verbose_name='Сезон')),
                ('date', models.DateField(verbose_name='Дата')),
                ('match_name', models.CharField(max_length=150, verbose_name='Матч')),
                ('odds', models.CharField(max_length=50, null=True, verbose_name='Коэффициенты')),
                ('first_period_score', models.CharField(max_length=30, verbose_name='1-й период счет')),
                ('second_period_score', models.CharField(max_length=30, verbose_name='2-й период счет')),
                ('third_period_score', models.CharField(max_length=30, verbose_name='3-й период счет')),
                ('score', models.CharField(max_length=30, verbose_name='Общий счет')),
                ('moment_end_match', models.CharField(choices=[('MT', 'После основного времени'), ('OT', 'После овертайма'), ('SO', 'После буллитов')], default='MT', max_length=2, verbose_name='Момент окончания матча')),
                ('first_period_shots_on_goal', models.CharField(max_length=30, verbose_name='1-й период броски в створ')),
                ('second_period_shots_on_goal', models.CharField(max_length=30, verbose_name='2-й период броски в створ')),
                ('third_period_shots_on_goal', models.CharField(max_length=30, verbose_name='3-й период броски в створ')),
                ('shots_on_goal', models.CharField(max_length=30, verbose_name='Общие броски в створ')),
                ('first_period_power_play_goals', models.CharField(max_length=30, verbose_name='1-й период голы в большинтсве')),
                ('second_period_power_play_goals', models.CharField(max_length=30, verbose_name='2-й период голы в большинтсве')),
                ('third_period_power_play_goals', models.CharField(max_length=30, verbose_name='3-й период голы в большинтсве')),
                ('power_play_goals', models.CharField(max_length=30, verbose_name='Общие голы в большинтсве')),
                ('first_period_faceoffs_won', models.CharField(max_length=30, verbose_name='1-й период выигранные вбрасывания')),
                ('second_period_faceoffs_won', models.CharField(max_length=30, verbose_name='2-й период выигранные вбрасывания')),
                ('third_period_faceoffs_won', models.CharField(max_length=30, verbose_name='3-й период выигранные вбрасывания')),
                ('faceoffs_won', models.CharField(max_length=30, verbose_name='Общие выигранные вбрасывания')),
                ('first_period_penalties', models.CharField(max_length=30, verbose_name='1-й период 2-х минутные удаления')),
                ('second_period_penalties', models.CharField(max_length=30, verbose_name='2-й период 2-х минутные удаления')),
                ('third_period_penalties', models.CharField(max_length=30, verbose_name='3-й период 2-х минутные удаления')),
                ('penalties', models.CharField(max_length=30, verbose_name='Общие 2-х минутные удаления')),
                ('first_period_hits', models.CharField(max_length=30, verbose_name='1-й период силовые приемы')),
                ('second_period_hits', models.CharField(max_length=30, verbose_name='2-й период силовые приемы')),
                ('third_period_hits', models.CharField(max_length=30, verbose_name='3-й период силовые приемы')),
                ('hits', models.CharField(max_length=30, verbose_name='Общие силовые приемы')),
                ('championship', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ParserFlashScore.championship', verbose_name='Чемпионат')),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ParserFlashScore.teams', verbose_name='Название команды')),
            ],
            options={
                'verbose_name': 'Матч',
                'verbose_name_plural': 'Матчи',
            },
        ),
    ]
