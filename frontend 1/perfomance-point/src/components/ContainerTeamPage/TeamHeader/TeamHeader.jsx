import React from 'react';

import './TeamHeader.css'

function TeamHeader({team}) {
    return (
        <div className='team-info'>
            {/* Проверяем, что championship.logo существует перед использованием */}
            {team.logo && <img src={team.logo} alt="Team logo"/>}
            {/* Отображаем название чемпионата, проверив, что championshipName не пустая строка */}
            {team.name && <h3>{team.name.replace('_', ' ')}</h3>}
            <div className='average-data-team'>
                <p>Среднее кол-во голов: 5</p>
                <p>Среднее кол-во бросков: 50</p>
                <p>Среднее кол-во удалений: 6</p>
            </div>
        </div>
    );
}

export default TeamHeader;