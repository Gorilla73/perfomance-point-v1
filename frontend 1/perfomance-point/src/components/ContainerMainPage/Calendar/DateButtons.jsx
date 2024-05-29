import React, {useEffect, useState} from 'react';

import "./Calendar.css"

function DateButtons({dates, selectedDataCalendarInput, onDateChange}) {

    const [activeButton, setActiveButton] = useState(dates[1]);

    const handleDateClick = (date) => {
        setActiveButton(date)
        onDateChange(date);
    };

    useEffect(() => {
        if (selectedDataCalendarInput !== null) {
            setActiveButton(new Date('December 17, 1971 03:24:00')); // Сброс активной кнопки при изменении даты
            onDateChange(selectedDataCalendarInput)
        }
    }, [selectedDataCalendarInput]);


    return (
        <div className="date-buttons">
            {dates.map((date) => (
                <button
                    key={date}
                    className={"btn-calendar" + (date.toLocaleDateString() === activeButton.toLocaleDateString() ? ' active' : '')}

                    onClick={() => handleDateClick(date)}
                >
                    {date.getDate().toString().padStart(2, '0')}.{(date.getMonth() + 1).toString().padStart(2, '0')}
                </button>
            ))}
        </div>
    );
}

export default DateButtons;