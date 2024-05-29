import React, {useState} from 'react';

import BadgeChampionship from "./BadgeChampionship";

import "./Championship.css"


function Championship({ championship }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="championship-container">
            <div className="header" onClick={toggleList}>
                <a href={`championship/${championship.championship_id}`}><h4>{championship.championship_name}</h4></a>
                    <div className={"arrow" + `${isOpen ? ' down' : ' right'}`}></div>
            </div>
            {isOpen && (
                <ul className="matches-list">
                    {championship.matches.map((match) => (
                        <li key={match.id} className="match-item">
                            <span>{match.time}</span>
                            <span><a href="#">{match.team1.replace('_', ' ')}</a> vs <a href="#">{match.team2.replace('_', ' ')}</a></span>
                            {/*<button className="detail-button">Линия</button>*/}
                            <BadgeChampionship text={"Линия"} link={`/upcoming_match/${match.id}`} class_result="line"/>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Championship;
