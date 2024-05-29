import React from 'react';

import "./FilterCoach.css"
function FilterCoach({activeButton, onSelectCoach}) {
    return (
        <div>
            <div className='select-coach'>
                <button onClick={() => onSelectCoach('current')}
                        className={activeButton === 'current' ? 'active' : ''}>Только с текущим тренером
                </button>
                <button onClick={() => onSelectCoach('all')}
                        className={activeButton === 'all' ? 'active' : ''}>Все
                </button>
            </div>
        </div>
    );
}

export default FilterCoach;