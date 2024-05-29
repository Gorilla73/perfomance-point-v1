import React from 'react';

import "./BadgeListTeam.css"

function BadgeChampionship({match, text, link}) {
    let className = ''
    if (match.owner_team.name === match.team_home.name){
        if (match.moment_end_match === 'MT'){
            if (match.score_team_home > match.score_team_away){
                className = 'win'
            }
            else {
                className = 'lose'
            }
        }
        else {
            if (match.score_team_home > match.score_team_away){
                className = 'win-draw'
            }
            else {
                className = 'lose-draw'
            }
        }
    }
    else {
        if (match.moment_end_match === 'MT'){
            if (match.score_team_away > match.score_team_home){
                className = 'win'
            }
            else {
                className = 'lose'
            }
        }
        else {
            if (match.score_team_away > match.score_team_home){
                className = 'win-draw'
            }
            else {
                className = 'lose-draw'
            }
        }
    }
    return (
        <div className='badge-result '>
            <a href={link} className={"badge " + className}>
                {text}
            </a>
        </div>

    );
}

export default BadgeChampionship;