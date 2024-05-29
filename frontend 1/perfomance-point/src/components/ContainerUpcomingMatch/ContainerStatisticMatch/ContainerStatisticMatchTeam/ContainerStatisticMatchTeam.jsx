import React, {useEffect, useRef, useState} from 'react';
import {useDeepCompareEffect} from "react-use";

import {isEqual} from 'lodash'

import TableListTeam from "./TableListTeam/TableListTeam";
import AverageTableTeam from "./AverageTableTeam/AverageTableTeam";
import AverageTableHeadToHead from "../../ContainerHeadToHeadAllFilter/AverageTableHeadToHead/AverageTableHeadToHead";

import calculateAverageData from "../../../../utils/calculateAverageData"

import "./ContainerStatisticMatchTeam.css"



function ContainerStatisticMatchTeam( {matches, previousSelectedMatches, onSelectMatches, HeadToHead, match} ) {
    console.log(previousSelectedMatches)
    const [selectedMatches, setSelectMatches] = useState(previousSelectedMatches)
    const [averageData, setAverageData] = useState(calculateAverageData(selectedMatches))

    const handleSelectMatches = (matches) => {
        setSelectMatches(matches)
    }

    // useEffect(() => {
    //     setSelectMatches(matches);
    // }, [matches])


    useEffect(() => {
        const newData = calculateAverageData(selectedMatches);
        setAverageData(newData)
        onSelectMatches(selectedMatches)
    }, [selectedMatches])

    useEffect(() => {
        setSelectMatches(previousSelectedMatches)
    }, [previousSelectedMatches])

    return selectedMatches && (
        <div style={{width: '100%'}}>
            {HeadToHead && (<AverageTableHeadToHead matches={selectedMatches} match={match} />)}
            {!HeadToHead && (<AverageTableTeam averageData={averageData}/>)}
            <TableListTeam matches={matches}
                           previousSelectedMatches={selectedMatches}
                           onSelectMatches={handleSelectMatches}
                           HeadToHead={HeadToHead}
            />
        </div>
    );

}

export default ContainerStatisticMatchTeam;