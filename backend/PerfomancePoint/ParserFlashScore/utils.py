from ParserFlashScore.models import Teams, Matches, Championship


def dictionary_average_each_team(championships, statistic, period):
    from ParserFlashScore.apply_filters import statistic_period_count_last_match_filter
    championships_id = [Championship.objects.get(championship=championship).pk for championship in championships]
    result = {}
    all_teams = Teams.objects.filter(championship__in=championships_id).distinct()
    for team in all_teams:
        all_matches = statistic_period_count_last_match_filter(team, statistic, period, '3')
        average_data = {
            'avgDiff': 0,
            'avgIndTotal': 0,
            'avgIndTotalOpp': 0,
            'avgTotal': 0
        }
        for match in all_matches:
            if match['team_home']['name'] == team.team_name:
                average_data['avgDiff'] = average_data['avgDiff'] + (
                        int(match['statistic_team_home']) - int(match['statistic_team_away']))
                average_data['avgIndTotal'] += int(match['statistic_team_home'])
                average_data['avgIndTotalOpp'] += int(match['statistic_team_away'])
            else:
                average_data['avgDiff'] = average_data['avgDiff'] + (
                        int(match['statistic_team_away']) - int(match['statistic_team_home']))
                average_data['avgIndTotal'] += int(match['statistic_team_away'])
                average_data['avgIndTotalOpp'] += int(match['statistic_team_home'])
            average_data['avgTotal'] += int(match['statistic'])

        if len(all_matches) != 0:
            average_data['avgDiff'] = round(average_data['avgDiff'] / len(all_matches), 2)
            average_data['avgIndTotal'] = round(average_data['avgIndTotal'] / len(all_matches), 2)
            average_data['avgIndTotalOpp'] = round(average_data['avgIndTotalOpp'] / len(all_matches), 2)
            average_data['avgTotal'] = round(average_data['avgTotal'] / len(all_matches), 2)

        result[team.team_name] = average_data

    return result
