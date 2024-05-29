import calculateAverageData from './calculateAverageData'

function calculateTablePossibilitiesIndTotal(matches){
    const averageData = calculateAverageData(matches)
    let minIndTotal = averageData.minIndTotal
    if (minIndTotal === 0){
        minIndTotal = averageData.minIndTotal + 1
    }
    const maxIndTotal = averageData.maxIndTotal

    const result = {}
    for (let i = minIndTotal; i < maxIndTotal + 2; i++){
        result[i - 0.5] = 0;
    }

    for (let i = 0; i < matches.length; i++) {
        let indTotal = minIndTotal
        if (matches[i]['team_home']['name'] === matches[i]['owner_team']['name']) {
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
    for (let i = minIndTotal; i < maxIndTotal + 2; i++){
        result[i - 0.5] = [`${result[i - 0.5]}/${matches.length}`, `${matches.length - result[i - 0.5]}/${matches.length}`];
    }

    return result
}

export default calculateTablePossibilitiesIndTotal