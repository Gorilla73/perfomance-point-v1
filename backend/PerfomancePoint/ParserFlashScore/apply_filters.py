from django.db.models import Q

from ParserFlashScore.models import Matches, Championship, Teams
from ParserFlashScore.utils import dictionary_average_each_team

import numpy


def apply_all_filters(team, team_opponent, statistic, period, count_last_matches, place, seasons,
                      championships, odds, selected_average_filter, value_average_filter,
                      result_after_period, coach):
    result = statistic_period_count_last_match_filter(team, statistic, period, count_last_matches)
    result = place_filter(team, result, place)
    result = seasons_filter(result, seasons)
    result = championships_filter(result, championships)
    result = odds_filter(team, result, odds)
    result = average_filter(team, team_opponent, championships, result, selected_average_filter, value_average_filter,
                            statistic, period)
    result = result_after_period_filter(team, result, result_after_period)
    result = couch_filter(result, coach)
    result = format_data(result)

    return result


def statistic_period_count_last_match_filter(team, statistic, period, count_last_matches, head_to_head=False,
                                             team_opponent=None):
    if not (count_last_matches.isdigit()):
        return []

    if head_to_head:
        matches = Matches.objects.filter(
            Q(team=team) & Q(match_name=f"{team.team_name}-{team_opponent.team_name}")
            | Q(match_name=f"{team_opponent.team_name}-{team.team_name}")
        )
    else:
        matches = Matches.objects.filter(team=team).order_by('-date')

    result = []
    for match in matches:
        object_match = {}
        object_match['id'] = match.id
        object_match['owner_team'] = {
            'id': team.id,
            'name': team.team_name
        }
        object_match['championship'] = {
            'id': Championship.objects.get(championship=match.championship).id,
            'name': Championship.objects.get(championship=match.championship).championship
        }
        object_match['season'] = match.season
        object_match['date'] = match.date
        object_match['team_home'] = {
            'id': Teams.objects.get(team_name=match.match_name.split('-')[0]).id,
            'name': Teams.objects.get(team_name=match.match_name.split('-')[0]).team_name,
        }
        object_match['team_away'] = {
            'id': Teams.objects.get(team_name=match.match_name.split('-')[1]).id,
            'name': Teams.objects.get(team_name=match.match_name.split('-')[1]).team_name,
        }
        object_match['score_team_home'] = match.score.split('-')[0]
        object_match['score_team_away'] = match.score.split('-')[1]
        object_match['score'] = int(object_match['score_team_home']) + int(object_match['score_team_away'])
        object_match['moment_end_match'] = match.moment_end_match
        object_match['first_period_score'] = match.first_period_score
        object_match['second_period_score'] = match.second_period_score

        if period == 'all':
            if statistic == 'score':
                object_match['statistic_team_home'] = int(match.first_period_score.split('-')[0]) + \
                                                      int(match.second_period_score.split('-')[0]) + \
                                                      int(match.third_period_score.split('-')[0])
                object_match['statistic_team_away'] = int(match.first_period_score.split('-')[1]) + \
                                                      int(match.second_period_score.split('-')[1]) + \
                                                      int(match.third_period_score.split('-')[1])
                object_match['statistic'] = object_match['statistic_team_home'] + object_match['statistic_team_away']
            else:
                object_match['statistic_team_home'] = getattr(match, statistic).split('-')[0]
                object_match['statistic_team_away'] = getattr(match, statistic).split('-')[1]
                object_match['statistic'] = int(object_match['statistic_team_home']) + int(
                    object_match['statistic_team_away'])
        elif period == 'after_1st_period':
            if statistic == 'score':
                object_match['statistic_team_home'] = int(match.second_period_score.split('-')[0]) + \
                                                      int(match.third_period_score.split('-')[0])
                object_match['statistic_team_away'] = int(match.second_period_score.split('-')[1]) + \
                                                      int(match.third_period_score.split('-')[1])
                object_match['statistic'] = object_match['statistic_team_home'] + object_match['statistic_team_away']
            else:
                object_match['statistic_team_home'] = int(getattr(match, f"second_period_{statistic}").split('-')[0])
                object_match['statistic_team_away'] = int(getattr(match, f"second_period_{statistic}").split('-')[1])
                object_match['statistic_team_home'] += int(getattr(match, f"third_period_{statistic}").split('-')[0])
                object_match['statistic_team_away'] += int(getattr(match, f"third_period_{statistic}").split('-')[1])
                object_match['statistic'] = int(object_match['statistic_team_home']) + int(
                    object_match['statistic_team_away'])
        else:
            object_match['statistic_team_home'] = int(getattr(match, f"{period}_{statistic}").split('-')[0])
            object_match['statistic_team_away'] = int(getattr(match, f"{period}_{statistic}").split('-')[1])
            object_match['statistic'] = int(object_match['statistic_team_home']) + int(
                object_match['statistic_team_away'])

        object_match['odds'] = match.odds
        object_match['coach'] = match.coach
        object_match['moment_end_match'] = match.moment_end_match

        result.append(object_match)

    return result[0:int(count_last_matches)]


