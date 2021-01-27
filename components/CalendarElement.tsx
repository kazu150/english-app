import React from 'react';
import dayjs from 'dayjs';
import {
    isSameDay,
    isSameMonth,
    isFirstDay,
    getMonth,
} from '../utils/calendar';

const CalendarElement = ({ date }) => {
    const today = dayjs();

    // const currentMonth = getMonth(month);
    // const isCurrentMonth = isSameMonth(day, currentMonth);
    // const textColor = isCurrentMonth ? 'textPrimary' : 'textSecondary';

    const format = isFirstDay(date) ? 'M月D日' : 'D';
    // const isToday = isSameDay(today, day);

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
            <span className="">{date.format(format)}</span>
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
