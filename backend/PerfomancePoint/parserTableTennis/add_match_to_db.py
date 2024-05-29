from datetime import datetime

import requests
from django.core.files.base import ContentFile
from django.db import transaction


# from parserTableTennis.models import Player, League, Match


def add_matches_to_db(prepared_data):
    for championship in prepared_data:
        print(championship, len(prepared_data[championship]))
        for match in prepared_data[championship]:
            print(match)
            image = download_image(match['team1']['player1_image_url'])
            print(image)
            # add_match_to_db(match)


def add_match_to_db(match_data):
    with transaction.atomic():
        player1_team1, created1_team1 = Player.objects.get_or_create(name=match_data['team1']['player1'])
        player2_team1, created2_team1 = Player.objects.get_or_create(name=match_data['team1']['player2'])
        team1, created_team1 = Team.objects.get_or_create(player1=player1_team1, player2=player2_team1)

        if created1_team1 and match_data['team1'].get('player1_image_url'):
            image = download_image(match_data['team1']['player1_image_url'])
            if image:
                player1_team1.image.save(f"{player1_team1.name}.jpg", image)
        if created2_team1 and match_data['team1'].get('player2_image_url'):
            image = download_image(match_data['team1']['player2_image_url'])
            if image:
                player2_team1.image.save(f"{player2_team1.name}.jpg", image)

        player1_team2, created1_team2 = Player.objects.get_or_create(name=match_data['team2']['player1'])
        player2_team2, created2_team2 = Player.objects.get_or_create(name=match_data['team2']['player2'])
        team2, created_team2 = Team.objects.get_or_create(player1=player1_team2, player2=player2_team2)

        if created1_team2 and match_data['team2'].get('player1_image_url'):
            image = download_image(match_data['team2']['player1_image_url'])
            if image:
                player1_team2.image.save(f"{player1_team2.name}.jpg", image)
        if created2_team2 and match_data['team2'].get('player2_image_url'):
            image = download_image(match_data['team2']['player2_image_url'])
            if image:
                player2_team2.image.save(f"{player2_team2.name}.jpg", image)

        league, created_league = League.objects.get_or_create(name=match_data['league'])

        if created_league and match_data.get('league_image_url'):
            image = download_image(match_data['league_image_url'])
            if image:
                league.image.save(f"{league.name}.jpg", image)

        match_date = match_data['date']

        match, created = Match.objects.get_or_create(
            league=league,
            team1=team1,
            team2=team2,
            date=match_date,
            defaults={'odds': {'initial': match_data.get('odds', {})}, 'result': match_data.get('result', {})}
        )

        if not created:
            if 'updates' not in match.odds:
                match.odds['updates'] = []
            match.odds['updates'].append({
                'timestamp': match_data['odds']['timestamp'],
                'w1': match_data['odds']['w1'],
                'w2': match_data['odds']['w2'],
                'totals': match_data['odds']['totals'],
                'handicap 1': match_data['odds'].get('handicap 1', {}),
                'handicap 2': match_data['odds'].get('handicap 2', {}),
                'ind totals 1': match_data['odds'].get('ind totals 1', {}),
                'ind totals 2': match_data['odds'].get('ind totals 2', {})
            })
            match.save()

        return match


def download_image(url):
    if url:
        response = requests.get(url)
        if response.status_code == 200:
            return ContentFile(response.content)
    return None
