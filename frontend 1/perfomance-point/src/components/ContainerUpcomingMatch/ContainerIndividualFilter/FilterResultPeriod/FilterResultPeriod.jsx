import React, {useEffect, useState} from 'react';

import "./FilterResultPeriod.css"

function FilterResultPeriod( {activeButton, onSelectResultPeriod} ) {
    const [selectedOption, setSelectedOption] = useState( 'win_after_1st_period');

    const handleSelectChange = (e) => {
        const filter = e.target.value //Добавил вместо useEffect
        setSelectedOption(e.target.value)
        onSelectResultPeriod(filter) //Добавил вместо useEffect
    }
    const handleButtonResultPeriodFilterClick = () => {
        onSelectResultPeriod(selectedOption) //Добавил вместо useEffect
    }

    useEffect(() => {
        if (activeButton !== 'all') {
            setSelectedOption(activeButton)
        }
    }, [activeButton]);

    return (
        <div>
            <div className='select-result-period'>
                <button
                    className={'select-result-period button-with-select' + (activeButton === selectedOption ? ' active' : '')}
                    onClick={handleButtonResultPeriodFilterClick}>
                    <select className='select-result-period select-in-button'
                            value={selectedOption}
                            onChange={handleSelectChange}>
                        <option value="win_after_1st_period">Победа после 1-го периода</option>
                        <option value="draw_after_1st_period">Ничья после 1-го периода</option>
                        <option value="lose_after_1st_period">Поражение после 1-го периода</option>
                        <option value="win_after_2st_period">Победа после 2-го периода</option>
                        <option value="draw_after_2st_period">Ничья после 2-го периода</option>
                        <option value="lose_after_2st_period">Поражение после 2-го периода</option>
                    </select>
                </button>
                <button onClick={() => onSelectResultPeriod('all')}
                            className={activeButton === 'all' ? 'active' : ''}>Все
                </button>
            </div>
        </div>
);
}

export default FilterResultPeriod;