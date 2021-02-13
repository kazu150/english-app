import React, { useState, useEffect, FC } from 'react';
import {
    isSameDay,
    getMonth,
    isSameMonth,
    isFirstDay,
    formatMonth,
} from '../utils/calendar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import { Log } from '../pages/[userId]';

const useStyles = makeStyles({
    colorSecondary: {
        color: 'lightgray',
    },
    calendarElementActive: {
        height: '40px',
        width: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        margin: 'auto',
        cursor: 'pointer',
        paddingTop: '9px',
        background: '#2196f3',
        color: '#fff',
        border: '1px solid #2196f3',
        '&:hover': {
            background: '#fff',
            color: '#000',
        },
    },
    calendarElement: {
        height: '40px',
        border: '1px solid #fff',
        width: '40px',
        textAlign: 'center',
        borderRadius: '50%',
        margin: 'auto',
        paddingTop: '9px',
    },
});

type Props = {
    day: dayjs.Dayjs;
    studyLog: Log[];
    open: boolean;
    month: dayjs.Dayjs;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentLogs: React.Dispatch<React.SetStateAction<Log[]>>;
};

const CalendarElement: FC<Props> = ({
    day,
    studyLog,
    open,
    month,
    setOpen,
    setCurrentLogs,
}) => {
    const classes = useStyles();
    const [logsOnCurrentDate, setLogsOnCurrentDate] = useState<Log[]>([]);
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

    const onSelectDetail = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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
            <div className={isCurrentMonth ? '' : classes.colorSecondary}>
                {day.format(format)}
            </div>
        </li>
    );
};

export default CalendarElement;
