import {useState} from "react";

import './FilterResultPeriodHeadToHead.css'

function FilterResultPeriodHeadToHead( {activeButton, onSelectResultPeriod} ) {
    const [selectedOption, setSelectedOption] = useState( 'team_home_win_after_1st_period');

    const handleSelectChange = (e) => {
        const filter = e.target.value //Добавил вместо useEffect
        setSelectedOption(e.target.value)
        onSelectResultPeriod(filter) //Добавил вместо useEffect
    }
    const handleButtonResultPeriodFilterClick = () => {
        onSelectResultPeriod(selectedOption) //Добавил вместо useEffect
    }

    return (
        <div>
            <div className='select-result-period'>
                <button
                    className={'select-result-period button-with-select' + (activeButton === selectedOption ? ' active' : '')}
                    onClick={handleButtonResultPeriodFilterClick}>
                    <select className='select-result-period select-in-button'
                            value={selectedOption}
                            onChange={handleSelectChange}>
                        <option value="team_home_win_after_1st_period">Победа после 1-го периода домашней команды
                        </option>
                        <option value="team_away_win_after_1st_period">Победа после 1-го периода гостевой команды
                        </option>
                        <option value="draw_after_1st_period">Ничья после 1-го периода</option>
                        <option value="team_home_lose_after_1st_period">Поражение после 1-го периода домашней команды
                        </option>
                        <option value="team_away_lose_after_1st_period">Поражение после 1-го периода гостевой команды
                        </option>
                        <option value="team_home_win_after_2st_period">Победа после 2-го периода домашней команды
                        </option>
                        <option value="team_away_win_after_2st_period">Победа после 2-го периода гостевой команды
                        </option>
                        <option value="draw_after_2st_period">Ничья после 2-го периода</option>
                        <option value="team_home_lose_after_2st_period">Поражение после 2-го периода домашней команды
                        </option>
                        <option value="team_away_lose_after_2st_period">Поражение после 2-го периода гостевой команды
                        </option>
                    </select>
                </button>
                <button onClick={() => onSelectResultPeriod('all')}
                        className={activeButton === 'all' ? 'active' : ''}>Все
                </button>
            </div>
        </div>
    );
}

export default FilterResultPeriodHeadToHead;