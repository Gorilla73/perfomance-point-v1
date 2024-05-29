function defaultFiltersUpcomingMatch(match){
    const defaultFilters = {
        statistic: 'score',
        period: 'all',
        count_last_matches: '20',

        team_home_place: 'all',
        team_home_seasons: match.team_home_seasons,
        team_home_championships: match.team_home_championships,
        team_home_odds: 'any any',
        team_home_selected_average_filter: 'all',
        team_home_value_average_filter: '',
        team_home_result_after_period: 'all',
        team_home_coach: 'all',

        team_away_place: 'all',
        team_away_seasons: match.team_away_seasons,
        team_away_championships: match.team_away_championships,
        team_away_odds: 'any any',
        team_away_selected_average_filter: 'all',
        team_away_value_average_filter: '',
        team_away_result_after_period: 'all',
        team_away_coach: 'all'
    }
    return defaultFilters
}


export default defaultFiltersUpcomingMatch