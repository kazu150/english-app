import dayjs from 'dayjs';

export const createCalendar = month => {
    const firstDay = getMonth(month);
    const firstDayIndex = firstDay.day();

    return Array(42)
        .fill(0)
        .map((_, i) => {
            const diffFromFirstDay = i - firstDayIndex;
            const day = firstDay.add(diffFromFirstDay, 'day');

            return day;
        });
}

export const isSameDay = (d1, d2) => {
    const format = 'YYYYMMDD';
    return d1.format(format) === d2.format(format);
}

export const isSameMonth = (m1, m2) => {
    const format = "YYYYMM";
    return m1.format(format) === m2.format(format);
}

export const isFirstDay = day => day.date() === 1;

export const getMonth = ({year, month}) => {
    return dayjs(`${year}-${month}`)
}

export const getNextMonth = month => {
    const day = getMonth(month).add(1, 'month');
    return formatMonth(day);
}

export const getPreviousMonth = month => {
    const day = getMonth(month).add(-1, 'month');
    return formatMonth(day);
}

export const formatMonth = day => {
    return {
        year: day.year(),
        month: day.month() + 1 
    }
}

export const getDate = (date) => {
    return `${date.date.year()}年${date.date.month() + 1}月${date.date.date()}日`
    
}