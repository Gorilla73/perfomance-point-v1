import React from 'react';

import "./BadgeChampionship.css"

function BadgeChampionship({ text, link, class_result }) {
    return (
        <a href={link} className={"badge" + " " + class_result}>
            {text}
        </a>

    );
}

export default BadgeChampionship;