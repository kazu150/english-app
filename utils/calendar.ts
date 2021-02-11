import dayjs from 'dayjs';

type formattedMonth = {
    year: number;
    month: number;
};

export const createCalendar = (month: formattedMonth) => {
    const firstDay = getMonth(month);
    const firstDayIndex = firstDay.day();

    return Array(42)
        .fill(0)
        .map((_, i) => {
            const diffFromFirstDay = i - firstDayIndex;
            const day = firstDay.add(diffFromFirstDay, 'day');

            return day;
        });
};

export const isSameDay = (d1: dayjs.Dayjs, d2: dayjs.Dayjs) => {
    const format = 'YYYYMMDD';
    return d1.format(format) === d2.format(format);
};

export const isSameMonth = (m1: dayjs.Dayjs, m2: dayjs.Dayjs) => {
    const format = 'YYYYMM';
    return m1.format(format) === m2.format(format);
};

export const isFirstDay = (day: dayjs.Dayjs) => day.date() === 1;

export const getMonth = ({ year, month }: formattedMonth) => {
    return dayjs(`${year}-${month}`);
};

export const getNextMonth = (month: formattedMonth) => {
    const day = getMonth(month).add(1, 'month');
    return formatMonth(day);
};

export const getPreviousMonth = (month: formattedMonth) => {
    const day = getMonth(month).add(-1, 'month');
    return formatMonth(day);
};

export const formatMonth = (day: dayjs.Dayjs): formattedMonth => {
    return {
        year: day.year(),
        month: day.month() + 1,
    };
};

export const getDateFromLogs = (log) => {
    return `${log.date.year()}年${log.date.month() + 1}月${log.date.date()}日`;
};
