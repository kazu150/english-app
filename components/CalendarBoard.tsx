import React, { useEffect, useState } from 'react';
import GridList from '@material-ui/core/GridList';
import { createCalendar, isSameDay } from '../utils/calendar';
import dayjs from 'dayjs';
import CalendarElement from './CalendarElement';
import { db } from '../firebase';
import Dialog from './Dialog';

const Calendar = ({ studyLog }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = dayjs();
    const dates = createCalendar({
        year: today.year(),
        month: today.month() + 1,
    });
    const [open, setOpen] = useState(false);
    const [currentLogs, setCurrentLogs] = useState([]);

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
                {dates.map((date, index) => {
                    return (
                        <li key={index}>
                            <CalendarElement
                                // month={month}
                                date={date}
                                studyLog={studyLog}
                                open={open}
                                setOpen={setOpen}
                                setCurrentLogs={setCurrentLogs}
                                // schedules={schedules}
                                // onClickSchedule={openCurrentScheduleDialog}
                            />
                        </li>
                    );
                })}
            </GridList>
            <Dialog open={open} setOpen={setOpen} currentLogs={currentLogs} />
        </div>
    );
};

export default Calendar;
