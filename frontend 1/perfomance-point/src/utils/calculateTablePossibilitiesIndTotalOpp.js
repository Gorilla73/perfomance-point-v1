import calculateAverageData from "./calculateAverageData";

function calculateTablePossibilitiesIndTotalOpp(matches){
    const averageData = calculateAverageData(matches)
    let minIndTotalOpp = averageData.minIndTotalOpp
    if (minIndTotalOpp === 0){
        minIndTotalOpp = averageData.minIndTotal + 1
    }
    const maxIndTotalOpp = averageData.maxIndTotalOpp

    const result = {}
    for (let i = minIndTotalOpp; i < maxIndTotalOpp + 2; i++){
        result[i - 0.5] = 0;
    }

    for (let i = 0; i < matches.length; i++) {
        let indTotal = minIndTotalOpp
        if (matches[i]['team_home']['name'] !== matches[i]['owner_team']['name']) {
            while (indTotal < matches[i]['statistic_team_home'] + 1 && matches[i]['statistic_team_home'] !== 0) {
                result[indTotal - 0.5] += 1
                indTotal += 1
            }
        } else {
            while (indTotal < matches[i]['statistic_team_away'] + 1 && matches[i]['statistic_team_home'] !== 0) {
                result[indTotal - 0.5] += 1
                indTotal += 1
            }
        }
    }
    for (let i = minIndTotalOpp; i < maxIndTotalOpp + 2; i++){
        result[i - 0.5] = [`${result[i - 0.5]}/${matches.length}`, `${matches.length - result[i - 0.5]}/${matches.length}`];
    }

    return result
}

export default calculateTablePossibilitiesIndTotalOpp