import React, {useEffect, useState} from 'react';

import TablePossibilitiesTotal from "./TablePossibility/TablePossibilitiesTotal";
import TablePossibilitiesIndTotal from "./TablePossibility/TablePossibilitiesIndTotal";
import TablePossibilitiesIndTotalOpp from "./TablePossibility/TablePossibilitiesIndTotalOpp";
import TablePossibilitiesHandicap from "./TablePossibility/TablePossibilitiesHandicap";
import TablePossibilitiesHandicapOpp from "./TablePossibility/TablePossibilitiesHandicapOpp";

import calculateTablePossibilitiesTotal from "../../../../../utils/calculateTablePossibilitiesTotal";
import calculateTablePossibilitiesIndTotal from "../../../../../utils/calculateTablePossibilitiesIndTotal";
import calculateTablePossibilitiesIndTotalOpp from "../../../../../utils/calculateTablePossibilitiesIndTotalOpp";
import calculateTablePossibilitiesHandicap from "../../../../../utils/calculateTablePossibilitiesHandicap";

function TablesPossibilities( {matches, headToHead, team_home_name,  team_away_name} ) {
    const [tableTotal, setTableTotal] = useState()
    const [tableIndTotal, setTableIndTotal] = useState()
    const [tableIndTotalOpp, setTableIndTotalOpp] = useState()
    const [tableHandicap, setTableHandicap] = useState()
    const [tableHandicapOpp, setTableHandicapOpp] = useState()

    useEffect(() => {
        setTableTotal(calculateTablePossibilitiesTotal(matches))
        setTableIndTotal(calculateTablePossibilitiesIndTotal(matches))
        setTableIndTotalOpp(calculateTablePossibilitiesIndTotalOpp(matches))
        const { handicap_current_team, handicap_opponent_team } = calculateTablePossibilitiesHandicap(matches)
        setTableHandicap(handicap_current_team)
        setTableHandicapOpp(handicap_opponent_team)
    }, [matches])

    return (
        <div className="group-table-bet">
            <TablePossibilitiesTotal data={tableTotal} headToHead={headToHead} team_name={team_home_name}/>
            <TablePossibilitiesIndTotal data={tableIndTotal} headToHead={headToHead} team_name={team_home_name}/>
            <TablePossibilitiesIndTotalOpp data={tableIndTotalOpp} headToHead={headToHead} team_name={team_away_name}/>
            <TablePossibilitiesHandicap data={tableHandicap} headToHead={headToHead} team_name={team_home_name}/>
            <TablePossibilitiesHandicapOpp data={tableHandicapOpp} headToHead={headToHead} team_name={team_away_name}/>
        </div>
    );
}

export default TablesPossibilities;