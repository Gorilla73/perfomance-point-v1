import React, {useEffect, useState} from 'react';

import "./FilterAverage.css"

function FilterAverage( {activeButton, valueAverageFilter, onUpdateAverageFilter} ) {
    const [selectedOption, setSelectedOption] = useState( 'avgDiff');
    const [inputValue, setInputValue] = useState('');

    const handleSelectChange = (e) => {
        const filter = e.target.value //Добавил вместо useEffect
        setSelectedOption(e.target.value)
        onUpdateAverageFilter(filter, inputValue) //Добавил вместо useEffect
    };

    const handleInputChange = (e) => {
        const value = e.target.value //Добавил вместо useEffect
        setInputValue(e.target.value)
        onUpdateAverageFilter(selectedOption, value) //Добавил вместо useEffect
    };

    const handleButtonAverageFilterClick = () => {
        onUpdateAverageFilter(selectedOption, inputValue)
    }

    const handleButtonClick = () => {
        onUpdateAverageFilter('all', '')
    }

    useEffect(() => {
        if (activeButton !== 'all') {
            setSelectedOption(activeButton)
            setInputValue(valueAverageFilter)
        }
    }, [activeButton])

    return (
        <div className='filter-average'>
            <button className={'filter-average button-with-input' + (activeButton === selectedOption ? ' active' : '')}
                    onClick={handleButtonAverageFilterClick}>
                <select className='filter-average select-in-button'
                        value={selectedOption}
                        onChange={handleSelectChange}>
                    <option value="avgDiff">Ср. разница</option>
                    <option value="avgIndTotal">Ср. инд. тотал</option>
                    <option value="avgIndTotalOpp">Ср. инд. тотал соп.</option>
                    <option value="avgTotal">Ср. тотал</option>
                </select>
                &nbsp;
                <input
                    type="text"
                    className='filter-average input-in-button'
                    placeholder="2"
                    value={inputValue} onChange={handleInputChange}
                />
            </button>
            <button
                className={'button-all' + (activeButton === 'all' ? ' active' : '')}
                onClick={handleButtonClick}
                >Все
            </button>
        </div>
    );

}

export default FilterAverage;