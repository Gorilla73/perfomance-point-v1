import React from 'react';

function SelectPeriod({ activeButton, onSelectPeriod }) {
    return (
        <div className='select-period'>
            <button onClick={() => onSelectPeriod('first_period')}
                    className={activeButton === 'first_period' ? 'active' : ''}>1-й период
            </button>
            <button onClick={() => onSelectPeriod('second_period')}
                    className={activeButton === 'second_period' ? 'active' : ''}>2-й период
            </button>
            <button onClick={() => onSelectPeriod('third_period')}
                    className={activeButton === 'third_period' ? 'active' : ''}>3-й период
            </button>
            <button onClick={() => onSelectPeriod('after_1st_period')}
                    className={activeButton === 'after_1st_period' ? 'active' : ''}>После 1-го периода
            </button>
            <button onClick={() => onSelectPeriod('all')}
                    className={activeButton === 'all' ? 'active' : ''}>Все
            </button>
        </div>
    );
}

export default SelectPeriod;