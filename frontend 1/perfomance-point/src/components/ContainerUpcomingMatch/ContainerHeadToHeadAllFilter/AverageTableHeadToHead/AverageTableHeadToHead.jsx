import React, {useEffect, useState} from 'react';
import calculateAverageDataHeadToHead from "../../../../utils/calculateAverageDataHeadToHead";

function AverageTableHeadToHead({matches, match}) {
    const [averageData, setAverageData] = useState(calculateAverageDataHeadToHead(matches, match.team_home_name))

    useEffect(() => {
        setAverageData(calculateAverageDataHeadToHead(matches, match.team_home_name))
    }, [matches])


    return (
        <div>
            <table className="average-table">
                <thead>
                <tr>
                    <th>Побед {match.team_home_name}</th>
                    <th>Н</th>
                    <th>Побед {match.team_away_name}</th>
                    <th>Ср. ИТ {match.team_home_name}</th>
                    <th>Ср. ИТ {match.team_away_name}</th>
                    <th>Макс Т.</th>
                    <th>Мин. Т.</th>
                    <th>Ср. тотал</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{averageData.winTeamHome}</td>
                    <td>{averageData.draw}</td>
                    <td>{averageData.winTeamAway}</td>
                    <td>{averageData.averageIndTotalTeamHome}</td>
                    <td>{averageData.averageIndTotalTeamAway}</td>
                    <td>{averageData.maxSharedTotal}</td>
                    <td>{averageData.minSharedTotal}</td>
                    <td>{averageData.sharedTotal}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AverageTableHeadToHead;