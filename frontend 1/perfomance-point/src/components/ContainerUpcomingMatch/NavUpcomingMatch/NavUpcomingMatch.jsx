import React, {useState} from 'react';

import ContainerStatisticMatch from "../ContainerStatisticMatch/ContainerStatisticMatch";
import ContainerStatisticHeadToHeadMatch from "../ContainerStatisticHeadToHeadMatch/ContainerStatisticHeadToHeadMatch";

import "./NavUpcomingMatch.css"

function NavUpcomingMatch( {match} ) {
    const [activeLink, setActiveLink] = useState('stats'); // По умолчанию активна статистика матчей
    const [activeData, setActiveData] = useState({})
    const [activeDataHeadToHead, setActiveDataHeadToHead] = useState({})

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    const handleActiveData = (name, data) => {
        setActiveData(prevActiveData => {
            // console.log({...prevActiveData, [name]: data})
            return {...prevActiveData, [name]: data}; // Обновленное состояние
        });
    }

    const handleActiveDataHeadToHead = (name, data) => {
        setActiveDataHeadToHead(prevActiveDataHeadToHead => {
            return {...prevActiveDataHeadToHead, [name]: data}; // Обновленное состояние
        });
    }

    return (
        <div>
            <div className="nav-button">
                <button onClick={() => handleLinkClick('stats')} className={activeLink === 'stats' ? 'active' : ''}>Статистика матчей</button>
                <button onClick={() => handleLinkClick('head2head')} className={activeLink === 'head2head' ? 'active' : ''}>Очные встречи</button>
                <button onClick={() => handleLinkClick('odds')} className={activeLink === 'odds' ? 'active' : ''}>Коэффициенты</button>
            </div>
            <div>
                {activeLink === 'stats' && <ContainerStatisticMatch match={match}
                                                                    activeData={activeData}
                                                                    onActiveData={handleActiveData}/>}
                {activeLink === 'head2head' && <ContainerStatisticHeadToHeadMatch match={match}
                                                                                  activeData={activeDataHeadToHead}
                                                                                  onActiveData={handleActiveDataHeadToHead}/>}
                {activeLink === 'odds' && <p>В разработке</p>}
            </div>
        </div>
    );
}


export default NavUpcomingMatch;