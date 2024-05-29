import React, {useEffect, useState} from 'react';

import "./CountLastMatch.css"

function CountLastMatch( {activeButton, onSelectLastMatch} ) {
    const [inputValueLastMatch, setInputValueLastMatch] = useState('')
    const [isInputActive, setIsInputActive] = useState(false)

    const handleButtonClicked = (value) => {
        onSelectLastMatch(value)
        setIsInputActive(false)
    }

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputValueLastMatch(e.target.value)
        onSelectLastMatch(value) //Добавил вместо useEffect
        setIsInputActive(true)
    }

    const handleSelectLastMatch = () => {
        onSelectLastMatch(inputValueLastMatch)
        setIsInputActive(true)
    }

    // useEffect(() => {
    //     handleSelectLastMatch()
    // }, [inputValueLastMatch]);
    //
    // useEffect(() => {
    //     setIsInputActive(false)
    // }, []);

    return (
        <div>
            <div className="select-last-match">
                <button onClick={() => handleButtonClicked("5")}
                        className={activeButton === '5' && isInputActive !== true ? 'active' : ''}>5
                </button>
                <button onClick={() => handleButtonClicked("10")}
                        className={activeButton === '10' && isInputActive !== true ? 'active' : ''}>10
                </button>
                <button onClick={() => handleButtonClicked("15")}
                        className={activeButton === '15' && isInputActive !== true ? 'active' : ''}>15
                </button>
                <button onClick={() => handleButtonClicked("20")}
                        className={activeButton === '20' && isInputActive !== true ? 'active' : ''}>20
                </button>
                <button onClick={() => handleButtonClicked("30")}
                        className={activeButton === '30' && isInputActive !== true ? 'active' : ''}>30
                </button>
                <button onClick={() => handleButtonClicked("40")}
                        className={activeButton === '40' && isInputActive !== true ? 'active' : ''}>40
                </button>
                <button onClick={() => handleButtonClicked("50")}
                        className={activeButton === '50' && isInputActive !== true ? 'active' : ''}>50
                </button>
                <button onClick={handleSelectLastMatch}
                        value={inputValueLastMatch}
                        className={"select-last-match button-with-input" + (isInputActive ? ' active' : '')}>
                        <input type="text"
                               placeholder="0"
                               className="select-last-match input-in-button"
                               onChange={handleInputChange}>
                        </input>
                </button>
            </div>
        </div>
    );
}

export default CountLastMatch;