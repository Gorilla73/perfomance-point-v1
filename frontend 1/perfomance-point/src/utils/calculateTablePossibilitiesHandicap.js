function calculateTablePossibilitiesHandicap(matches){
    let minHandicap = 1000
    let maxHandicap = -1000
    for (let i = 0; i < matches.length; i++){
        if (matches[i].owner_team.name === matches[i].team_home.name){
            if (matches[i].statistic_team_home - matches[i].statistic_team_away > maxHandicap){
                maxHandicap = matches[i].statistic_team_home - matches[i].statistic_team_away
            }
            if (matches[i].statistic_team_home - matches[i].statistic_team_away < minHandicap){
                minHandicap = matches[i].statistic_team_home - matches[i].statistic_team_away
            }
        }
        else {
            if (matches[i].statistic_team_away - matches[i].statistic_team_home > maxHandicap){
                maxHandicap = matches[i].statistic_team_away - matches[i].statistic_team_home
            }
            if (matches[i].statistic_team_away - matches[i].statistic_team_home < minHandicap){
                minHandicap = matches[i].statistic_team_away - matches[i].statistic_team_home
            }
        }
    }

    const handicap_current_team = {}
    for (let i = -maxHandicap; i < -minHandicap + 2; i++){
        handicap_current_team[i - 0.5] = 0
    }
    for (let i = 0; i < matches.length; i++){
        let handicap = -minHandicap + 1
        let current_handicap = 0
        if (matches[i].owner_team.name === matches[i].team_home.name){
                current_handicap = matches[i].statistic_team_home - matches[i].statistic_team_away
        }
        else {
            current_handicap = matches[i].statistic_team_away - matches[i].statistic_team_home
        }
        while (handicap > -current_handicap){
            handicap_current_team[handicap - 0.5] += 1
            handicap -= 1
        }
    }

    const handicap_opponent_team = {}
    for (let i = -maxHandicap; i < -minHandicap + 2; i++){
        handicap_opponent_team[-i + 0.5] = matches.length - handicap_current_team[i - 0.5]
    }

    // Получаем ключи объекта handicap_opponent_team
    const keys = Object.keys(handicap_opponent_team).map(parseFloat);
    // Сортируем ключи по возрастанию
    keys.sort((a, b) => a - b);
    // Создаем новый объект с отсортированными ключами
    const sorted_handicap_opponent_team = {};
    keys.forEach(key => {
        sorted_handicap_opponent_team[key] = handicap_opponent_team[key];
    });

    for (let key in handicap_current_team) {
        if (handicap_current_team.hasOwnProperty(key)) {
            handicap_current_team[key] = `${handicap_current_team[key]}/${matches.length}`;
        }
    }

    for (let key in sorted_handicap_opponent_team) {
        if (sorted_handicap_opponent_team.hasOwnProperty(key)) {
            sorted_handicap_opponent_team[key] = `${sorted_handicap_opponent_team[key]}/${matches.length}`;
        }
    }

    return {'handicap_current_team': handicap_current_team,
            'handicap_opponent_team': sorted_handicap_opponent_team}
}

export default calculateTablePossibilitiesHandicap