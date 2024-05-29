import React, {useEffect, useState} from 'react';

import ContainerHeadToHeadAllFilter from "../ContainerHeadToHeadAllFilter/ContainerHeadToHeadAllFilter";
import ContainerStatisticMatchTeam
    from "../ContainerStatisticMatch/ContainerStatisticMatchTeam/ContainerStatisticMatchTeam";

import "./ContainerStatisticHeadToHeadMatch.css"
import TablesPossibilities
    from "../ContainerStatisticMatch/ContainerStatisticMatchTeam/TablesPossibilities/TablesPossibilities";
import getCsrf from "../../../utils/api_get_csrf";
import client from "../../../utils/api_request";

function ContainerStatisticHeadToHeadMatch({match, activeData, onActiveData}) {
    const [allFilter, setAllFilter] = useState({})
    const [allMatchesHeadToHead, setAllMatchesHeadToHead] = useState([])
    const [selectedMatchesHeadToHead, setSelectedMatchesHeadToHead] = useState([])

    const handleAllFilter = (filter) => {
        setAllFilter(filter)
        // sendFiltersToServer(filter)
    }

    const handleSelectedMatchesHeadToHead = (matches) => {
        setSelectedMatchesHeadToHead(matches)
        onActiveData("selectedMatchesHeadToHead", matches)
    }

    const sendFiltersToServer = async () => {
        const dataFilters = JSON.stringify(allFilter);
        try {
            const csrfToken = await getCsrf();
            const response = await client.post(`api/v1/get_match/get_matches_with_filter/head_to_head/${match.id}/`, dataFilters, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                }
            });
            const responseData = response.data;
            onActiveData("filters", allFilter)
            onActiveData("updated", false)
            setAllMatchesHeadToHead(responseData['matches_head_to_head'])
            onActiveData("allMatchesHeadToHead", responseData['matches_head_to_head'])
            setSelectedMatchesHeadToHead(responseData['matches_head_to_head'])
            onActiveData("selectedMatchesHeadToHead", responseData['matches_head_to_head'])
            // Обработка полученных данных
        } catch (error) {
            console.error('Error:', error);
        }
    };


    useEffect(() => {
        if (Object.keys(allFilter).length !== 0 && Object.keys(activeData).length === 0) {
            sendFiltersToServer()
        }
        else if (Object.keys(allFilter).length !== 0 && Object.keys(activeData).length !== 0) {
            if (activeData.updated === true) {
                sendFiltersToServer()
                onActiveData('updated', false)
            }
        }
    }, [allFilter]);

    useEffect(() => {
        if (Object.keys(activeData).length !== 0){
            setAllMatchesHeadToHead(activeData.allMatchesHeadToHead)
            setAllMatchesHeadToHead(activeData.allMatchesHeadToHead)
            setSelectedMatchesHeadToHead(activeData.selectedMatchesHeadToHead)
        }
    }, [])

    return allMatchesHeadToHead && (
        <>
            <div>
                <ContainerHeadToHeadAllFilter match={match}
                                              onSelectFilter={handleAllFilter}
                                              activeData={activeData}
                                              onActiveData={onActiveData}/>
            </div>
            {allMatchesHeadToHead.length !== 0 && (
                <div className="container-result-matches head-to-head">
                    <ContainerStatisticMatchTeam matches={allMatchesHeadToHead}
                                                 previousSelectedMatches={selectedMatchesHeadToHead}
                                                 onSelectMatches={handleSelectedMatchesHeadToHead}
                                                 HeadToHead={true}
                                                 match={match}/>
                </div>
            )}

            {selectedMatchesHeadToHead.length === 0 && (
                <div className="container-possibilities head-to-head">
                    <h3 style={{margin: 'auto'}}>Матчей нет</h3>
                </div>
            )}

            {selectedMatchesHeadToHead.length !== 0 && (
                <div className="container-possibilities head-to-head">
                    <TablesPossibilities matches={selectedMatchesHeadToHead} headToHead={true} team_home_name={match.team_home_name} team_away_name={match.team_away_name}/>
                </div>
            )}
        </>
    );
}

export default ContainerStatisticHeadToHeadMatch;