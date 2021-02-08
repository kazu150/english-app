import React, { useState, useEffect } from 'react';
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

    const format = isFirstDay(date) ? 'M/D' : 'D';

    const onSelectDetail = (e) => {
        e.preventDefault();
        if (!logsOnCurrentDate.length) {
            return;
        }
        setOpen(true);
        setCurrentLogs(logsOnCurrentDate);
    };

    return (
        <span
            className={logsOnCurrentDate.length ? classes.existLogs : ''}
            onClick={onSelectDetail}
        >
            {date.format(format)}
        </span>
    );
};

export default CalendarElement;
