import React from 'react';
import Championship from "./Championship";

import "./ChampionshipList.css"
function ChampionshipList({ championships }) {
    return (
        <div className="championship">
            <div className="championship-list-container">
                    {championships.map((championship) => (
                        <Championship key={championship.championship_name} championship={championship}/>
                    ))}
            </div>
        </div>
    );
}

export default ChampionshipList;