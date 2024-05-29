import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import ChampionshipHeader from "./ChampionshipHeader/ChampionshipHeader";

import './ContainerChampionshipPage.css'
import AllFilterChampionship from "./AllFilterChampionship/AllFilterChampionship";

import championship from "../ContainerMainPage/ChampionshipList/Championship";
import TableChampionship from "./TableChampionship/TableChampionship";
import sortSeasons from "../../utils/sortSeasons";
import client from "../../utils/api_request";
import getCsrf from "../../utils/api_get_csrf";


function ContainerChampionshipPage(props) {
    const {id} = useParams()
    const [championship, setChampionship] = useState({})
    const [allFilter, setAllFilter] = useState({})
    const [tableChampionship, setTableChampionship] = useState([])

    const handleAllFilter = (filter) => {
        setAllFilter(filter)
    }

    const getChampionship = (id) => {
        client.get(`api/v1/get_championship/${id}`)
            .then(response => response.data)
            .then(data => {
                setChampionship({
                    name: data.name,
                    logo: `http://127.0.0.1:8001/${data.logo}`,
                    uniqueSeasons: sortSeasons(data.unique_seasons),
            })
        });
    }

    const sendFiltersToServer = async () => {
        const dataFilters = JSON.stringify(allFilter);
        try {
            const csrfToken = await getCsrf();
            const response = await client.post(`api/v1/get_championship/table_championship/${id}/`, dataFilters, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                }
            });
            const data = response.data
            setTableChampionship(data['table_championship'])
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (Object.keys(allFilter).length !== 0) {
            sendFiltersToServer()
        }
    }, [allFilter]);

    useEffect(() => {
        getChampionship(id)
    }, [id])


    return championship && (
        <>
            <div className='container'>
                <ChampionshipHeader championship={championship}/>
            </div>
            <div>
                <AllFilterChampionship onSelectFilter={handleAllFilter} uniqueSeasons={championship.uniqueSeasons}/>
            </div>
            <div className='container-table-championship'>
                <TableChampionship tables={tableChampionship}/>
            </div>
        </>
    );
}

export default ContainerChampionshipPage;