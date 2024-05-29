import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import MatchHeader from "../MatchHeader/MatchHeader";
import NavUpcomingMatch from "../NavUpcomingMatch/NavUpcomingMatch";

import "./ContainerUpcomingMatch.css"
import client from "../../../utils/api_request";

function ContainerUpcomingMatch({userFilters}) {
    const { id } = useParams();
    const [match, setMatch] = useState()

    const getMatch = () => {

        client.get(`api/v1/get_match/${id}`)
            .then(response => response.data)
            .then(data => {
                setMatch({
                    id: data.id,
                    team_home_logo: `http://127.0.0.1:8001/${data.team_home_logo}`,
                    team_home_name: data.team_home_name,
                    team_home_seasons: data.team_home_seasons,
                    team_home_championships: data.team_home_championships,
                    matchDate: data.matchDate,
                    team_away_logo: `http://127.0.0.1:8001/${data.team_away_logo}`,
                    team_away_name: data.team_away_name,
                    team_away_seasons: data.team_away_seasons,
                    team_away_championships: data.team_away_championships
            });
        })
    }

    useEffect(() => {
        getMatch()
    }, [id])

    return match && (
         <div>
            <div className="container">
                <MatchHeader match={match}/>
            </div>
            <div className="nav-upcoming-match">
                <NavUpcomingMatch match={match} userFilters={userFilters}/>
            </div>
        </div>
    )
}

export default ContainerUpcomingMatch;