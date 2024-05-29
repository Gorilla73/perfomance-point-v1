import React from 'react';
import "../TablesPossibilities.css"

function TablePossibilitiesTotal({data, headToHead, team_name}) {
    return data && (
        <div>
            <table className="table-bet">
                <thead>
                <tr>
                    <th></th>
                    <th>ТБ</th>
                    <th>ТМ</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(data).map(key => {
                    let className_team_home = "";
                    let className_team_away = ""
                    const value_team_home = data[key][0];
                    const value_team_away = data[key][1]
                    const value_team_home_float = parseFloat(value_team_home.split("/")[0]) / value_team_home.split("/")[1];
                    const value_team_away_float = parseFloat(value_team_away.split("/")[0]) / value_team_away.split("/")[1];
                    if (value_team_home_float >= 0.75 && value_team_home_float < 0.9) {
                        className_team_home = "bg-75";
                    } else if (value_team_home_float >= 0.9) {
                        className_team_home = "bg-90";
                    }
                    if (value_team_away_float >= 0.75 && value_team_away_float < 0.9){
                        className_team_away = "bg-75"
                    } else if (value_team_away_float >= 0.9){
                        className_team_away = "bg-90"
                    }
                    return (
                        <tr key={key}>
                            <td>{key}</td>
                            <td className={className_team_home}>{data[key][0]}</td>
                            <td className={className_team_away}>{data[key][1]}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default TablePossibilitiesTotal;
