import React, { useState, useEffect } from 'react';
import {
    isSameDay,
    getMonth,
    isSameMonth,
    isFirstDay,
    formatMonth,
} from '../utils/calendar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    colorSecondary: {
        color: 'lightgray',
        '&:hover': {
            color: 'white',
        },
    },
    calendarElementActive: {
        height: '40px',
        width: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        margin: 'auto',
        border: '1px solid lightGray',
        cursor: 'pointer',
        paddingTop: '6px',
        '&:hover': {
            background: 'lightGray',
        },
    },
    calendarElement: {
        height: '40px',
        width: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        margin: 'auto',
        paddingTop: '6px',
    },
});

const CalendarElement = ({
    day,
    studyLog,
    open,
    month,
    setOpen,
    setCurrentLogs,
}) => {
    const classes = useStyles();
    const [logsOnCurrentDate, setLogsOnCurrentDate] = useState([]);
    const isCurrentMonth = isSameMonth(getMonth(formatMonth(day)), month);

    useEffect(() => {
        const log = studyLog
            .map((log) => isSameDay(log.date, day) && log)
            .filter(Boolean);
        setLogsOnCurrentDate(log);
        return () => {
            log;
            setLogsOnCurrentDate([]);
        };
    }, [day, studyLog]);

    const format = isFirstDay(day) ? 'M/D' : 'D';

    const onSelectDetail = (e) => {
        e.preventDefault();
        if (!logsOnCurrentDate.length) {
            return;
        }
        setOpen(true);
        setCurrentLogs(logsOnCurrentDate);
    };

    return (
        <li
            className={
                logsOnCurrentDate.length
                    ? classes.calendarElementActive
                    : classes.calendarElement
            }
            onClick={onSelectDetail}
        >
            <Typography
                component="div"
                className={isCurrentMonth ? '' : classes.colorSecondary}
            >
                {day.format(format)}
            </Typography>
        </li>
    );
};

export default CalendarElement;
