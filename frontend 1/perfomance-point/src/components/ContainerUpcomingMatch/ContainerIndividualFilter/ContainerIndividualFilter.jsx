import React from 'react';

import FilterPlace from "./FilterPlace/FilterPlace";
import FilterSeason from "./FilterSeason/FilterSeason";
import FilterChampionship from "./FilterChampionship/FilterChampionship";
import FilterOdds from "./FilterOdds/FilterOdds";
import FilterAverage from "./FilterAverage/FilterAverage";
import FilterResultPeriod from "./FilterResultPeriod/FilterResultPeriod";
import FilterCoach from "./FilterCoach/FilterCoach";

import "./ContainerIndividualFilter.css"

function ContainerIndividualFilter({
                                       activeButtonPlace, onSelectPlace,
                                       selectedSeasons, seasons, onSelectSeasons,
                                       selectedChampionships, championships, onSelectChampionships,
                                       activeButtonOdds, onSelectOdds,
                                       activeButtonAverageFilter, valueAverageFilter, onSelectAverageFilter,
                                       activeButtonResultPeriod, onSelectResultPeriod,
                                       activeButtonCoach, onSelectCoach
                                   }) {
    const handleUpdateAverageFilter = (filter, value) => {
        onSelectAverageFilter(filter, value)
    }

    return (
        <div>
            {activeButtonPlace &&
                <FilterPlace activeButton={activeButtonPlace}
                                           onSelectPlace={onSelectPlace}
                />
            }
            {selectedSeasons &&
                <div className='indent'>
                <FilterSeason selectedSeasons={selectedSeasons}
                              seasons={seasons}
                              onSelectSeasons={onSelectSeasons}
                />
                </div>
            }
            {selectedChampionships &&
                <FilterChampionship selectedChampionships={selectedChampionships}
                                    championships={championships}
                                    onSelectedChampionships={onSelectChampionships}
                />
            }
            {activeButtonOdds &&
                <div className='indent'>
                <FilterOdds activeButton={activeButtonOdds}
                            onHandleSelectOdds={(value) => onSelectOdds(value)}
                />
            </div>
            }
            {activeButtonAverageFilter &&
                <FilterAverage activeButton={activeButtonAverageFilter}
                               valueAverageFilter={valueAverageFilter}
                               onUpdateAverageFilter={handleUpdateAverageFilter}
                />
            }
            {activeButtonResultPeriod &&
                <div className='indent'>
                <FilterResultPeriod activeButton={activeButtonResultPeriod}
                                    onSelectResultPeriod={(res) => onSelectResultPeriod(res)}
                />
                </div>
            }
            {activeButtonCoach &&
                <div className='indent'>
                <FilterCoach activeButton={activeButtonCoach}
                             onSelectCoach={(coach) => onSelectCoach(coach)}
                />
                </div>
            }
        </div>
    )
}

export default ContainerIndividualFilter;