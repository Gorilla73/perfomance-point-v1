import React, {useEffect, useState} from 'react';

import "./FilterChampionship.css"



function FilterChampionship({selectedChampionships, championships, onSelectedChampionships}) {
    const [selectAll, setSelectAll] = useState(true)
    const toggleChampionship = (championship) => {
        if (selectedChampionships.includes(championship)) {
            if (selectAll){
                onSelectedChampionships([championship])
                setSelectAll(false)
            } else {
                onSelectedChampionships(selectedChampionships.filter(item => item !== championship).sort());
            }
        } else {
            onSelectedChampionships([...selectedChampionships, championship].sort());
        }

    };

    const selectAllChampionships = () => {
        onSelectedChampionships(championships);
        setSelectAll(true)
    };

    useEffect(() => {
        if (selectedChampionships.length === championships.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedChampionships]);

    return (
        <div className="filter-championship">
            {championships.map((championship) => (
                <button key={championship}
                        className={selectedChampionships.includes(championship) && selectAll === false ? 'active' : ''}
                        onClick={() => toggleChampionship(championship)}>{championship.replace('_', ' ')}</button>
            ))}
            <button className={selectAll ? 'active' : ''}
                    onClick={selectAllChampionships}>Все
            </button>
        </div>
    );
}

export default FilterChampionship;