def place_filter(team, list_matches, place):
    if len(list_matches) == 0:
        return []

    if place == 'all':
        return list_matches

    result = []
    if place == 'home':
        for match in list_matches:
            if match['team_home']['name'] == team.team_name:
                result.append(match)
    if place == 'away':
        for match in list_matches:
            if match['team_away']['name'] == team.team_name:
                result.append(match)

    return result


def seasons_filter(list_matches, seasons):
    if len(list_matches) == 0:
        return []

    result = []
    for match in list_matches:
        if match['season'] in seasons:
            result.append(match)

    return result


def championships_filter(list_matches, championships):
    if len(list_matches) == 0:
        return []

    result = []
    for match in list_matches:
        if match['championship']['name'] in championships:
            result.append(match)

    return result


def odds_filter(team, list_matches, odds):
    if len(list_matches) == 0:
        return []

    if odds == 'any any':
        return list_matches

    result = []
    if odds == '1.5 any':
        for match in list_matches:
            if match['team_home']['name'] == team.team_name:
                if float(match['odds'].split(' ')[0]) < 1.5:
                    result.append(match)
            else:
                if float(match['odds'].split(' ')[2]) < 1.5:
                    result.append(match)

    elif odds == 'any 1.5':
        for match in list_matches:
            if match['team_home']['name'] == team.team_name:
                if float(match['odds'].split(' ')[2]) < 1.5:
                    result.append(match)
            else:
                if float(match['odds'].split(' ')[0]) < 1.5:
                    result.append(match)

    else:

        if not (odds.split(' ')[0].replace(".", '', 1).isdigit() and odds.split(' ')[1].replace(".", '', 1).isdigit()):
            return []

        for match in list_matches:
            if match['team_home']['name'] == team.team_name:
                if float(odds.split(' ')[0]) < float(match['odds'].split(' ')[0]) < float(odds.split(' ')[1]):
                    result.append(match)
            else:
                if float(odds.split(' ')[0]) < float(match['odds'].split(' ')[2]) < float(odds.split(' ')[1]):
                    result.append(match)

    return result


def average_filter(team, team_opponent, championships, list_matches, selected_average_filter, value_average_filter,
                   statistic, period):
    if len(list_matches) == 0:
        return []

    if selected_average_filter == 'all':
        return list_matches

    average_data_each_team = dictionary_average_each_team(championships, statistic, period)

    result = []
    value_average_filter_opponent_team = average_data_each_team[team_opponent.team_name][selected_average_filter]
    left_border = value_average_filter_opponent_team - float(value_average_filter)
    right_border = value_average_filter_opponent_team + float(value_average_filter)

    for match in list_matches:
        if match['team_home']['name'] != team.team_name:
            if left_border <= average_data_each_team[match['team_home']['name']][
                                            selected_average_filter] <= right_border:
                result.append(match)
        else:
            if left_border <= average_data_each_team[match['team_away']['name']][
                                            selected_average_filter] <= right_border:
                result.append(match)

    return result


def result_after_period_filter(team, list_matches, result_after_period):
    if len(list_matches) == 0:
        return []

    if result_after_period == 'all':
        return list_matches

    result = []
    for match in list_matches:
        if match['team_home']['name'] == team.team_name:
            team_current_score = int(match['first_period_score'].split('-')[0])
            team_opponent_score = int(match['first_period_score'].split('-')[1])
        else:
            team_current_score = int(match['first_period_score'].split('-')[1])
            team_opponent_score = int(match['first_period_score'].split('-')[0])

        if result_after_period == 'win_after_1st_period':
            if team_current_score > team_opponent_score:
                result.append(match)
        elif result_after_period == 'draw_after_1st_period':
            if team_current_score == team_opponent_score:
                result.append(match)
        elif result_after_period == 'lose_after_1st_period':
            if team_current_score < team_opponent_score:
                result.append(match)
        else:
            if match['team_home']['name'] == team.team_name:
                team_current_score += int(match['second_period_score'].split('-')[0])
                team_opponent_score += int(match['second_period_score'].split('-')[1])
            else:
                team_current_score += int(match['second_period_score'].split('-')[1])
                team_opponent_score += int(match['second_period_score'].split('-')[0])

            if result_after_period == 'win_after_2st_period':
                if team_current_score > team_opponent_score:
                    result.append(match)
            elif result_after_period == 'draw_after_2st_period':
                if team_current_score == team_opponent_score:
                    result.append(match)
            elif result_after_period == 'lose_after_2st_period':
                if team_current_score < team_opponent_score:
                    result.append(match)

    return result


