import React, {useEffect, useState} from 'react';


import SelectStatistic from "../ContainerSharedFilter/SelectStatistic/SelectStatistic";
import SelectPeriod from "../ContainerSharedFilter/SelectPeriod/SelectPeriod";
import CountLastMatch from "../ContainerSharedFilter/CountLastMatch/CountLastMatch";
import ContainerIndividualFilter from "../ContainerIndividualFilter/ContainerIndividualFilter";
import deepEqual from "deep-equal";

import "./ContainerAllFilter.css"
import defaultFiltersUpcomingMatch from "../../../utils/defaultFiltersUpcomingMatch";
import client from "../../../utils/api_request";

function ContainerAllFilter( {match, onSelectFilter, activeData, onActiveData} ) {
    const [isUpdatedFilter, setIsUpdatedFilter] = useState(false)
    const [selectFilter, setSelectFilter] = useState(defaultFiltersUpcomingMatch(match))
    const [previousFilter, setPreviousFilter] = useState(selectFilter)
    const [userFilters, setUserFilters] = useState({})

    const handleUserFilters = () => {
        return new Promise((resolve, reject) => {
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
                client.get("/api/v1/user", {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionId}`
                    }
                }).then((res) => {
                    resolve(res.data.user.saved_statistic);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                // Дополнительные действия, если sessionId отсутствует
                resolve(null); // Возвращаем null в случае отсутствия sessionId
            }
        });
    };

    const handleUpdateFilter = (newFilter) => {
        const updatedFilter = {...selectFilter, ...newFilter}
        setSelectFilter(updatedFilter)
        onActiveData('filters', updatedFilter)
    }

    const handleUpdateData = () => {
        setPreviousFilter(selectFilter)
        setIsUpdatedFilter(false)
        onSelectFilter(selectFilter)
        onActiveData('previousFilters', selectFilter)
        onActiveData('updated', true)
    }

    useEffect(() => {
        setIsUpdatedFilter(!deepEqual(previousFilter, selectFilter))
    }, [selectFilter]);

    useEffect(() => {
        if (Object.keys(activeData).length !== 0) {
            console.log(activeData)
            setSelectFilter(activeData.filters);
            setPreviousFilter(activeData.previousFilters)
            onSelectFilter(activeData.filters);
            setIsUpdatedFilter(activeData.updated)
        }
        else {
            handleUserFilters().then(userFilters => {
                if (userFilters && Object.keys(userFilters).length !== 0) {
                    const defaultFilters = defaultFiltersUpcomingMatch(match)
                    setSelectFilter({...defaultFilters, ...userFilters});
                    setPreviousFilter({...defaultFilters, ...userFilters});
                }
                onSelectFilter(selectFilter);
            }).catch(error => {
                console.log(error)
                if (error.response && error.response.data) {
                    alert('Ошибка при получении данных: ' + error.response.data.error);
                } else {
                    alert('Ошибка при получении данных');
                }
            });
        }
    }, []);

    return (
        <>
            <div className="container-statistic">
                <div className="statistic-and-period">
                    <SelectStatistic activeButton={selectFilter.statistic}
                                     onSelectStatistic={(stat) => handleUpdateFilter({statistic: stat})}/>
                    <SelectPeriod activeButton={selectFilter.period}
                                  onSelectPeriod={(per) => handleUpdateFilter({period: per})}/>
                </div>
                <div className='count_match'>
                    <CountLastMatch activeButton={selectFilter.count_last_matches}
                                    onSelectLastMatch={(count) => handleUpdateFilter({count_last_matches: count})}/>
                </div>
                <div className="individual-filter">
                    <div className="filter-team left">
                        <h3>{match.team_home_name}</h3>
                        <ContainerIndividualFilter activeButtonPlace={selectFilter.team_home_place}
                                                   onSelectPlace={(place) => handleUpdateFilter({team_home_place: place})}

                                                   selectedSeasons={selectFilter.team_home_seasons}
                                                   seasons={match.team_home_seasons}
                                                   onSelectSeasons={(seasons) => handleUpdateFilter({team_home_seasons: seasons})}

                                                   selectedChampionships={selectFilter.team_home_championships}
                                                   championships={match.team_home_championships}
                                                   onSelectChampionships={(championship) => handleUpdateFilter({team_home_championships: championship})}

                                                   activeButtonOdds={selectFilter.team_home_odds}
                                                   onSelectOdds={(odds) => handleUpdateFilter({team_home_odds: odds})}

                                                   activeButtonAverageFilter={selectFilter.team_home_selected_average_filter}
                                                   valueAverageFilter={selectFilter.team_home_value_average_filter}
                                                   onSelectAverageFilter={(fil, val) => handleUpdateFilter({
                                                       team_home_selected_average_filter: fil,
                                                       team_home_value_average_filter: val
                                                   })}

                                                   activeButtonResultPeriod={selectFilter.team_home_result_after_period}
                                                   onSelectResultPeriod={(res) => handleUpdateFilter({team_home_result_after_period: res})}

                                                   activeButtonCoach={selectFilter.team_home_coach}
                                                   onSelectCoach={(coach) => handleUpdateFilter({team_home_coach: coach})}
                        />
                    </div>
                    <div className="filter-team right">
                        <h3>{match.team_away_name}</h3>
                        <ContainerIndividualFilter activeButtonPlace={selectFilter.team_away_place}
                                                   onSelectPlace={(place) => handleUpdateFilter({team_away_place: place})}

                                                   selectedSeasons={selectFilter.team_away_seasons}
                                                   seasons={match.team_away_seasons}
                                                   onSelectSeasons={(seasons) => handleUpdateFilter({team_away_seasons: seasons})}

                                                   selectedChampionships={selectFilter.team_away_championships}
                                                   championships={match.team_away_championships}
                                                   onSelectChampionships={(championship) => handleUpdateFilter({team_away_championships: championship})}

                                                   activeButtonOdds={selectFilter.team_away_odds}
                                                   onSelectOdds={(odds) => handleUpdateFilter({team_away_odds: odds})}

                                                   activeButtonAverageFilter={selectFilter.team_away_selected_average_filter}
                                                   valueAverageFilter={selectFilter.team_away_value_average_filter}
                                                   onSelectAverageFilter={(fil, val) => handleUpdateFilter({
                                                       team_away_selected_average_filter: fil,
                                                       team_away_value_average_filter: val
                                                   })}

                                                   activeButtonResultPeriod={selectFilter.team_away_result_after_period}
                                                   onSelectResultPeriod={(res) => handleUpdateFilter({team_away_result_after_period: res})}

                                                   activeButtonCoach={selectFilter.team_away_coach}
                                                   onSelectCoach={(coach) => handleUpdateFilter({team_away_coach: coach})}
                        />
                    </div>
                </div>
                <div className='update'>
                    <button className={"update button-update" + (isUpdatedFilter ? ' active' : '')}
                            onClick={handleUpdateData}
                            disabled={!isUpdatedFilter}>
                        {isUpdatedFilter ? 'Обновить(Enter)' : 'Статистика обновлена'}
                    </button>
                </div>
            </div>
        </>

    );
}

export default ContainerAllFilter;