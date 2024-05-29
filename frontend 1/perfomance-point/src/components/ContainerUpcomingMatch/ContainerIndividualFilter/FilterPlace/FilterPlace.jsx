import React from 'react';

import "./FilterPlace.css"

function FilterPlace( {activeButton, onSelectPlace} ) {
    return (
        <div>
            <div className="select-place">
                <button onClick={() => onSelectPlace('home')}
                        className={activeButton === 'home' ? 'active' : ''}>Дома
                </button>
                <button onClick={() => onSelectPlace('away')}
                        className={activeButton === 'away' ? 'active' : ''}>На выезде
                </button>
                <button onClick={() => onSelectPlace('all')}
                        className={activeButton === 'all' ? 'active' : ''}>Все
                </button>
            </div>
        </div>
    )
}

export default FilterPlace;