def couch_filter(list_matches, coach):
    if len(list_matches) == 0:
        return []

    if coach == 'all':
        return list_matches

    current_coach = list_matches[0]['coach']
    result = []
    for match in list_matches:
        if current_coach == match['coach']:
            result.append(match)
        else:
            break

    print(len(result))
    return result


# HEAD_TO_HEAD
def apply_all_filters_head_to_head(team, team_opponent, statistic, period, count_last_match, place, seasons,
                                   championships, result_after_period):
    result = statistic_period_count_last_match_filter(team, statistic, period, count_last_match, head_to_head=True,
                                                      team_opponent=team_opponent)
    result = place_filter_head_to_head(result, team, place)
    result = seasons_filter(result, seasons)
    result = championships_filter(result, championships)
    result = result_after_period_head_to_head(result, team, result_after_period)

    result = format_data(result)
    return result


def result_after_period_head_to_head(list_matches, team, result_after_period):
    if len(list_matches) == 0:
        return []

    if result_after_period == 'all':
        return list_matches

    result = []
    for match in list_matches:
        if match['team_home']['name'] == team.team_name:
            team_home_score = int(match['first_period_score'].split('-')[0])
            team_opponent_score = int(match['first_period_score'].split('-')[1])
        else:
            team_home_score = int(match['first_period_score'].split('-')[1])
            team_opponent_score = int(match['first_period_score'].split('-')[0])

        if result_after_period == 'team_home_win_after_1st_period' or result_after_period == 'team_away_lose_after_1st_period':
            if team_home_score > team_opponent_score:
                result.append(match)
        elif result_after_period == 'team_home_lose_after_1st_period' or result_after_period == 'team_away_win_after_1st_period':
            if team_home_score < team_opponent_score:
                result.append(match)
        elif result_after_period == 'draw_after_1st_period':
            if team_home_score == team_opponent_score:
                result.append(match)
        else:
            if match['team_home']['name'] == team.team_name:
                team_home_score += int(match['second_period_score'].split('-')[0])
                team_opponent_score += int(match['second_period_score'].split('-')[1])
            else:
                team_home_score += int(match['second_period_score'].split('-')[1])
                team_opponent_score += int(match['second_period_score'].split('-')[0])

            if result_after_period == 'team_home_win_after_2st_period' or result_after_period == 'team_away_lose_after_2st_period':
                if team_home_score > team_opponent_score:
                    result.append(match)
            elif result_after_period == 'team_home_lose_after_2st_period' or result_after_period == 'team_away_win_after_2st_period':
                if team_home_score < team_opponent_score:
                    result.append(match)
            elif result_after_period == 'draw_after_2st_period':
                if team_home_score == team_opponent_score:
                    result.append(match)

    return result


def place_filter_head_to_head(list_matches, team, place):
    if len(list_matches) == 0:
        return []

    if place == 'all':
        return list_matches

    result = []
    if place == 'consider_place':
        for match in list_matches:
            if match['team_home']['name'] == team.team_name:
                result.append(match)

    return result


# Championship
def apply_all_filter_championship(statistic, period, count_last_matches, place, seasons, championship, odds,
                                  result_after_period):
    teams = (Matches.objects.filter(Q(season__in=seasons) &
                                    Q(championship=championship)).values_list('team', flat=True).distinct())
    teams = [Teams.objects.get(id=team) for team in teams]

    result_all_tables = []
    for i in range(len(teams)):
        result_team = statistic_period_count_last_match_filter(teams[i], statistic, period, count_last_matches)
        result_team = place_filter(teams[i], result_team, place)
        result_team = seasons_filter(result_team, seasons)
        result_team = championships_filter(result_team, [championship.championship])
        result_team = odds_filter(teams[i], result_team, odds)
        result_team = result_after_period_filter(teams[i], result_team, result_after_period)

        result_all_tables.append(table_average_data_championship(teams[i], result_team))

    return result_all_tables


