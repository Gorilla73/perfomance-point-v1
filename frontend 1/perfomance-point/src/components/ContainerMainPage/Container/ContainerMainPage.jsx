import React, {useEffect, useState} from 'react';

import Calendar from "../Calendar/Calendar";

import "./ContainerMainPage.css"
import ChampionshipList from "../ChampionshipList/ChampionshipList";
import formattedDate from "../../../utils/formattedDate";
import axios from "axios";
import client from "../../../utils/api_request";

function ContainerMainPage({currentUser}) {
    const [date, setDate] = useState(new Date())
    const [matches, setMatches] = useState([]);


    const handleSelectedDate = (date) => {
        setDate(date)
        getMatchesSelectedDate(date)
    }

    const getMatchesSelectedDate = (date) => {

        client.get(`api/v1/get_matches_by_date/?date=${formattedDate(date)}`)
            .then(response => response.data)
            .then(data => setMatches(data))
    };

    useEffect(() => {
        getMatchesSelectedDate(date);
    }, []); // Для запуска при первом запуске



    return (
        <div className="container">
            <Calendar date={date} onSelectedDate={handleSelectedDate}/>
            <ChampionshipList championships={matches}/>
        </div>
    );
}

export default ContainerMainPage;