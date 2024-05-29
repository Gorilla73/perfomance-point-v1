import React, {useEffect, useRef, useState} from 'react';

import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';

import './CalendarInput.css';

function CalendarInput( {selected_date, onDateChange} ) {

    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null)

    const handleDateChange = (selectedDate) => {
        setShowCalendar(false);
        onDateChange(selectedDate);
    };

    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);




    return (
        <div className="calendar-input" ref={calendarRef}>
            <input
                type="text"
                value={selected_date.toLocaleDateString()}
                onClick={() => setShowCalendar(true)}
                readOnly
            />
            {showCalendar && (
                <div className="calendar-popup">
                    <Calendar
                        className="react-calendar"
                        onChange={handleDateChange}
                        value={selected_date} />
                </div>
            )}
        </div>
    );

}

export default CalendarInput;