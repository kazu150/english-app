import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../pages/_app';
import dayjs from 'dayjs';
import { isSameDay, isFirstDay } from '../utils/calendar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    existLogs: {
        color: 'blue',
        cursor: 'pointer',
    },
});

const CalendarElement = ({ date, studyLog, open, setOpen, setCurrentLogs }) => {
    const classes = useStyles();
    const [logsOnCurrentDate, setLogsOnCurrentDate] = useState([]);
    const today = dayjs();

    useEffect(() => {
        const log = studyLog
            .map((log) => isSameDay(log.date, date) && log)
            .filter(Boolean);
        setLogsOnCurrentDate(log);
        return () => {
            log;
            setLogsOnCurrentDate([]);
        };
    }, [date, studyLog]);

    const format = isFirstDay(date) ? 'M月D日' : 'D';
    // const isToday = isSameDay(today, day);

    const onSelectDetail = (e) => {
        e.preventDefault();
        if (!logsOnCurrentDate.length) {
            return;
        }
        setOpen(true);
        setCurrentLogs(logsOnCurrentDate);
    };

    return (
        <div>
            <span
                className={logsOnCurrentDate.length ? classes.existLogs : ''}
                onClick={onSelectDetail}
            >
                {date.format(format)}
            </span>
        </div>
    );
};

export default CalendarElement;
