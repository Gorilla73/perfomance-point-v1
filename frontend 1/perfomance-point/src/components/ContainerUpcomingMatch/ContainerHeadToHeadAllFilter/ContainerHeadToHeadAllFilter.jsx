import React, {useEffect, useState} from 'react';

import "./ContainerHeadToHeadAllFilter.css"
import SelectStatistic from "../ContainerSharedFilter/SelectStatistic/SelectStatistic";
import SelectPeriod from "../ContainerSharedFilter/SelectPeriod/SelectPeriod";
import CountLastMatch from "../ContainerSharedFilter/CountLastMatch/CountLastMatch";
import FilterSeason from "../ContainerIndividualFilter/FilterSeason/FilterSeason";
import sortSeasons from "../../../utils/sortSeasons";
import FilterChampionship from "../ContainerIndividualFilter/FilterChampionship/FilterChampionship";
import FilterPlaceHeadToHead from "./FilterPlaceHeadToHead/FilterPlaceHeadToHead";
import deepEqual from "deep-equal";
import FilterResultPeriodHeadToHead from "./FilterResultAfterPeriodHeadToHead/FilterResultPeriodHeadToHead";
import defaultFiltersUpcomingMatchHeadToHead from "../../../utils/defaultFiltersUpcomingMatchHeadToHead";


function ContainerHeadToHeadAllFilter( { match, onSelectFilter, activeData, onActiveData } ) {
    // Здесь надо получить уникальные сезоны из списка только очных матчей
    const unique_seasons = sortSeasons([...new Set(match.team_home_seasons, match.team_away_seasons)])

    const unique_championship = [...new Set(match.team_home_championships, match.team_away_championships)].sort()

    const [isUpdatedFilter, setIsUpdatedFilter] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState(defaultFiltersUpcomingMatchHeadToHead(match))

    const [previousFilter, setPreviousFilter] = useState(selectedFilter)

    const handleUpdateFilter = (newFilter) => {
        const updatedFilter = {...selectedFilter, ...newFilter}
        setSelectedFilter(updatedFilter)
        onActiveData('filters', updatedFilter)
    }

    const handleUpdateData = () => {
        setPreviousFilter(selectedFilter)
        setIsUpdatedFilter(false)
        onSelectFilter(selectedFilter)
        onActiveData('previousFilters', selectedFilter)
        onActiveData('updated', true)
    }

    useEffect(() => {
        setIsUpdatedFilter(!deepEqual(previousFilter, selectedFilter))
    }, [selectedFilter]);

    useEffect(() => {
        if (Object.keys(activeData).length !== 0) {
            setSelectedFilter(activeData.filters);
            setPreviousFilter(activeData.previousFilters)
            setIsUpdatedFilter(activeData.updated)
        }
        onSelectFilter(selectedFilter)
    }, [])

    return (
        <div className="container-statistic">
            <div className="container-shared-filter">
                <SelectStatistic activeButton={selectedFilter.statistic}
                                 onSelectStatistic={(stat) => handleUpdateFilter({statistic: stat})}/>
                <SelectPeriod activeButton={selectedFilter.period}
                              onSelectPeriod={(per) => handleUpdateFilter({period: per})}/>
                <CountLastMatch activeButton={selectedFilter.count_last_matches}
                                onSelectLastMatch={(count) => handleUpdateFilter({count_last_matches: count})}/>
                <FilterSeason selectedSeasons={selectedFilter.seasons}
                              seasons={unique_seasons}
                              onSelectSeasons={(seasons) => handleUpdateFilter({seasons: seasons})}/>
                <FilterChampionship selectedChampionships={selectedFilter.championships}
                                    championships={unique_championship}
                                    onSelectedChampionships={(champ) => handleUpdateFilter({championships: champ})}/>
                <FilterPlaceHeadToHead activeButton={selectedFilter.consider_place}
                                        onSelectPlace={(place) => handleUpdateFilter({consider_place: place})}/>
                <FilterResultPeriodHeadToHead activeButton={selectedFilter.result_after_period}
                                                onSelectResultPeriod={(res) => handleUpdateFilter({result_after_period: res})}/>

            </div>
            {/*<div className="individual-filter">*/}
            {/*    <div className="filter-team left">*/}
            {/*        <h3>{match.team_home_name}</h3>*/}
            {/*        <FilterResultPeriod activeButton={selectedFilter.team_home_result_after_period}*/}
            {/*                            onSelectResultPeriod={(res) => handleUpdateFilter({team_home_result_after_period: res})}/>*/}
            {/*        <FilterCoach activeButton={selectedFilter.team_home_coach}*/}
            {/*                     onSelectCoach={(coach => handleUpdateFilter({team_home_coach: coach}))}/>*/}
            {/*    </div>*/}
            {/*    <div className="filter-team right">*/}
            {/*        <h3>{match.team_away_name}</h3>*/}
            {/*        <FilterResultPeriod activeButton={selectedFilter.team_away_result_after_period}*/}
            {/*                            onSelectResultPeriod={(res) => handleUpdateFilter({team_away_result_after_period: res})}/>*/}
            {/*        <FilterCoach activeButton={selectedFilter.team_away_coach}*/}
            {/*                     onSelectCoach={(coach => handleUpdateFilter({team_away_coach: coach}))}/>*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className='update'>
                <button className={"update button-update" + (isUpdatedFilter ? ' active' : '')}
                        onClick={handleUpdateData}
                        disabled={!isUpdatedFilter}>
                    {isUpdatedFilter ? 'Обновить(Enter)' : 'Статистика обновлена'}
                </button>
            </div>
        </div>
    );
}

export default ContainerHeadToHeadAllFilter;