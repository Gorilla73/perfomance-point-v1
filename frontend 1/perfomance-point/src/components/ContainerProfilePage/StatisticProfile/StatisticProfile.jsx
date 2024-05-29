import React, {useEffect, useState} from 'react';

import SelectStatistic from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectStatistic/SelectStatistic";
import SelectPeriod from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectPeriod/SelectPeriod";
import CountLastMatch from "../../ContainerUpcomingMatch/ContainerSharedFilter/CountLastMatch/CountLastMatch";
import ContainerIndividualFilter
    from "../../ContainerUpcomingMatch/ContainerIndividualFilter/ContainerIndividualFilter";

import './StatisticProfile.css'
import deepEqual from "deep-equal";
import client from "../../../utils/api_request";
import getCsrf from "../../../utils/api_get_csrf";

const defaultFilters = {
    statistic: 'score',
    period: 'all',
    count_last_matches: '20',

    team_home_place: 'all',
    team_home_odds: 'any any',
    team_home_selected_average_filter: 'all',
    team_home_value_average_filter: '',
    team_home_result_after_period: 'all',
    team_home_coach: 'all',

    team_away_place: 'all',
    team_away_odds: 'any any',
    team_away_selected_average_filter: 'all',
    team_away_value_average_filter: '',
    team_away_result_after_period: 'all',
    team_away_coach: 'all'
}

function StatisticProfile({user, onUser}) {
    const [isUpdatedFilter, setIsUpdatedFilter] = useState(false)
    const [resetFilters, setResetFilters] = useState(false)
    const [selectFilter, setSelectFilter] = useState({})
    const [previousFilter, setPreviousFilter] = useState({})

    const handleUpdateFilter = (newFilter) => {
        const updatedFilter = {...selectFilter, ...newFilter}
        setSelectFilter(updatedFilter)
    }

    const sendDataOnServer = async (data) => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            try {
                const csrfToken = await getCsrf(); // Ожидаем получение CSRF-токена
                client.put('/api/v1/user', {saved_statistic: data}, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionId}`,
                        "X-CSRFToken": csrfToken,
                    }
                })
                    .then((res) => {
                        onUser(res.data.user)
                    })
                    .catch((error) => {
                        // Обработка ошибки
                        console.error('Ошибка при обновлении данных:', error);
                    });
            } catch (error) {
                console.error('Ошибка при получении CSRF-токена:', error);
            }
        }
    };

    const handleUpdateData = () => {
        sendDataOnServer(selectFilter)
            .then(() => {
            })
            .catch(error => {
                console.error('Ошибка при отправке данных на сервер:', error);
            });
        setPreviousFilter(selectFilter)
        setIsUpdatedFilter(false)
    }

    const handleResetData = () => {
        sendDataOnServer({})
            .then(() => {
            })
            .catch(error => {
                console.error('Ошибка при отправке данных на сервер:', error);
            });
        setResetFilters(false)
    }

    useEffect(() => {
        setIsUpdatedFilter(!deepEqual(previousFilter, selectFilter))
    }, [selectFilter]);

    useEffect(() => {
        if (Object.keys(user.saved_statistic).length !== 0) {
            setSelectFilter({...defaultFilters, ...user.saved_statistic});
            setPreviousFilter({...defaultFilters, ...user.saved_statistic});
            setResetFilters(true);
        } else {
            setSelectFilter(defaultFilters)
            setPreviousFilter(defaultFilters)
            setResetFilters(false);
        }
    }, [user]);

    return (
        <div>
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
                        <ContainerIndividualFilter activeButtonPlace={selectFilter.team_home_place}
                                                   onSelectPlace={(place) => handleUpdateFilter({team_home_place: place})}

                                                   activeButtonOdds={selectFilter.team_home_odds}
                                                   onSelectOdds={(odds) => handleUpdateFilter({team_home_odds: odds})}

                                                   activeButtonAverageFilter={selectFilter.team_home_selected_average_filter}
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
                        <ContainerIndividualFilter activeButtonPlace={selectFilter.team_away_place}
                                                   onSelectPlace={(place) => handleUpdateFilter({team_away_place: place})}

                                                   activeButtonOdds={selectFilter.team_away_odds}
                                                   onSelectOdds={(odds) => handleUpdateFilter({team_away_odds: odds})}

                                                   activeButtonAverageFilter={selectFilter.team_away_selected_average_filter}
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
                        {isUpdatedFilter ? 'Сохранить статистику(Enter)' : 'Статистика сохранена'}
                    </button>
                    <button className={"update button-reset" + (resetFilters ? ' active' : '')}
                            onClick={handleResetData}
                            disabled={!resetFilters}>
                        Сбросить(по умолчанию)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatisticProfile;