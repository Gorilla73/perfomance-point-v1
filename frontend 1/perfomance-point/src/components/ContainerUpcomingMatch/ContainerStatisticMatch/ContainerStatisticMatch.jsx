import React, {useEffect, useState} from 'react';

import ContainerAllFilter from "../ContainerAllFilter/ContainerAllFilter";
import ContainerStatisticMatchTeam from "./ContainerStatisticMatchTeam/ContainerStatisticMatchTeam";

import "./ContainerStatisticMatch.css"
import TablesPossibilities from "./ContainerStatisticMatchTeam/TablesPossibilities/TablesPossibilities";
import deepEqual from "deep-equal";
import {matches} from "lodash";
import axios, {all} from "axios";
import getCookie from "../../../utils/getCookie";
import get_csrf from "../../../utils/api_get_csrf";
import getCsrf from "../../../utils/api_get_csrf";
import client from "../../../utils/api_request";

function ContainerStatisticMatch( {match, activeData, onActiveData} ) {
    const [allFilters, setAllFilters] = useState({})
    const [matchesTeamHome, setMatchesTeamHome] = useState([])
    const [matchesTeamAway, setMatchesTeamAway] = useState([])
    const [selectedMatchesTeamHome, setSelectedMatchesTeamHome] = useState([])
    const [selectedMatchesTeamAway, setSelectedMatchesTeamAway] = useState([])

    const handleAllFilter = (filter) => {
        setAllFilters(filter)
        // sendFiltersToServer(filter)
    }

    const handleSelectedMatchesTeamHome = (matches) => {
        setSelectedMatchesTeamHome(matches)
        onActiveData("selectedMatchesTeamHome", matches)
    }

    const handleSelectedMatchesTeamAway = (matches) => {
        setSelectedMatchesTeamAway(matches)
        onActiveData("selectedMatchesTeamAway", matches)
    }

    const sendFiltersToServer = async () => {
        const dataFilters = JSON.stringify(allFilters);
        try {
            const csrfToken = await getCsrf();
            const response = await client.post(`api/v1/get_match/get_matches_with_filter/${match.id}/`, dataFilters, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                }
            });
            const responseData = response.data;
            onActiveData("filters", allFilters)
            onActiveData("previousFilters", allFilters)
            onActiveData("updated", false)
            setMatchesTeamHome(responseData['matches_team_home']);
            onActiveData("matchesTeamHome", responseData['matches_team_home'])
            setSelectedMatchesTeamHome(responseData['matches_team_home']) //
            onActiveData("selectedMatchesTeamHome", responseData['matches_team_home']) //
            setMatchesTeamAway(responseData['matches_team_away']);
            onActiveData("matchesTeamAway", responseData['matches_team_away'])
            setSelectedMatchesTeamAway(responseData['matches_team_away'])
            onActiveData("selectedMatchesTeamAway", responseData['matches_team_away']) //

            console.log(responseData['matches_team_away'])
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        if (Object.keys(allFilters).length !== 0 && Object.keys(activeData).length === 0){
            sendFiltersToServer()
        }
        else if (Object.keys(allFilters).length !== 0 && Object.keys(activeData).length !== 0) {
            if (activeData.updated === true) {
                sendFiltersToServer()
                onActiveData('updated', false)
            }
        }
    }, [allFilters, activeData]);

    useEffect(() => {
        if (Object.keys(activeData).length !== 0){
            setMatchesTeamHome(activeData.matchesTeamHome)
            setMatchesTeamAway(activeData.matchesTeamAway)
            setSelectedMatchesTeamHome(activeData.selectedMatchesTeamHome)
            setSelectedMatchesTeamAway(activeData.selectedMatchesTeamAway)
        }
    }, [])

    return (
        <>
            <div>
                <ContainerAllFilter match={match}
                                    onSelectFilter={handleAllFilter}
                                    activeData={activeData}
                                    onActiveData={onActiveData}/>
            </div>
            <div className='container-result-matches'>
                <div className='container-result-matches left'>
                    {matchesTeamHome.length === 0 ?
                        <h3> Матчей нет </h3> :
                        <ContainerStatisticMatchTeam matches={matchesTeamHome}
                                                     previousSelectedMatches={selectedMatchesTeamHome}
                                                     newSelectedMatches={selectedMatchesTeamHome}
                                                     onSelectMatches={handleSelectedMatchesTeamHome}
                                                     HeadToHead={false}/>
                    }
                </div>
                <div className='container-result-matches right'>
                    {matchesTeamAway.length === 0 ?
                        <h3> Матчей нет </h3> :
                        <ContainerStatisticMatchTeam matches={matchesTeamAway}
                                                     previousSelectedMatches={selectedMatchesTeamAway}
                                                     onSelectMatches={handleSelectedMatchesTeamAway}
                                                     HeadToHead={false}/>
                    }
                </div>
            </div>
            <div className="container-possibilities">
                {matchesTeamHome.length > 0 &&
                    <div className="container-possibilities left">
                        <TablesPossibilities matches={selectedMatchesTeamHome} headToHead={false}/>
                    </div>
                }
                {matchesTeamAway.length > 0 &&
                    <div className="container-possibilities right">
                        <TablesPossibilities matches={selectedMatchesTeamAway} headToHead={false}/>
                    </div>
                }
            </div>
        </>
    );
}

export default ContainerStatisticMatch;