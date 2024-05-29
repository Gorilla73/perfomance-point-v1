import React from 'react';

import './ChampionshipHeader.css'

function ChampionshipHeader( {championship} ) {

    return championship && (
        <div className='championship-info'>
            {/* Проверяем, что championship.logo существует перед использованием */}
            {championship.logo && <img src={championship.logo} alt="Championship logo"/>}
            {/* Отображаем название чемпионата, проверив, что championshipName не пустая строка */}
            {championship.name && <h3>{championship.name.replace('_', ' ')}</h3>}
            <div className='average-data-championship'>
                <p>Среднее кол-во голов: 5</p>
                <p>Среднее кол-во бросков: 50</p>
                <p>Среднее кол-во удалений: 6</p>
            </div>
        </div>
    );
}

export default ChampionshipHeader;