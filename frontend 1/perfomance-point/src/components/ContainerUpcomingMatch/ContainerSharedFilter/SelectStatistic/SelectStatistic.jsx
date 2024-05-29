import React, {useState} from 'react';

import "./SelectStatistic.css"

function SelectStatistic( {activeButton, onSelectStatistic} ) {

    return (
        <div>
            <div className="select-statistic">
                <button onClick={() => onSelectStatistic('score')}
                        className={activeButton === 'score' ? 'active' : ''}>Голы
                </button>
                <button onClick={() => onSelectStatistic('shots_on_goal')}
                        className={activeButton === 'shots_on_goal' ? 'active' : ''}>Броски в створ
                </button>
                <button onClick={() => onSelectStatistic('faceoffs_won')}
                        className={activeButton === 'faceoffs_won' ? 'active' : ''}>Выигр. вбрасывания
                </button>
                <button onClick={() => onSelectStatistic('hits')}
                        className={activeButton === 'hits' ? 'active' : ''}>Сил. приемы
                </button>
                <button onClick={() => onSelectStatistic('power_play_goals')}
                        className={activeButton === 'power_play_goals' ? 'active' : ''}>Голы в большинстве
                </button>
                <button onClick={() => onSelectStatistic('penalties')}
                        className={activeButton === 'penalties' ? 'active' : ''}>Кол-во 2-х мин. удалений
                </button>
            </div>
        </div>
    );
}


export default SelectStatistic;