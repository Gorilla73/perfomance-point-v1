import React, {useEffect, useState} from 'react';

import "./FilterOdds.css"

function FilterOdds( {activeButton, onHandleSelectOdds}) {

    const [inputValueFrom, setInputValueFrom] = useState('')
    const [inputValueBefore, setInputValueBefore] = useState('')
    const [isInputActive, setIsInputActive] = useState(false)

    const handleInputChangeFrom = (e) => {
        const inputFrom = e.target.value //Добавил вместо useEffect
        setInputValueFrom(e.target.value)
        onHandleSelectOdds(`${inputFrom} ${inputValueBefore}`) //Добавил вместо useEffect
        setIsInputActive(true)
    }

    const handleInputChangeBefore = (e) => {
        const inputBefore = e.target.value //Добавил вместо useEffect
        setInputValueBefore(e.target.value)
        onHandleSelectOdds(`${inputValueFrom} ${inputBefore}`) //Добавил вместо useEffect
        setIsInputActive(true)
    }

    const handleButtonClicked = (value) => {
        onHandleSelectOdds(value)
        setIsInputActive(false)
    }

    const handleSelectOdds = () => {
        setIsInputActive(true)
        onHandleSelectOdds(`${inputValueFrom} ${inputValueBefore}`)
    }

    useEffect(() => {
        if (activeButton !== '1.5 any' && activeButton !== 'any 1.5' && activeButton !== 'any any'){
            setInputValueFrom(activeButton.split(' ')[0])
            setInputValueBefore(activeButton.split(' ')[1])
            setIsInputActive(true)
        }
    }, [activeButton]);

    return (
        <div>
            <div className="filter-odds">
                <button onClick={() => handleButtonClicked('1.5 any')}
                        className={activeButton === '1.5 any' ? 'active' : ''}>Победа до 1.5
                </button>
                <button onClick={() => handleButtonClicked('any 1.5')}
                        className={activeButton === 'any 1.5' ? 'active' : ''}>Победа соп. до 1.5
                </button>
                <div style={{display: 'inline-flex'}}>
                    <button onClick={handleSelectOdds}
                            className={"filter-odds button-with-input" + (isInputActive ? ' active' : '')}> Победа от &nbsp;
                        <input value={inputValueFrom}
                               type="text"
                               placeholder="1.3"
                               className="filter-odds input-in-button"
                               onChange={handleInputChangeFrom}>
                        </input>
                        &nbsp;
                        до
                        &nbsp;
                        <input value={inputValueBefore}
                               type="text"
                               placeholder="1.7"
                               className="filter-odds input-in-button"
                               onChange={handleInputChangeBefore}>
                        </input>
                    </button>
                    <button onClick={() => handleButtonClicked('any any')}
                            className={activeButton === 'any any' ? 'active' : ''}>Все
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterOdds;