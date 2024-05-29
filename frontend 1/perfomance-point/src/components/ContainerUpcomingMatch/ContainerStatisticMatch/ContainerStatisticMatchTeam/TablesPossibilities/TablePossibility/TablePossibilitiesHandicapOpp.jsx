import React from 'react';

import "../TablesPossibilities.css"

function TablePossibilitiesHandicapOpp( {data, headToHead, team_name} ) {
    return data && (
        <div>
            <table className="table-bet">
                <thead>
                <tr>
                    <th></th>
                    <th>{headToHead ? 'Ф ' + team_name : 'Ф2'}</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(data).map(key => {
                    let className = "";
                    const value = data[key];
                    const value_float = parseFloat(value.split("/")[0]) / value.split("/")[1];
                    if (value_float >= 0.75 && value_float < 0.9) {
                        className = "bg-75";
                    } else if (value_float >= 0.9) {
                        className = "bg-90";
                    }
                    return (
                        <tr key={key}>
                            <td>{key}</td>
                            <td className={className}>{data[key]}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default TablePossibilitiesHandicapOpp;