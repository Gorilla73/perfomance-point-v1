import React, {useState} from 'react';

import "./AverageTableTeam.css"
import calculateAverageData from "../../../../../utils/calculateAverageData";
import {matches} from "lodash";

function AverageTableTeam( {averageData}) {
    return (
        <div>
            <table className="average-table">
                <thead>
                <tr>
                    <th>В</th>
                    <th>Н</th>
                    <th>П</th>
                    <th>Ср. разница</th>
                    <th>Макс. ИТ</th>
                    <th>Мин. ИТ</th>
                    <th>Ср. ИТ</th>
                    <th>Макс. ИТ соп.</th>
                    <th>Мин. ИТ соп.</th>
                    <th>Ср. ИТ соп.</th>
                    <th>Макс Т.</th>
                    <th>Мин. Т.</th>
                    <th>Ср. тотал</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{averageData.win}</td>
                    <td>{averageData.draw}</td>
                    <td>{averageData.lose}</td>
                    <td>{averageData.averageDifference}</td>
                    <td>{averageData.maxIndTotal}</td>
                    <td>{averageData.minIndTotal}</td>
                    <td>{averageData.averageIndTotal}</td>
                    <td>{averageData.maxIndTotalOpp}</td>
                    <td>{averageData.minIndTotalOpp}</td>
                    <td>{averageData.averageIndTotalOpp}</td>
                    <td>{averageData.maxSharedTotal}</td>
                    <td>{averageData.minSharedTotal}</td>
                    <td>{averageData.sharedTotal}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AverageTableTeam;