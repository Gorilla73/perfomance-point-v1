import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import TeamHeader from "./TeamHeader/TeamHeader";
import sortSeasons from "../../utils/sortSeasons";
import AllFilterTeam from "./AllFilterTeam/AllFilterTeam";
import ContainerStatisticMatchTeam
    from "../ContainerUpcomingMatch/ContainerStatisticMatch/ContainerStatisticMatchTeam/ContainerStatisticMatchTeam";

import './ContainerTeamPage.css'
import TablesPossibilities
    from "../ContainerUpcomingMatch/ContainerStatisticMatch/ContainerStatisticMatchTeam/TablesPossibilities/TablesPossibilities";
import client from "../../utils/api_request";
import getCsrf from "../../utils/api_get_csrf";
import axios from "axios";

function ContainerTeamPage(props) {
    const {id} = useParams()
    const [team, setTeam] = useState()
    const [matchesTeam, setMatchesTeam] = useState([])
    const [selectedMatchesTeam, setSelectedMatchesTeam] = useState([])
    const [allFilters, setAllFilters] = useState({})

    const handleAllFilter = (filter) => {
        setAllFilters(filter)
    }

    const handleSelectedMatches = (matches) => {
        setSelectedMatchesTeam(matches)
    }

    const getTeam = (id) => {
        client.get(`api/v1/get_team/${id}`)
            .then(response => response.data)
            .then(data => {
                console.log(data)
                setTeam({
                    name: data.name,
                    logo: `http://127.0.0.1:8001/${data.logo}`,
                    seasons: data.seasons,
                    championships: data.championships
                })
            });
    }

    const sendFiltersToServer = async () => {
        const dataFilters = JSON.stringify(allFilters);
        try {
            const csrfToken = await getCsrf();
            const response = await client.post(`api/v1/get_team/get_matches_team_with_filter/${id}/`, dataFilters, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                }
            });
            const data = response.data
            setMatchesTeam(data['matches_team'])
            setSelectedMatchesTeam(data['matches_team'])
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (Object.keys(allFilters).length !== 0) {
            sendFiltersToServer()
        }
    }, [allFilters]);

    useEffect(() => {
        getTeam(id)
    }, [id])

    return team && (
        <>
            <div className='container'>
                <TeamHeader team={team}/>
            </div>
            <div>
                <AllFilterTeam team={team} onSelectFilter={handleAllFilter}/>
            </div>
            <div className='container-result-matches-team'>
                {matchesTeam.length === 0 ?
                    <h3> Матчей нет </h3> :
                    <ContainerStatisticMatchTeam matches={matchesTeam}
                                                 previousSelectedMatches={selectedMatchesTeam}
                                                 onSelectMatches={handleSelectedMatches}
                                                 HeadToHead={false}/>
                }
            </div>
            <div className="container-possibilities-team">
                {selectedMatchesTeam.length > 0 &&
                        <TablesPossibilities matches={selectedMatchesTeam} headToHead={false}/>
                }
            </div>
        </>
    );
}

export default ContainerTeamPage;