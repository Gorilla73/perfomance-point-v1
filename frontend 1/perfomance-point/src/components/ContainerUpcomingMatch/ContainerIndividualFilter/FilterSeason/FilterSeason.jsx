import React, {useEffect, useState} from 'react';

import sortSeasons from "../../../../utils/sortSeasons";

import "./FilterSeason.css"

function FilterSeason( {selectedSeasons, seasons, onSelectSeasons} ) {
    const [selectAll, setSelectAll] = useState(true)
    const toggleSeason = (season) => {
        if (selectedSeasons.includes(season)) {
            if (selectAll){
                onSelectSeasons([season])
                setSelectAll(false)
            } else {
                onSelectSeasons(sortSeasons(selectedSeasons.filter(item => item !== season)));
            }
        } else {
            onSelectSeasons(sortSeasons([...selectedSeasons, season]));
        }

    };

    const selectAllSeasons = () => {
        onSelectSeasons(seasons);
        setSelectAll(true)
    };

    useEffect(() => {
        if (selectedSeasons.length === seasons.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedSeasons]);

    return selectedSeasons && (
        <div className="filter-season">
            {seasons.map((season) => (
                <button key={season}
                        className={selectedSeasons.includes(season) && selectAll === false ? 'active' : ''}
                        onClick={() => toggleSeason(season)}>{season}</button>
            ))}
            <button className={selectAll ? 'active' : ''}
                    onClick={selectAllSeasons}>Все
            </button>
        </div>
    );
}


export default FilterSeason;