def table_average_data_championship(team, list_matches):
    team_id = Teams.objects.get(team_name=team.team_name).pk
    if len(list_matches) == 0:
        return {
            'id': team_id,
            'team_name': team.team_name,
            'games': len(list_matches),
            'win': 0,
            'draw': 0,
            'lose': 0,
            'averageDifference': 0,
            'averageIndTotal': 0,
            'averageIndTotalOpp': 0,
            'sharedTotal': 0,
            'averageDeviationIndTotal': 0,
            'averageDeviationIndTotalOpp': 0,
            'averageDeviationSharedTotal': 0,
        }

    table_average_data = {
        'id': team_id,
        'team_name': team.team_name,
        'games': len(list_matches),
        'win': 0,
        'draw': 0,
        'lose': 0,
        'averageDifference': 0,
        'averageIndTotal': 0,
        'averageIndTotalOpp': 0,
        'sharedTotal': 0,
        'averageDeviationIndTotal': 0,
        'averageDeviationIndTotalOpp': 0,
        'averageDeviationSharedTotal': 0,
    }
    list_ind_total = [int(match['statistic_team_home']) if match['team_home']['name'] == team.team_name
                      else int(match['statistic_team_away']) for match in list_matches]
    list_ind_total_opp = [int(match['statistic_team_home']) if match['team_home']['name'] != team.team_name
                          else int(match['statistic_team_away']) for match in list_matches]
    list_shared_total = [int(match['statistic']) for match in list_matches]

    table_average_data['averageDeviationIndTotal'] = round(numpy.std(list_ind_total), 2)
    table_average_data['averageDeviationIndTotalOpp'] = round(numpy.std(list_ind_total_opp), 2)
    table_average_data['averageDeviationSharedTotal'] = round(numpy.std(list_shared_total), 2)

    for match in list_matches:
        if match['team_home']['name'] == team.team_name:
            if int(match['statistic_team_home']) > int(match['statistic_team_away']):
                table_average_data['win'] += 1
            elif int(match['statistic_team_home']) == int(match['statistic_team_away']):
                table_average_data['draw'] += 1
            else:
                table_average_data['lose'] += 1

            table_average_data['averageDifference'] += (
                    int(match['statistic_team_home']) - int(match['statistic_team_away']))
            table_average_data['averageIndTotal'] += int(match['statistic_team_home'])
            table_average_data['averageIndTotalOpp'] += int(match['statistic_team_away'])

        else:
            if int(match['statistic_team_home']) > int(match['statistic_team_away']):
                table_average_data['lose'] += 1
            elif int(match['statistic_team_home']) == int(match['statistic_team_away']):
                table_average_data['draw'] += 1
            else:
                table_average_data['win'] += 1

            table_average_data['averageDifference'] += (
                    int(match['statistic_team_away']) - int(match['statistic_team_home']))
            table_average_data['averageIndTotal'] += int(match['statistic_team_away'])
            table_average_data['averageIndTotalOpp'] += int(match['statistic_team_home'])

        table_average_data['sharedTotal'] += int(match['statistic'])

    table_average_data['averageDifference'] = round(table_average_data['averageDifference'] / len(list_matches), 2)
    table_average_data['averageIndTotal'] = round(table_average_data['averageIndTotal'] / len(list_matches), 2)
    table_average_data['averageIndTotalOpp'] = round(table_average_data['averageIndTotalOpp'] / len(list_matches), 2)
    table_average_data['sharedTotal'] = round(table_average_data['sharedTotal'] / len(list_matches), 2)

    return table_average_data


# Team
def apply_all_filters_team(team, statistic, period, count_last_matches, place, seasons,
                           championships, odds, result_after_period, coach):
    result = statistic_period_count_last_match_filter(team, statistic, period, count_last_matches)
    result = place_filter(team, result, place)
    result = seasons_filter(result, seasons)
    result = championships_filter(result, championships)
    result = odds_filter(team, result, odds)
    result = result_after_period_filter(team, result, result_after_period)
    result = couch_filter(result, coach)
    result = format_data(result)

    return result


def format_data(list_matches):
    sorted_list_matches = sorted(list_matches, key=lambda x: x['date'], reverse=True)
    for i in range(len(sorted_list_matches)):
        sorted_list_matches[i]['date'] = sorted_list_matches[i]['date'].strftime('%d.%m')
        sorted_list_matches[i]['statistic_team_home'] = int(sorted_list_matches[i]['statistic_team_home'])
        sorted_list_matches[i]['statistic_team_away'] = int(sorted_list_matches[i]['statistic_team_away'])
        sorted_list_matches[i]['statistic'] = int(sorted_list_matches[i]['statistic'])
    return sorted_list_matches
