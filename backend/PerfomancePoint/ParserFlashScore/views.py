import json

from django.http import JsonResponse, Http404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, csrf_exempt, ensure_csrf_cookie
from django.views.decorators.http import require_POST

from ParserFlashScore.apply_filters import apply_all_filters, apply_all_filters_head_to_head, \
    apply_all_filter_championship, apply_all_filters_team
from ParserFlashScore.models import MatchesShedule, Matches, Teams, Championship


def get_csrf_token(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


def get_championships(request):
    date = request.GET.get('date')

    all_matches_current_date = MatchesShedule.objects.filter(date__date=date).order_by('date')

    # Здесь вы можете сформировать JSON данные в зависимости от полученной даты
    championship_data = {}

    for match in all_matches_current_date:
        championship_name = match.championship.championship

        if championship_name not in championship_data:
            championship_data[championship_name] = []

        match_data = {
            "id": match.id,
            "time": match.date.strftime("%H:%M"),
            "team1": match.team_home,
            "team2": match.team_away
        }

        championship_data[championship_name].append(match_data)

    # Добавляем данные в нужном формате в JSON ответ
    response_data = []
    for championship, matches in championship_data.items():
        response_data.append({
            "championship_name": championship,
            "championship_id": Championship.objects.get(championship=championship).pk,
            "matches": matches
        })

    # Возвращаем JSON ответ
    return JsonResponse(response_data, safe=False)


def get_match(request, id_match):
    match = MatchesShedule.objects.get(id=id_match)
    matches_team_home = Matches.objects.filter(team=Teams.objects.get(team_name=match.team_home))
    matches_team_away = Matches.objects.filter(team=Teams.objects.get(team_name=match.team_away))

    unique_seasons_team_home = list(matches_team_home.values_list('season', flat=True).distinct())
    unique_championship_team_home = list(matches_team_home.values_list('championship', flat=True).distinct())
    unique_championship_team_home = [Championship.objects.get(id=i).championship for i in unique_championship_team_home]

    unique_seasons_team_away = list(matches_team_away.values_list('season', flat=True).distinct())
    unique_championship_team_away = list(matches_team_away.values_list('championship', flat=True).distinct())
    unique_championship_team_away = [Championship.objects.get(id=i).championship for i in unique_championship_team_away]

    match = {
        'id': id_match,
        'team_home_logo': Teams.objects.get(team_name=match.team_home).image_team.url,
        'team_home_name': Teams.objects.get(team_name=match.team_home).team_name.replace('_', ' '),
        'team_home_seasons': unique_seasons_team_home,
        'team_home_championships': unique_championship_team_home,

        'matchDate': match.date.strftime('%d.%m.%Y %H:%M'),

        'team_away_logo': Teams.objects.get(team_name=match.team_away).image_team.url,
        'team_away_name': Teams.objects.get(team_name=match.team_away).team_name.replace('_', ' '),
        'team_away_seasons': unique_seasons_team_away,
        'team_away_championships': unique_championship_team_away,
    }

    return JsonResponse(match)


# @csrf_exempt
@ensure_csrf_cookie
def get_matches_with_filter(request, id_match):
    if request.method == 'POST':

        try:
            match = MatchesShedule.objects.get(id=id_match)
        except MatchesShedule.DoesNotExist:
            raise Http404("Match does not exist")

        all_filter = json.loads(request.body.decode('utf-8'))

        matches_team_home = apply_all_filters(team=Teams.objects.get(team_name=match.team_home),
                                              team_opponent=Teams.objects.get(team_name=match.team_away),
                                              statistic=all_filter['statistic'],
                                              period=all_filter['period'],
                                              count_last_matches=all_filter['count_last_matches'],
                                              place=all_filter['team_home_place'],
                                              seasons=all_filter['team_home_seasons'],
                                              championships=all_filter['team_home_championships'],
                                              odds=all_filter['team_home_odds'],
                                              selected_average_filter=all_filter['team_home_selected_average_filter'],
                                              value_average_filter=all_filter['team_home_value_average_filter'],
                                              result_after_period=all_filter['team_home_result_after_period'],
                                              coach=all_filter['team_home_coach'])

        matches_team_away = apply_all_filters(team=Teams.objects.get(team_name=match.team_away),
                                              team_opponent=Teams.objects.get(team_name=match.team_home),
                                              statistic=all_filter['statistic'],
                                              period=all_filter['period'],
                                              count_last_matches=all_filter['count_last_matches'],
                                              place=all_filter['team_away_place'],
                                              seasons=all_filter['team_away_seasons'],
                                              championships=all_filter['team_away_championships'],
                                              odds=all_filter['team_away_odds'],
                                              selected_average_filter=all_filter['team_away_selected_average_filter'],
                                              value_average_filter=all_filter['team_away_value_average_filter'],
                                              result_after_period=all_filter['team_away_result_after_period'],
                                              coach=all_filter['team_away_coach'])

        return JsonResponse({'matches_team_home': matches_team_home,
                             'matches_team_away': matches_team_away}, status=200)
    else:
        return JsonResponse({"error": "Метод не разрешен"}, status=405)


@ensure_csrf_cookie
def get_matches_head_to_head_with_filter(request, id_match):
    if request.method == 'POST':

        all_filter = json.loads(request.body.decode('utf-8'))

        match = MatchesShedule.objects.get(id=id_match)
        result = apply_all_filters_head_to_head(team=Teams.objects.get(team_name=match.team_home),
                                                team_opponent=Teams.objects.get(team_name=match.team_away),
                                                statistic=all_filter['statistic'],
                                                period=all_filter['period'],
                                                count_last_match=all_filter['count_last_matches'],
                                                place=all_filter['consider_place'],
                                                seasons=all_filter['seasons'],
                                                championships=all_filter['championships'],
                                                result_after_period=all_filter['result_after_period'])

        return JsonResponse({'matches_head_to_head': result}, status=200)
    else:
        return JsonResponse({"error": "Метод не разрешен"}, status=405)


def get_championship(request, id_championship):
    try:
        championship = Championship.objects.get(id=id_championship)
    except Championship.DoesNotExist:
        raise Http404("Championship does not exist")

    unique_seasons = Matches.objects.filter(championship=championship).values_list('season', flat=True).distinct()
    print(unique_seasons)

    unique_seasons_list = [season for season in unique_seasons]
    print(unique_seasons_list)
    return JsonResponse({
        'name': championship.championship,
        'logo': championship.image_country_championship.url,
        'unique_seasons': unique_seasons_list
    }, status=200)


@csrf_exempt
def table_championship(request, id_championship):
    if request.method == 'POST':

        all_filter = json.loads(request.body.decode('utf-8'))
        all_filter['championship'] = Championship.objects.get(id=id_championship)

        result = apply_all_filter_championship(statistic=all_filter['statistic'],
                                               period=all_filter['period'],
                                               count_last_matches=all_filter['count_last_matches'],
                                               place=all_filter['place'],
                                               seasons=all_filter['seasons'],
                                               championship=all_filter['championship'],
                                               odds=all_filter['odds'],
                                               result_after_period=all_filter['result_after_period'],
                                               )

        return JsonResponse({'table_championship': result}, status=200)
    else:
        return JsonResponse({"error": "Метод не разрешен"}, status=405)


def get_team(request, id_team):
    try:
        team = Teams.objects.get(id=id_team)
    except Teams.DoesNotExist:
        raise Http404("Teams does not exist")

    matches_team = Matches.objects.filter(team=team)

    unique_seasons_team = list(matches_team.values_list('season', flat=True).distinct())
    unique_championship_team = list(matches_team.values_list('championship', flat=True).distinct())
    unique_championship_team = [Championship.objects.get(id=i).championship for i in unique_championship_team]

    data = {'name': team.team_name,
            'logo': team.image_team.url,
            'seasons': unique_seasons_team,
            'championships': unique_championship_team,
            }

    return JsonResponse(data, status=200)


# @csrf_exempt
@ensure_csrf_cookie
def get_matches_team_with_filter(request, id_team):
    print(1)
    if request.method == 'POST':
        try:
            team = Teams.objects.get(id=id_team)
        except Teams.DoesNotExist:
            raise Http404("Teams does not exist")

        print(2)

        all_filter = json.loads(request.body.decode('utf-8'))

        result = apply_all_filters_team(team=team,
                                        statistic=all_filter['statistic'],
                                        period=all_filter['period'],
                                        count_last_matches=all_filter['count_last_matches'],
                                        place=all_filter['team_place'],
                                        seasons=all_filter['team_seasons'],
                                        championships=all_filter['team_championships'],
                                        odds=all_filter['team_odds'],
                                        result_after_period=all_filter['team_result_after_period'],
                                        coach=all_filter['team_coach'])

        print(result)
        return JsonResponse({'matches_team': result}, status=200)
    else:
        return JsonResponse({"error": "Метод не разрешен"}, status=405)
