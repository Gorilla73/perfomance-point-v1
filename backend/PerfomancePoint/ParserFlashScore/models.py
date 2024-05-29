from django.db import models

from django.db import models


class Championship(models.Model):
    championship = models.CharField(max_length=40, unique=True, verbose_name="Чемпионат")
    image_country_championship = models.FileField(upload_to='svg/')

    class Meta:
        verbose_name = "Чемпионат"
        verbose_name_plural = "Чемпионаты"

    def __str__(self):
        return self.championship


class Teams(models.Model):
    team_name = models.CharField(max_length=50, unique=True, verbose_name="Название команды")
    championship = models.ForeignKey(Championship, on_delete=models.CASCADE, max_length=60)
    image_team = models.FileField(upload_to='svg/')

    class Meta:
        verbose_name = "Команда"
        verbose_name_plural = "Команды"

    def __str__(self):
        return self.team_name


class Matches(models.Model):

    MAIN_TIME = 'MT'
    OVERTIME = 'OT'
    SHOOTOUT = 'SO'

    MOMENT_END_MATCH = [
        (MAIN_TIME, 'После основного времени'),
        (OVERTIME, 'После овертайма'),
        (SHOOTOUT, 'После буллитов'),
    ]

    team = models.ForeignKey(Teams, on_delete=models.CASCADE, verbose_name="Название команды")
    coach = models.CharField(max_length=100, verbose_name="Тренер")
    season = models.CharField(max_length=50, verbose_name="Сезон")
    championship = models.ForeignKey(Championship, on_delete=models.CASCADE, verbose_name="Чемпионат")
    date = models.DateField(verbose_name="Дата")
    match_name = models.CharField(max_length=150, verbose_name="Матч")
    odds = models.CharField(max_length=50, null=True, verbose_name="Коэффициенты")
    first_period_score = models.CharField(max_length=30, verbose_name="1-й период счет")
    second_period_score = models.CharField(max_length=30, verbose_name="2-й период счет")
    third_period_score = models.CharField(max_length=30, verbose_name="3-й период счет")
    score = models.CharField(max_length=30, verbose_name="Общий счет")
    moment_end_match = models.CharField(max_length=2, choices=MOMENT_END_MATCH, default=MAIN_TIME,
                                        verbose_name="Момент окончания матча")
    first_period_shots_on_goal = models.CharField(max_length=30, verbose_name="1-й период броски в створ")
    second_period_shots_on_goal = models.CharField(max_length=30, verbose_name="2-й период броски в створ")
    third_period_shots_on_goal = models.CharField(max_length=30, verbose_name="3-й период броски в створ")
    shots_on_goal = models.CharField(max_length=30, verbose_name="Общие броски в створ")
    first_period_power_play_goals = models.CharField(max_length=30, verbose_name="1-й период голы в большинтсве")
    second_period_power_play_goals = models.CharField(max_length=30, verbose_name="2-й период голы в большинтсве")
    third_period_power_play_goals = models.CharField(max_length=30, verbose_name="3-й период голы в большинтсве")
    power_play_goals = models.CharField(max_length=30, verbose_name="Общие голы в большинтсве")
    first_period_faceoffs_won = models.CharField(max_length=30, verbose_name="1-й период выигранные вбрасывания")
    second_period_faceoffs_won = models.CharField(max_length=30, verbose_name="2-й период выигранные вбрасывания")
    third_period_faceoffs_won = models.CharField(max_length=30, verbose_name="3-й период выигранные вбрасывания")
    faceoffs_won = models.CharField(max_length=30, verbose_name="Общие выигранные вбрасывания")
    first_period_penalties = models.CharField(max_length=30, verbose_name="1-й период 2-х минутные удаления")
    second_period_penalties = models.CharField(max_length=30, verbose_name="2-й период 2-х минутные удаления")
    third_period_penalties = models.CharField(max_length=30, verbose_name="3-й период 2-х минутные удаления")
    penalties = models.CharField(max_length=30, verbose_name="Общие 2-х минутные удаления")
    first_period_hits = models.CharField(max_length=30, verbose_name="1-й период силовые приемы")
    second_period_hits = models.CharField(max_length=30, verbose_name="2-й период силовые приемы")
    third_period_hits = models.CharField(max_length=30, verbose_name="3-й период силовые приемы")
    hits = models.CharField(max_length=30, verbose_name="Общие силовые приемы")


    class Meta:
        verbose_name = "Матч"
        verbose_name_plural = "Матчи"

    def __str__(self):
        return self.match_name


class MatchesShedule(models.Model):

    championship = models.ForeignKey(Championship, on_delete=models.CASCADE, verbose_name="Чемпионат")
    team_home = models.CharField(max_length=100, verbose_name="Название домашней команды")
    team_away = models.CharField(max_length=100, verbose_name="Название гостевой команды")
    date = models.DateTimeField(verbose_name="Дата")

    class Meta:
        verbose_name = "Расписание"
        verbose_name_plural = "Расписание"

    def __str__(self):
        return f'{self.team_home} - {self.team_away}'



