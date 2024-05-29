import React, {useState} from 'react';

import './TableChampionship.css'

function TableChampionship({tables}) {

    const [sortOrder, setSortOrder] = useState(null); // состояние для отслеживания порядка сортировки
    const [columnToSort, setColumnToSort] = useState(null); // состояние для отслеживания столбца для сортировки

    // функция обратного вызова для изменения порядка сортировки
    const handleSort = (columnName) => {
        // если выбранный столбец уже был выбран для сортировки, меняем порядок сортировки
        if (columnToSort === columnName) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // иначе устанавливаем выбранный столбец для сортировки и порядок сортировки по возрастанию
            setColumnToSort(columnName);
            setSortOrder('asc');
        }
    };

    // функция для сортировки таблицы по заданному столбцу и порядку сортировки
    const sortedTables = () => {
        return tables.slice().sort((a, b) => {
            if (sortOrder === 'asc') {
                if (columnToSort === 'team_name') {
                    return a.team_name.localeCompare(b.team_name);
                } else {
                    return a[columnToSort] - b[columnToSort];
                }
            } else if (sortOrder === 'desc') {
                if (columnToSort === 'team_name') {
                    return b.team_name.localeCompare(a.team_name);
                } else {
                    return b[columnToSort] - a[columnToSort];
                }
            } else {
                return tables;
            }
        });
    };

    return (
        <div>
            <table className="average-table">
                <thead>
                <tr>
                    <th onClick={() => handleSort('#')}>#</th>
                    <th onClick={() => handleSort('team_name')}>Название</th>
                    <th onClick={() => handleSort('games')}>И</th>
                    <th onClick={() => handleSort('win')}>В</th>
                    <th onClick={() => handleSort('draw')}>Н</th>
                    <th onClick={() => handleSort('lose')}>П</th>
                    <th onClick={() => handleSort('averageDifference')}>Ср. разница</th>
                    <th onClick={() => handleSort('averageIndTotal')}>Ср. ИТ</th>
                    <th onClick={() => handleSort('averageIndTotalOpp')}>Ср. ИТ соп.</th>
                    <th onClick={() => handleSort('sharedTotal')}>Ср. тотал</th>
                    <th onClick={() => handleSort('averageDeviationIndTotal')}>Ср. откл. инд. тотала</th>
                    <th onClick={() => handleSort('averageDeviationIndTotalOpp')}>Ср. откл. инд. тотала соп.</th>
                    <th onClick={() => handleSort('averageDeviationSharedTotal')}>Ср. откл. тотала</th>
                </tr>
                </thead>

                <tbody>
                {sortedTables().map((table, index) => (
                    <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td><a href={`/team/${table.id}`}>{table.team_name.replace('_', ' ')} </a></td>
                        <td>{table.games}</td>
                        <td>{table.win}</td>
                        <td>{table.draw}</td>
                        <td>{table.lose}</td>
                        <td>{table.averageDifference}</td>
                        <td>{table.averageIndTotal}</td>
                        <td>{table.averageIndTotalOpp}</td>
                        <td>{table.sharedTotal}</td>
                        <td>{table.averageDeviationIndTotal}</td>
                        <td>{table.averageDeviationIndTotalOpp}</td>
                        <td>{table.averageDeviationSharedTotal}</td>
                    </tr>
                    )
                )}
                </tbody>
            </table>
        </div>
    );
}

export default TableChampionship;