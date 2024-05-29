from datetime import datetime, timedelta
import requests

from parserTableTennis.add_match_to_db import add_matches_to_db


class ParserResultTableTennis:

    def __init__(self):

        self.__url_championship = "https://1xstavka.ru/service-api/result/web/api/v1/champs"
        self.__url_games = "https://1xstavka.ru/service-api/result/web/api/v1/games"

        self.__headers = {
            "Accept": "application/json, text/plain, */*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Cookie": "fast_coupon=true; v3fr=1; lng=ru; flaglng=ru; platform_type=desktop; auid=WNT5hGZId+YzMbZVrDzMAg==; tzo=3; completed_user_settings=true; _ym_uid=1716025320366948695; _ym_d=1716025320; pushfree_status=canceled; SESSION=d492c885c47f4c4f7020d61c5932e880; visit=2-7926aa8087e2d82fa3bc4b082ac1f014; typeBetNames=short; right_side=right; _ym_isad=2; hdt=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiYnZ6eElubVIvWUIrZjFESkR4YjRDcmlsRGtjVFBDTWVxdDBNaTByY0hHcDNJY1M4cTJOWDFtQXczTlZXRncxSkVOU1hoQlJVOGVuVkxvcEZMMHc4eHg2cFZQU01lbWFrZ0w3OGxQWm42U0N5bjQvVVNFRFhYOHQxUUJlaVhhUHlVTEhFK3lZbHl4aXR5WUp3a1dYa1M0M0hyUkNSOHE5c0VBTXFVZUtkdm5LSzNSVS85ekRNQnIwbVJTbFdTbFNIaTF0dTdLUS9CcU84M3BIamxkemNoL252TFRYNm9lMisrS2d0TEtzeWp4RmtNSS9LRHFaSGJjUG15eWJUWk9sTnRaVkFPN0tKOVBuTmhDKzlsblBubnRGSEFVSW1KWTkrek50WVRtYmlLK0J0OWptdU1aaWlaYUFCSHI2Qmo5K3JQb2FkKzA3Q3dkR2lxRk4yNWJsMm1rM2VpRE1xcDFpb2hhd2NvbG1RZzJBd25ONnBWdk45T1NzLy9sMnFxOGgyeE9lL3RmS2E2c2RKdU9WRGxtZzFRT3ZRNlE9PSIsImV4cCI6MTcxNjE0MjQxNiwiaWF0IjoxNzE2MTI4MDE2fQ.nVHveP5F-eqeHQJoq3sl143dcxwjrjE0H9-IyAc1edEHdX-lC1OiDcJc3MeRizNx7FjNcZOvY0vCgrUJxu0QzA; _glhf=1716154083; ggru=146",
            "Host": "1xstavka.ru",
            "Referer": "https://1xstavka.ru/results",
            "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "\"macOS\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "X-Hd": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiYnZ6eElubVIvWUIrZjFESkR4YjRDcmlsRGtjVFBDTWVxdDBNaTByY0hHcDNJY1M4cTJOWDFtQXczTlZXRncxSkVOU1hoQlJVOGVuVkxvcEZMMHc4eHg2cFZQU01lbWFrZ0w3OGxQWm42U0N5bjQvVVNFRFhYOHQxUUJlaVhhUHlVTEhFK3lZbHl4aXR5WUp3a1dYa1M0M0hyUkNSOHE5c0VBTXFVZUtkdm5LSzNSVS85ekRNQnIwbVJTbFdTbFNIaTF0dTdLUS9CcU84M3BIamxkemNoL252TFRYNm9lMisrS2d0TEtzeWp4RmtNSS9LRHFaSGJjUG15eWJUWk9sTnRaVkFPN0"
        }

    def parsing(self, start_date, end_date):
        current_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        while current_date < end_date:

            date_from = current_date.strftime("%Y-%m-%d 23:59:59")
            next_day = current_date + timedelta(days=1)
            date_to = next_day.strftime("%Y-%m-%d 23:59:59")

            date_from_ts = int(datetime.strptime(date_from, "%Y-%m-%d %H:%M:%S").timestamp())
            date_to_ts = int(datetime.strptime(date_to, "%Y-%m-%d %H:%M:%S").timestamp())
            championships = self.get_championships(date_from_ts, date_to_ts)
            games = self.get_matches(championships, date_from_ts, date_to_ts)

            prepare_data = {}
            for championship in games:
                prepare_data[championship] = self.prepare_data_for_db(games[championship])

            add_matches_to_db(prepare_data)

            current_date = next_day

    def get_championships(self, date_from_ts, date_to_ts):
        championships = None
        # date_from_ts = int(datetime.strptime(date_from, "%Y-%m-%d %H:%M:%S").timestamp())
        # date_to_ts = int(datetime.strptime(date_to, "%Y-%m-%d %H:%M:%S").timestamp())

        params = {
            "sportIds": "10",
            "dateFrom": date_from_ts,
            "dateTo": date_to_ts,
            "presenceOfVideoBroadcast": "false",
            "lng": "ru",
            "ref": "51",
            "gr": "44",
            "country": "1"
        }

        response = requests.get(self.__url_championship, params=params, headers=self.__headers)

        if response.status_code == 200:
            print(f"Data from {datetime.fromtimestamp(date_from_ts)} to {datetime.fromtimestamp(date_to_ts)}: ")
            championships = response.json()
        else:
            print(
                f"Failed to get data. Status code: {response.status_code} for dates {datetime.fromtimestamp(date_from_ts)} to {datetime.fromtimestamp(date_to_ts)}")

        return championships

    def get_matches(self, championships, date_from_ts, date_to_ts):
        games = {}

        params = {
            "champId": None,
            "dateFrom": date_from_ts,
            "dateTo": date_to_ts,
            "presenceOfVideoBroadcast": "false",
            "lng": "ru",
            "ref": "51",
            "gr": "44",
            "country": "1"
        }

        if 'items' not in championships:
            return

        for championship in championships['items']:
            params['champId'] = championship['id']

            response = requests.get(self.__url_games, params=params, headers=self.__headers)

            if response.status_code == 200:
                games[championship['name']] = response.json()['items']
            else:
                print(
                    f"Failed to get data. Status code: {response.status_code} for dates {datetime.fromtimestamp(date_from_ts)} to {datetime.fromtimestamp(date_to_ts)}")

        return games

    def prepare_data_for_db(self, matches):
        url_image = 'https://cdn.1xstavka.ru/sfiles/logo_teams/'
        prepared_data = []
        for match in matches:

            doubles = False
            if len(match['opp1'].split('/')) > 1:
                doubles = True

            match_data = {
                'league': match['champName'],
                'league_image_url': None,
                'team1': {
                    'player1': match['opp1'].split('/')[0].strip(),
                    'player2': match['opp1'].split('/')[1].strip() if doubles else None,
                    'player1_image_url': url_image + match['opp1Images'][0],
                    'player2_image_url': url_image + match['opp1Images'][1] if doubles else None
                },
                'team2': {
                    'player1': match['opp2'].split('/')[0].strip(),
                    'player2': match['opp2'].split('/')[1].strip() if doubles else None,
                    'player1_image_url': url_image + match['opp2Images'][0],
                    'player2_image_url': url_image + match['opp2Images'][1] if doubles else None
                },
                'date': datetime.fromtimestamp(match['dateStart']),
            }

            if 'status' in match and 'score' not in match:
                print(match['status'], match)
                match_data['result'] = {
                    'status': 'Завершен',
                    'winner': '',
                    'score': '',
                    'sets': []
                }
            else:
                winner, score, sets = self.get_result(match['score'])
                match_data['result'] = {
                    'status': 'Завершен',
                    'winner': winner,
                    'score': score,
                    'sets': sets
                }

            print(match_data)
            prepared_data.append(match_data)

        return prepared_data

    @staticmethod
    def get_result(score):
        winner = 'player1'
        score, sets = score.split(" ")
        if int(score.split(':')[0]) < int(score.split(':')[1]):
            winner = 'player2'

        sets = sets[1:len(sets) - 1].split(',')  # (11:2,11:9,11:6) -> ['11:2', '11:9', '11:6']

        result_sets = []

        for i, set_game in enumerate(sets):
            player1_score, player2_score = set_game.split(':')
            result_sets.append({
                'set_number': i + 1,
                'player1_score': int(player1_score),
                'player2_score': int(player2_score),
            })

        return winner, score, result_sets


if __name__ == '__main__':
    parser = ParserResultTableTennis()
    parser.parsing("2024-05-16", "2024-05-17")

# Формат даты: (ГГГГ-MM-ДД)
# Для parser.parsing("2024-05-16", "2024-05-17") - Data from 2024-05-16 23:59:59 to 2024-05-17 23:59:59
