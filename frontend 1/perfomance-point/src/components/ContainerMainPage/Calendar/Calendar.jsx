import React, {useState} from 'react';
import "./Calendar.css"

import {addDays, subDays} from 'date-fns';
import DateButtons from "./DateButtons";
import CalendarInput from "./CalendarInput";

function Calendar( {date, onSelectedDate} ) {
    const [selectedDate, setSelectedDate] = useState(date);
    const [selectedDataCalendarInput, setSelectedDataCalendarInput] = useState(null)

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onSelectedDate(date)
    };

    const handleDateChangeCalendarInput = (date) => {
        setSelectedDataCalendarInput(date)
        onSelectedDate(date)
    }

    const today = new Date()
    const dates = [
        subDays(today, 1),
        today,
        addDays(today, 1),
        addDays(today, 2),
        addDays(today, 3),
        addDays(today, 4),
        addDays(today, 5)
    ];


    return (
        <div className="calendar">
            <DateButtons dates={dates}
                         selected_date={selectedDate}
                         onDateChange={handleDateChange}
                         selectedDataCalendarInput={selectedDataCalendarInput}
            />
            <CalendarInput selected_date={selectedDate}
                           onDateChange={handleDateChangeCalendarInput} />
        </div>
    );
}


export default Calendar;