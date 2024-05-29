import React, {useState} from 'react';
import ContainerStatisticMatch from "../../ContainerUpcomingMatch/ContainerStatisticMatch/ContainerStatisticMatch";
import ContainerStatisticHeadToHeadMatch
    from "../../ContainerUpcomingMatch/ContainerStatisticHeadToHeadMatch/ContainerStatisticHeadToHeadMatch";

import './NavProfile.css'
import MainProfile from "../MainProfile/MainProfile";
import StatisticProfile from "../StatisticProfile/StatisticProfile";
import AccountProfile from "../AccountProfile/AccountProfile";

function NavProfile({user, onUser, onCurrentUser}) {
    const [activeLink, setActiveLink] = useState('main'); // По умолчанию активна статистика матчей

    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
    return (
        <div className='nav-profile'>
            <div className="nav-button">
                <button onClick={() => handleLinkClick('main')}
                        className={activeLink === 'main' ? 'active' : ''}>Основные
                </button>
                <button onClick={() => handleLinkClick('statistics')}
                        className={activeLink === 'statistics' ? 'active' : ''}>Настройка статистики
                </button>
                <button onClick={() => handleLinkClick('account')}
                        className={activeLink === 'account' ? 'active' : ''}>Аккаунт
                </button>
            </div>
            <div>
                {activeLink === 'main' && <MainProfile user={user} onUser={onUser}/>}
                {activeLink === 'statistics' && <StatisticProfile user={user} onUser={onUser}/>}
                {activeLink === 'account' && <AccountProfile user={user} onUser={onUser} onCurrentUser={onCurrentUser}/>}
            </div>
        </div>
    );
}

export default NavProfile;