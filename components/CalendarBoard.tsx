import React from 'react';
import GridList from '@material-ui/core/GridList';
import { createCalendar } from '../utils/calendar';
import dayjs from 'dayjs';
import CalendarElement from './CalendarElement';

const Calendar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = dayjs();
    const dates = createCalendar({
        year: today.year(),
        month: today.month() + 1,
    });

    return (
        <div>
            <GridList
                // className={styles.grid}
                cols={7}
                spacing={0}
                cellHeight="auto"
            >
                {days.map((day, index) => (
                    <li key={index}>{day}</li>
                ))}
                {dates.map((date, index) => (
                    <li key={index}>
                        <CalendarElement
                            // month={month}
                            day={date}
                            // schedules={schedules}
                            // onClickSchedule={openCurrentScheduleDialog}
                        />
                    </li>
                ))}
            </GridList>
        </div>
    );
};

export default Calendar;
