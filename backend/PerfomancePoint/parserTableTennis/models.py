from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=255, verbose_name='Имя игрока')
    image = models.ImageField(upload_to='player_images/', null=True, blank=True, verbose_name='Фото игрока')

    def __str__(self):
        return self.name


class League(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='league_images/', null=True, blank=True, verbose_name='Фото лиги')

    def __str__(self):
        return self.name


class Team(models.Model):
    player1 = models.ForeignKey(Player, related_name='team_player1', on_delete=models.CASCADE, verbose_name='Игрок 1')
    player2 = models.ForeignKey(Player, related_name='team_player2', on_delete=models.CASCADE, verbose_name='Игрок 2',
                                null=True, blank=True)
    doubles = models.BooleanField(default=False, verbose_name='Пара')

    def __str__(self):
        if self.doubles:
            return f"{self.player1} / {self.player2}"
        return str(self.player1)


class Match(models.Model):
    league = models.ForeignKey(League, related_name='matches', on_delete=models.CASCADE, verbose_name='Лига')
    team1 = models.ForeignKey(Team, related_name='matches_as_team1', on_delete=models.CASCADE, verbose_name='Команда 1')
    team2 = models.ForeignKey(Team, related_name='matches_as_team2', on_delete=models.CASCADE, verbose_name='Команда 2')
    date = models.DateTimeField(verbose_name='Дата')
    odds = models.JSONField(default=dict, verbose_name='Коэффициенты')
    result = models.JSONField(default=dict, verbose_name='Результат')  # Счет матчей и сетов

    def __str__(self):
        return f"Match between {self.team1} and {self.team2} on {self.date}"

# Пример структуры данных для result и odds:
# result = {
#     "status": "Отмена матча" / "Перенесен" / "Завершен"
#     "winner": "player1",
#      "score": "3:0"
#     "sets": [
#         {"set_number": 1, "player1_score": 11, "player2_score": 9},
#         {"set_number": 2, "player1_score": 7, "player2_score": 11},
#         {"set_number": 3, "player1_score": 11, "player2_score": 5}
#     ]
# }
# odds = {
#     "initial": {
#         "timestamp": "2024-05-22T10:00:00Z",
#         "player1": 1.5,
#         "player2": 2.5,
#         "totals": {"over_3.5": 1.8, "under_3.5": 1.9}
#     },
#     "updates": [
#         {
#             "timestamp": "2024-05-22T11:00:00Z",
#             "player1": 1.4,
#             "player2": 2.6,
#             "totals": {"over_3.5": 1.75, "under_3.5": 2.0}
#         },
#         {
#             "timestamp": "2024-05-22T12:00:00Z",
#             "player1": 1.3,
#             "player2": 2.7,
#             "totals": {"over_3.5": 1.7, "under_3.5": 2.1}
#         }
#     ]
# }
