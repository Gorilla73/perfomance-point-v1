import React, {useEffect, useState} from 'react';
import deepEqual from "deep-equal";
import SelectStatistic from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectStatistic/SelectStatistic";
import SelectPeriod from "../../ContainerUpcomingMatch/ContainerSharedFilter/SelectPeriod/SelectPeriod";
import CountLastMatch from "../../ContainerUpcomingMatch/ContainerSharedFilter/CountLastMatch/CountLastMatch";
import FilterSeason from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterSeason/FilterSeason";
import FilterOdds from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterOdds/FilterOdds";
import FilterResultPeriod
    from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterResultPeriod/FilterResultPeriod";
import FilterPlace from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterPlace/FilterPlace";
import FilterChampionship
    from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterChampionship/FilterChampionship";
import FilterCoach from "../../ContainerUpcomingMatch/ContainerIndividualFilter/FilterCoach/FilterCoach";

function AllFilterTeam( {team, onSelectFilter }) {
    const [isUpdatedFilter, setIsUpdatedFilter] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState(
        {
            statistic: 'score',
            period: 'all',
            count_last_matches: '20',

            team_place: 'all',
            team_seasons: team.seasons,
            team_championships: team.championships,
            team_odds: 'any any',
            team_result_after_period: 'all',
            team_coach: 'all',
        }
    )

    const [previousFilter, setPreviousFilter] = useState(selectedFilter)

    const handleUpdateFilter = (newFilter) => {
        const updatedFilter = {...selectedFilter, ...newFilter}
        setSelectedFilter(updatedFilter)
        console.log(updatedFilter)
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
        onSelectFilter(selectedFilter)
    }, []);

    return  (
        <div className='container-statistic'>
            <div className='container-shared-filter'>
                <SelectStatistic activeButton={selectedFilter.statistic}
                                 onSelectStatistic={(stat) => handleUpdateFilter({statistic: stat})}/>
                <SelectPeriod activeButton={selectedFilter.period}
                              onSelectPeriod={(per) => handleUpdateFilter({period: per})}/>
                <CountLastMatch activeButton={selectedFilter.count_last_matches}
                                onSelectLastMatch={(count) => handleUpdateFilter({count_last_matches: count})}/>
                <FilterPlace activeButton={selectedFilter.team_place}
                             onSelectPlace={(place) => handleUpdateFilter({team_place: place})}/>
                <FilterSeason selectedSeasons={selectedFilter.team_seasons}
                              seasons={team.seasons}
                              onSelectSeasons={(seasons) => handleUpdateFilter({team_seasons: seasons})}/>
                <FilterChampionship selectedChampionships={selectedFilter.team_championships}
                                    championships={team.championships}
                                    onSelectedChampionships={(champ) => handleUpdateFilter({team_championships: champ})}/>
                <FilterOdds activeButton={selectedFilter.team_odds}
                            onHandleSelectOdds={(value) => handleUpdateFilter({team_odds: value})}/>
                <FilterResultPeriod activeButton={selectedFilter.team_result_after_period}
                                    onSelectResultPeriod={(res) => handleUpdateFilter({team_result_after_period: res})}/>
                <FilterCoach activeButton={selectedFilter.team_coach}
                             onSelectCoach={(coach) => handleUpdateFilter({team_coach: coach})}/>
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

export default AllFilterTeam;