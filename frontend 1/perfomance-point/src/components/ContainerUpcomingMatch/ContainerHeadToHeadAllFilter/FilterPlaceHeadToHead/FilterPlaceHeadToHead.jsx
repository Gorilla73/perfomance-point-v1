import React from 'react';

function FilterPlaceHeadToHead({activeButton, onSelectPlace}) {
    return (
        <div className="select-place">
            <button onClick={() => onSelectPlace('consider_place')}
                    className={activeButton === 'consider_place' ? 'active' : ''}>Учитывать место проведения
            </button>
            <button onClick={() => onSelectPlace('all')}
                    className={activeButton === 'all' ? 'active' : ''}>Все
            </button>
        </div>
    )
}

export default FilterPlaceHeadToHead;