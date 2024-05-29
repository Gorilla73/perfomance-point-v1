import calculateAverageData from './calculateAverageData'
function calculateTablePossibilitiesTotal(matches) {
    const averageData = calculateAverageData(matches)
    let minTotal = averageData.minSharedTotal
    if (minTotal === 0){
        minTotal = averageData.minSharedTotal + 1
    }
    const maxTotal = averageData.maxSharedTotal

    const result = {}
    for (let i = minTotal; i < maxTotal + 2; i++){
        result[i - 0.5] = 0;
    }

    for (let i = 0; i < matches.length; i++){
        let total = minTotal
        while (total < matches[i].statistic + 1){
            result[total - 0.5] += 1
            total += 1
        }
    }
    for (let i = minTotal; i < maxTotal + 2; i++){
        result[i - 0.5] = [`${result[i - 0.5]}/${matches.length}`, `${matches.length - result[i - 0.5]}/${matches.length}`];
    }
    return result
}


export default calculateTablePossibilitiesTotal