import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from '../pages/_app';
import dayjs from 'dayjs';
import {
    isSameDay,
    isSameMonth,
    isFirstDay,
    getMonth,
} from '../utils/calendar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    existLogs: {
        color: 'blue',
        cursor: 'pointer',
    },
});

const CalendarElement = ({ date, studyLog, open, setOpen, setCurrentLogs }) => {
    const classes = useStyles();
    const { dispatch, state } = useContext(MyContext);
    const [logsOnCurrentDate, setLogsOnCurrentDate] = useState([]);
    const today = dayjs();

    // const currentMonth = getMonth(month);
    // const isCurrentMonth = isSameMonth(day, currentMonth);
    // const textColor = isCurrentMonth ? 'textPrimary' : 'textSecondary';
    useEffect(() => {
        const log = studyLog
            .map((log) => isSameDay(log.date, date) && log)
            .filter(Boolean);
        setLogsOnCurrentDate(log);
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
        // <div className={styles.element}>
        <div>
            {/* <Typography
                className={styles.date}
                align="center"
                variant="caption"
                component="div"
                color={textColor}
            > */}
            {/* <span className={isToday ? styles.today : ''}> */}
            <span
                className={logsOnCurrentDate.length ? classes.existLogs : ''}
                onClick={onSelectDetail}
            >
                {date.format(format)}
            </span>
            {/* </Typography> */}
            {/* <div className={styles.schedules}>
                {schedules.map((e) => (
                    <Schedule key={e.id} schedule={e} {...props} />
                ))}
            </div> */}
        </div>
    );
};

export default CalendarElement;
