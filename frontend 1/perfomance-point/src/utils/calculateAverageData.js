
function calculateAverageData(matches){

    if (matches.length === 0){
        return {
            win: 0,
            draw: 0,
            lose: 0,

            averageDifference: 0,

            maxIndTotal: 0,
            minIndTotal: 0,
            averageIndTotal: 0,

            maxIndTotalOpp: 0,
            minIndTotalOpp: 0,
            averageIndTotalOpp: 0,

            maxSharedTotal: 0,
            minSharedTotal: 0,
            sharedTotal: 0}
    }

    const averageTableData = {
        win: 0,
        draw: 0,
        lose: 0,

        averageDifference: 0,

        maxIndTotal: 0,
        minIndTotal: 1000,
        averageIndTotal: 0,

        maxIndTotalOpp: 0,
        minIndTotalOpp: 1000,
        averageIndTotalOpp: 0,

        maxSharedTotal: 0,
        minSharedTotal: 2000,
        sharedTotal: 0
    }

    for (let i = 0; i < matches.length; i++){
        if (matches[i]['owner_team']['name'] === matches[i]['team_home']['name']){
            if (matches[i]['statistic_team_home'] > matches[i]['statistic_team_away']){
                averageTableData.win += 1
            }
            else if (matches[i]['statistic_team_home'] === matches[i]['statistic_team_away']){
                averageTableData.draw += 1
            }
            else{
                averageTableData.lose += 1
            }
            averageTableData.averageDifference = averageTableData.averageDifference +
                (matches[i]['statistic_team_home'] - matches[i]['statistic_team_away'])
            averageTableData.averageIndTotal += matches[i]['statistic_team_home']
            averageTableData.averageIndTotalOpp += matches[i]['statistic_team_away']
            if (averageTableData.maxIndTotal < matches[i]['statistic_team_home']){
                averageTableData.maxIndTotal = matches[i]['statistic_team_home']
            }
            if (averageTableData.minIndTotal > matches[i]['statistic_team_home']){
                averageTableData.minIndTotal = matches[i]['statistic_team_home']
            }
            if (averageTableData.maxIndTotalOpp < matches[i]['statistic_team_away']){
                averageTableData.maxIndTotalOpp = matches[i]['statistic_team_away']
            }
            if (averageTableData.minIndTotalOpp > matches[i]['statistic_team_away']){
                averageTableData.minIndTotalOpp = matches[i]['statistic_team_away']
            }
        }
        else{
            if (matches[i]['statistic_team_home'] < matches[i]['statistic_team_away']){
                averageTableData.win += 1
            }
            else if (matches[i]['statistic_team_home'] === matches[i]['statistic_team_away']){
                averageTableData.draw += 1
            }
            else{
                averageTableData.lose += 1
            }
            averageTableData.averageDifference = averageTableData.averageDifference +
                matches[i]['statistic_team_away'] - (matches[i]['statistic_team_home'])
            averageTableData.averageIndTotal += matches[i]['statistic_team_away']
            averageTableData.averageIndTotalOpp += matches[i]['statistic_team_home']
            if (averageTableData.maxIndTotal < matches[i]['statistic_team_away']){
                averageTableData.maxIndTotal = matches[i]['statistic_team_away']
            }
            if (averageTableData.minIndTotal > matches[i]['statistic_team_away']){
                averageTableData.minIndTotal = matches[i]['statistic_team_away']
            }
            if (averageTableData.maxIndTotalOpp < matches[i]['statistic_team_home']){
                averageTableData.maxIndTotalOpp = matches[i]['statistic_team_home']
            }
            if (averageTableData.minIndTotalOpp > matches[i]['statistic_team_home']){
                averageTableData.minIndTotalOpp = matches[i]['statistic_team_home']
            }

        }
        if (averageTableData.maxSharedTotal < matches[i]['statistic']){
            averageTableData.maxSharedTotal = matches[i]['statistic']
        }
        if (averageTableData.minSharedTotal > matches[i]['statistic']){
            averageTableData.minSharedTotal = matches[i]['statistic']
        }
        averageTableData.sharedTotal += matches[i]['statistic']
    }
    averageTableData.averageDifference = (averageTableData.averageDifference / matches.length).toFixed(2)
    averageTableData.averageIndTotal = (averageTableData.averageIndTotal / matches.length).toFixed(2)
    averageTableData.averageIndTotalOpp = (averageTableData.averageIndTotalOpp / matches.length).toFixed(2)
    averageTableData.sharedTotal = (averageTableData.sharedTotal / matches.length).toFixed(2)

    return averageTableData
}

export default calculateAverageData;