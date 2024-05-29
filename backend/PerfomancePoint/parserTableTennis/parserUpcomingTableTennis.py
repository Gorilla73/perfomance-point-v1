from datetime import datetime

import requests

from parserTableTennis.add_match_to_db import add_matches_to_db


class ParserUpcomingTableTennis:
    def __init__(self):
        self.__championships_url = "https://1xstavka.ru/LineFeed/GetChampsZip"
        self.__games_urls = "https://1xstavka.ru/LineFeed/Get1x2_VZip"
        self.__url_game = "https://1xstavka.ru/LineFeed/GetGameZip"

        self.__headers = {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Cookie": "fast_coupon=true; v3fr=1; lng=ru; flaglng=ru; platform_type=desktop; auid=WNT5hGZId+YzMbZVrDzMAg==; tzo=3; completed_user_settings=true; _ym_uid=1716025320366948695; _ym_d=1716025320; pushfree_status=canceled; SESSION=d492c885c47f4c4f7020d61c5932e880; visit=2-7926aa8087e2d82fa3bc4b082ac1f014; typeBetNames=short; right_side=right; _ym_isad=2; coefview=0; hdt=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoibUs5aGVLUjNVZ3ZXRTlmL25yWjNEZStSZkoxMG5KZUZGTC96dWNyOWxxZWpZMVh3b2FjRmhjZCtzdWo2ckFVeHoyMS9JY29HYnhMVUJxMThWMndZblJiL01DU21qb3dSYXQ5MEZtMzNJTnluQU9LNng0YTVTWmtuTVYzVjREbXJUZDZUam9Ua3NjZzN6Si9xMjBaNmUrb1gwWW5UcnVudGtuZnBUaUVUSG9uRkxWd1V5TVpmdm4xTnQ4RXVUankxb0dsalJudWtURC9hSW1QZ2R6Vkg4SXFNdkd3L1RkbjBFcGl6NE1vWS9oM1VWK0NlSmdKaEtaaTFyVGNYdC8rZmdHUFcyZWpBYWlBOC9VaE5pWmYyWlhDeC9OT3U5ZHR3WDk0ZlcvNFhsWWFzK2JGWUIvYldNN0d1UlRvRkgwblVEZVU2Y0xsSEVUeGxzVkhXRlZseDlXSEc2WXBYdEVGa2FESFhKT2pvc0VSRHQ3Um1OTzVNam1rMmtWNnd2dG5NWERKOU5xTzkxSm9EOE9kMTNEM0xJNmltekE9PSIsImV4cCI6MTcxNjIyMzQ4NSwiaWF0IjoxNzE2MjA5MDg1fQ.mgbs0C1o7rIA_zaE-oFszBJXFvOdo_exeJuX-oD321hG867z3ZxqBCIAJ6ssfiIQ7QlQzN5NtJ9R0s1NqSmJvg; dnb=1; _glhf=1716227065; ggru=188",
            "Host": "1xstavka.ru",
            "Referer": "https://1xstavka.ru/line/table-tennis/2584719-international-tournament-rio-de-janeiro-mixed",
            "Sec-Ch-Ua": "\"Chromium\";v=\"124\", \"Google Chrome\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "\"macOS\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        }

    def parsing(self):
        championships = self.get_championships()

        games = {}
        if championships:
            games = self.get_games(championships)

        all_games_details = []
        if games:
            for championship in games:
                all_games_details.append(self.get_game(championship))

        prepared_data_for_db = {}
        if all_games_details:
            for championship in all_games_details:
                prepared_data_for_db[championship['championship_info']['championship_name']] = (
                    self.prepare_matches_for_db(championship))

        add_matches_to_db(prepared_data_for_db)

    def get_championships(self):
        result_championships = []
        params_championships = {
            "sport": "10",
            "tf": "2200000",
            "tz": "3",
            "country": "1",
            "partner": "51",
            "virtualSports": "true",
            "gr": "44",
            "groupChamps": "true"
        }

        response_championships = requests.get(self.__championships_url, headers=self.__headers,
                                              params=params_championships)
        if response_championships.status_code == 200:
            championships = response_championships.json()

            for main_categories_championship in championships['Value']:
                if "SC" in main_categories_championship:
                    for sub_categories_championship in main_categories_championship['SC']:
                        result_championships.append({
                            'id': sub_categories_championship['LI'],
                            'championship_name': sub_categories_championship['L'],
                            'championship_img_url': sub_categories_championship.get('COIMG', None),
                        })
                else:
                    result_championships.append({
                        'id': main_categories_championship['LI'],
                        'championship_name': main_categories_championship['L'],
                        'championship_img_url': main_categories_championship.get('COIMG', None),
                    })

        return result_championships

    def get_games(self, championships):
        all_games = []
        params_games = {
            "sports": "10",
            "champs": None,
            "count": "50",
            "tf": "2200000",
            "tz": "3",
            "antisports": "188",
            "mode": "4",
            "country": "1",
            "partner": "51",
            "getEmpty": "true",
            "gr": "44"
        }

        for championship in championships:
            params_games['champs'] = championship['id']
            response_games = requests.get(self.__games_urls, headers=self.__headers, params=params_games)
            if response_games.status_code == 200:
                games = response_games.json()
                all_games.append({
                    'championship_info': {
                        'id': championship['id'],
                        'championship_name': championship['championship_name'],
                        'championship_img_url': championship['championship_img_url']
                    },
                    'games': games['Value'],
                })
        return all_games

    def get_game(self, championship):
        games_details = {
            'championship_info': {
                'id': championship['championship_info']['id'],
                'championship_name': championship['championship_info']['championship_name'],
                'championship_img_url': championship['championship_info']['championship_img_url']
            },
            'games': []
        }

        params = {
            "id": None,
            "isSubGames": "true",
            "GroupEvents": "true",
            "allEventsGroupSubGames": "true",
            "countevents": "250",
            "partner": "51",
            "grMode": "2",
            "country": "1",
            "fcountry": "1",
            "marketType": "1",
            "gr": "44",
            "isNewBuilder": "true"
        }

        for game in championship['games']:
            params['id'] = game['CI']
            response = requests.get(self.__url_game, headers=self.__headers, params=params)

            if response.status_code == 200:
                games_details['games'].append(response.json()['Value'])
            else:
                print(
                    f"Failed to get data. Status code: {response.status_code} for id: {game['CI']}")

        return games_details

    @staticmethod
    def prepare_matches_for_db(championship):
        url_image_player = 'https://cdn.1xstavka.ru/sfiles/logo_teams/'
        url_image_championship = 'https://cdn.1xstavka.ru/sfiles/logo-champ/'
        prepared_matches = []

        ODDS = {
            1: 'w1',
            3: 'w2',
            9: 'over',
            10: 'under',
            7: 'handicap',
            8: 'handicap',
            11: 'over',
            12: 'under',
            13: 'over',
            14: 'under'
        }

        for match in championship['games']:
            doubles = False
            if len(match['O1'].split('/')) > 1:
                doubles = True
            prepared_match = {
                'team1': {
                    'player1': match['O1'].split('/')[0].strip(),
                    'player2': match['O1'].split('/')[1].strip() if doubles else None,
                    'player1_image_url': url_image_player + match['O1IMG'][0],
                    'player2_image_url': url_image_player + match['O1IMG'][1] if doubles else None
                },
                'team2': {
                    'player1': match['O2'].split('/')[0].strip(),
                    'player2': match['O2'].split('/')[1].strip() if doubles else None,
                    'player1_image_url': url_image_player + match['O2IMG'][0],
                    'player2_image_url': url_image_player + match['O2IMG'][1] if doubles else None
                },
                'league': match['L'],
                'league_image_url': url_image_championship + championship['championship_info']['championship_img_url']
                if championship['championship_info']['championship_img_url'] else None,
                'date': datetime.fromtimestamp(match['S']),
                'odds': {
                    'timestamp': datetime.now().isoformat(),
                    'w1': None,
                    'w2': None,
                    'totals': {'over': [], 'under': []},
                    'handicap 1': [],
                    'handicap 2': [],
                    'ind totals 1': {'over': [], 'under': []},
                    'ind totals 2': {'over': [], 'under': []}
                },
            }
            count_handicaps = sum(1 for event_group in match['GE']
                                  for event_list in event_group['E']
                                  for odds in event_list if odds['G'] == 3
                                  )
            current_count_handicaps = 0

            for event_group in match['GE']:
                for event_list in event_group['E']:
                    for odds in event_list:
                        odds_type = odds['T']
                        if odds_type in ODDS:
                            if odds_type == 1:
                                prepared_match['odds']['w1'] = odds['C']
                            elif odds_type == 3:
                                prepared_match['odds']['w2'] = odds['C']
                            elif odds_type in [7, 8]:
                                # такое бывает {'C': 1.83, 'CE': 1, 'G': 3, 'T': 7} - предполагаю, что это фора ноль
                                key = None
                                if 'P' not in odds:
                                    key = '0'
                                else:
                                    key = str(odds['P'])

                                if current_count_handicaps <= (count_handicaps / 2) - 1:
                                    prepared_match['odds']['handicap 1'].append((key, odds['C']))
                                else:
                                    prepared_match['odds']['handicap 2'].append((key, odds['C']))
                                current_count_handicaps += 1
                            elif odds_type in [9, 10]:
                                key = ODDS[odds_type]
                                prepared_match['odds']['totals'][key].append((str(odds['P']), odds['C']))
                            elif odds_type in [11, 12]:
                                key = ODDS[odds_type]
                                prepared_match['odds']['ind totals 1'][key].append((str(odds['P']), odds['C']))
                            elif odds_type in [13, 14]:
                                key = ODDS[odds_type]
                                prepared_match['odds']['ind totals 2'][key].append((str(odds['P']), odds['C']))

            print(prepared_match)
            prepared_matches.append(prepared_match)

        return prepared_matches


if __name__ == '__main__':
    parser = ParserUpcomingTableTennis()
    parser.parsing()
