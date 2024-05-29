function defaultFiltersUpcomingMatch(match){
    const defaultFilters = {
        statistic: 'score',
        period: 'all',
        count_last_matches: '20',

        consider_place: 'all',
        seasons: match.team_home_seasons,
        championships: match.team_home_championships,

        result_after_period: 'all',
    }
    return defaultFilters
}


export default defaultFiltersUpcomingMatch