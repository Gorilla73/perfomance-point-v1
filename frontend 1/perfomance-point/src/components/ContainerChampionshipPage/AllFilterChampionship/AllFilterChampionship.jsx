import React, {useEffect, useState} from 'react';
import deepEqual from "deep-equal";
import SelectStatistic from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectStatistic/SelectStatistic";
import SelectPeriod from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectPeriod/SelectPeriod";
import CountLastMatch from "../../ContainerUpcomingMatch/ContainerSharedFilter/CountLastMatch/CountLastMatch";
import FilterSeason from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterSeason/FilterSeason";
import FilterResultPeriod
    from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterResultPeriod/FilterResultPeriod";
import FilterOdds from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterOdds/FilterOdds";
import FilterPlace from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterPlace/FilterPlace";

function AllFilterChampionship( {onSelectFilter, uniqueSeasons} ) {


    const [isUpdatedFilter, setIsUpdatedFilter] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState({})

    const [previousFilter, setPreviousFilter] = useState({})

    const handleUpdateFilter = (newFilter) => {
        const updatedFilter = {...selectedFilter, ...newFilter}
        setSelectedFilter(updatedFilter)
    }

    const handleUpdateData = () => {
        setPreviousFilter(selectedFilter)
        setIsUpdatedFilter(false)
        onSelectFilter(selectedFilter)
    }

    useEffect(() => {
        setIsUpdatedFilter(!deepEqual(previousFilter, selectedFilter))
    }, [selectedFilter]);

    useEffect(() => {
        if (uniqueSeasons !== undefined) {
            const filters = {
                statistic: 'score',
                period: 'all',
                count_last_matches: '20',

                place: 'all',
                seasons: uniqueSeasons,

                odds: 'any any',

                result_after_period: 'all',
            }
            console.log(filters)
            setSelectedFilter(filters)
            setPreviousFilter(filters)
            onSelectFilter(filters)
        }
    }, [uniqueSeasons])

    // useEffect(() => {
    //     onSelectFilter(selectedFilter)
    // }, [])



    return uniqueSeasons && Object.keys(selectedFilter).length !== 0 && (
        <div className='container-statistic'>
            <div className='container-shared-filter'>
                <SelectStatistic activeButton={selectedFilter.statistic}
                                 onSelectStatistic={(stat) => handleUpdateFilter({statistic: stat})}/>
                <SelectPeriod activeButton={selectedFilter.period}
                              onSelectPeriod={(per) => handleUpdateFilter({period: per})}/>
                <CountLastMatch activeButton={selectedFilter.count_last_matches}
                                onSelectLastMatch={(count) => handleUpdateFilter({count_last_matches: count})}/>
                <FilterPlace activeButton={selectedFilter.place}
                             onSelectPlace={(place) => handleUpdateFilter({place: place})}/>
                <FilterSeason selectedSeasons={selectedFilter.seasons}
                              seasons={uniqueSeasons}
                              onSelectSeasons={(seasons) => handleUpdateFilter({seasons: seasons})}/>
                <FilterOdds activeButton={selectedFilter.odds}
                            onHandleSelectOdds={(value) => handleUpdateFilter({odds: value})}/>
                <FilterResultPeriod activeButton={selectedFilter.result_after_period}
                                    onSelectResultPeriod={(res) => handleUpdateFilter({result_after_period: res})}/>
            </div>
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

export default AllFilterChampionship;