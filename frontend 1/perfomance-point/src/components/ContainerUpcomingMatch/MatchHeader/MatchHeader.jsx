import React from 'react';
import "./MatchHeader.css"

function MatchHeader( {match} ) {

    return (

        <div className="match-info">
            <div className="team home">
                <img src={match.team_home_logo} alt="Team home logo" />
                <h3><a href="#">{match.team_home_name}</a></h3>
            </div>
            <div className="datetime">{match.matchDate}</div>
            <div className="team away">
                <h3><a href="#">{match.team_away_name}</a></h3>
                <img src={match.team_away_logo} alt="Team away logo" />
            </div>
        </div>
    );
}
export default MatchHeader;