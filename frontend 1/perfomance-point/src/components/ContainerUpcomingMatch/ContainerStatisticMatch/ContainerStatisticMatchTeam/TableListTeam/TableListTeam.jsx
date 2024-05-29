import React, {useEffect, useState} from 'react';

import BadgeListTeam from "./BadgeListTeam/BadgeListTeam";

import "./TableListTeam.css"

function TableListTeam({matches, previousSelectedMatches, onSelectMatches, HeadToHead}) {
    const [selectedAllMatches, setSelectedAllMatches] = useState(true);

    // Здесь можно хранить состояние выбранных матчей
    const [selectedMatches, setSelectedMatches] = useState(previousSelectedMatches);

    // Логика для обработки изменения галочки конкретного матча
    const handleMatchCheckboxChange = (matchId) => {
        // Проверяем, есть ли matchId уже в списке выбранных матчей
        const matchIndex = selectedMatches.findIndex(match => match.id === matchId);

        if (matchIndex !== -1) {
            // Если matchId найден в списке, удаляем его
            const updatedMatches = [...selectedMatches];
            updatedMatches.splice(matchIndex, 1);
            setSelectedMatches(updatedMatches);
            setSelectedAllMatches(false)
        } else {
            // Если matchId не найден в списке, добавляем его
            const matchIndex = matches.findIndex(match => match.id === matchId);
            if ([...selectedMatches, matches[matchIndex]].length === matches.length){
                setSelectedAllMatches(true)
            }
            setSelectedMatches([...selectedMatches, matches[matchIndex]]);
        }
    };


    // Логика для обработки изменения галочки учета всех матчей
    const handleSelectedAllMatches = () => {
        if (selectedAllMatches === true){
            setSelectedAllMatches(false);
            setSelectedMatches([])
        }
        else {
            setSelectedAllMatches(true);
            setSelectedMatches(matches)
        }
        // Пересчет таблицы средних
        // Отправка данных на обработку
    };

    // useEffect(() => {
    //     setSelectedMatches(matches)
    // }, [matches])

    useEffect(() => {
        if (selectedMatches.length === matches.length){
            setSelectedAllMatches(true)
        }
        onSelectMatches(selectedMatches)
    }, [selectedMatches])

    useEffect(() => {
        setSelectedMatches(previousSelectedMatches)
        if (previousSelectedMatches.length !== matches.length) {
            setSelectedAllMatches(false)
        }
    }, [previousSelectedMatches])

    return (
        <div>
            <table className='show-matches'>
                <thead>
                <tr>
                    <th style={{width: '5%'}}>
                        <input
                            type="checkbox"
                            onChange={handleSelectedAllMatches}
                            checked={selectedAllMatches}
                        />
                    </th>
                    <th style={{width: '10%'}}>Чемп.</th>
                    <th style={{width: '13%'}}>Сезон</th>
                    <th style={{width: '8%'}}>Дата</th>
                    <th style={{width: '15%'}}>Хозяева</th>
                    <th style={{width: '7%'}}>ИТ 1</th>
                    <th style={{width: '7%'}}>ИТ 2</th>
                    <th style={{width: '15%'}}>Гости</th>
                    <th style={{width: '5%'}}>Т</th>
                    <th style={{width: '10%'}}>Рез.</th>
                </tr>
                </thead>
                <tbody>
                {/* Здесь нужно отобразить список матчей с их галочками */}
                {matches.map((match, index) => (
                    <React.Fragment key={match.id}>
                        {/* Проверяем, является ли текущий тренер отличным от тренера предыдущего матча */}
                        {!HeadToHead && index > 0 && match.coach !== matches[index - 1].coach && (
                            <tr>
                                <td className='show-matches new-coach' colSpan="10">
                                    <span style={{color: 'red', fontWeight: 'bold'}}>❗️</span>
                                    Новый тренер {match.owner_team.name.replace('_', '')} - {match.coach}
                                    &nbsp;(старый - {matches[index - 1].coach})
                                    <span style={{color: 'red', fontWeight: 'bold'}}>❗️</span>
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td>
                                <input
                                    type="checkbox"
                                    onChange={() => handleMatchCheckboxChange(match.id)}
                                    checked={selectedMatches.some(selectedMatch => selectedMatch.id === match.id)}
                                />
                            </td>
                            <td><a href={`/championship/${match.championship.id}`}>{match.championship.name}</a></td>
                            <td>{match.season}</td>
                            <td>{match.date}</td>
                            {/* Остальные столбцы таблицы */}
                            <td className={match.owner_team.name === match.team_home.name ?
                                match.statistic_team_home > match.statistic_team_away ? 'bg-win' :
                                    match.statistic_team_home === match.statistic_team_away ? 'bg-draw' :
                                        'bg-lose' : ''
                            }><a href={`/team/${match.team_home.id}`}>{match.team_home.name.replace('_', ' ')}</a></td>
                            <td className={match.owner_team.name === match.team_home.name ?
                                match.statistic_team_home > match.statistic_team_away ? 'bg-win' :
                                    match.statistic_team_home === match.statistic_team_away ? 'bg-draw' :
                                        'bg-lose' : ''
                            }>{match.statistic_team_home}</td>
                            <td className={match.owner_team.name === match.team_away.name ?
                                match.statistic_team_away > match.statistic_team_home ? 'bg-win' :
                                    match.statistic_team_away === match.statistic_team_home ? 'bg-draw' :
                                        'bg-lose' : ''
                            }>{match.statistic_team_away}</td>
                            <td className={match.owner_team.name === match.team_away.name ?
                                match.statistic_team_away > match.statistic_team_home ? 'bg-win' :
                                    match.statistic_team_away === match.statistic_team_home ? 'bg-draw' :
                                        'bg-lose' : ''
                            }><a href={`/team/${match.team_away.id}`}>{match.team_away.name.replace('_', ' ')}</a></td>
                            <td>{match.statistic}</td>
                            <td><BadgeListTeam match={match}
                                               text={`${match.score_team_home}-${match.score_team_away}`}
                                               link={"#"}/></td>
                        </tr>
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableListTeam;