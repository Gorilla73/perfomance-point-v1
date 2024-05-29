function calculateAverageDataHeadToHead(matches, team_home, team_away){
    if (matches.length === 0){
        return {
            winTeamHome: 0,
            draw: 0,
            winTeamAway: 0,

            averageIndTotalTeamHome: 0,

            averageIndTotalTeamAway: 0,

            maxSharedTotal: 0,
            minSharedTotal: 0,
            sharedTotal: 0
        }
    }

    const averageTableData = {
        winTeamHome: 0,
        draw: 0,
        winTeamAway: 0,

        averageIndTotalTeamHome: 0,

        averageIndTotalTeamAway: 0,

        maxSharedTotal: 0,
        minSharedTotal: 2000,
        sharedTotal: 0
    }

    for (let i = 0; i < matches.length; i++){
        if (matches[i].team_home.name === team_home){
            if (matches[i].statistic_team_home > matches[i].statistic_team_away){
                averageTableData.winTeamHome += 1
            }
            else if (matches[i].statistic_team_home === matches[i].statistic_team_away){
                averageTableData.draw += 1
            }
            else {
                averageTableData.winTeamAway += 1
            }
            averageTableData.averageIndTotalTeamHome += matches[i].statistic_team_home
            averageTableData.averageIndTotalTeamAway += matches[i].statistic_team_away
        }
        else{
            if (matches[i].statistic_team_home < matches[i].statistic_team_away){
                averageTableData.winTeamHome += 1
            }
            else if (matches[i].statistic_team_home === matches[i].statistic_team_away){
                averageTableData.draw += 1
            }
            else {
                averageTableData.winTeamAway += 1
            }
            averageTableData.averageIndTotalTeamHome += matches[i].statistic_team_away
            averageTableData.averageIndTotalTeamAway += matches[i].statistic_team_home
        }
        if (matches[i].statistic < averageTableData.minSharedTotal){
            averageTableData.minSharedTotal = matches[i].statistic
        }
        if (matches[i].statistic > averageTableData.maxSharedTotal){
            averageTableData.maxSharedTotal = matches[i].statistic
        }
        averageTableData.sharedTotal += matches[i].statistic
    }
    averageTableData.averageIndTotalTeamHome = (averageTableData.averageIndTotalTeamHome / matches.length).toFixed(2)
    averageTableData.averageIndTotalTeamAway = (averageTableData.averageIndTotalTeamAway / matches.length).toFixed(2)
    averageTableData.sharedTotal = (averageTableData.sharedTotal / matches.length).toFixed(2)

    return averageTableData
}

export default calculateAverageDataHeadToHead