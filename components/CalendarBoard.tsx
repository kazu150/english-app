import React, { useState } from 'react';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    createCalendar,
    isSameMonth,
    getNextMonth,
    getPreviousMonth,
    getMonth,
    formatMonth,
} from '../utils/calendar';
import dayjs from 'dayjs';
import CalendarElement from './CalendarElement';
import { db } from '../firebase';
import Dialog from './Dialog';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btnContainer: {
            display: 'flex',
        },
        button: {
            flex: 1,
            '&:nth-of-type(2)': {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
            },
        },
    })
);

const Calendar = ({ studyLog }) => {
    const classes = useStyles();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = dayjs();

    const initialDate = formatMonth(today);
    const [date, setDate] = useState(initialDate);

    const [open, setOpen] = useState(false);
    const [currentLogs, setCurrentLogs] = useState([]);

    // 表示中の月を切り替える
    const onClickChangeMonthBtn = (changeTo) => {
        if (changeTo < 0) {
            setDate(getPreviousMonth(date));
        } else if (changeTo === 0) {
            setDate(initialDate);
        } else if (changeTo > 0) {
            setDate(getNextMonth(date));
        }
    };

    return (
        <div>
            <div className={classes.btnContainer}>
                <Button
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    className={classes.button}
                    onClick={() => onClickChangeMonthBtn(-1)}
                >
                    前の月へ
                </Button>
                <Button
                    variant="outlined"
                    // 表示中の月が当月の場合は非表示にする
                    disabled={
                        isSameMonth(getMonth(date), getMonth(initialDate))
                            ? true
                            : false
                    }
                    className={classes.button}
                    onClick={() => onClickChangeMonthBtn(0)}
                >
                    当月へ戻る
                </Button>
                <Button
                    variant="outlined"
                    endIcon={<NavigateNextIcon />}
                    className={classes.button}
                    // 表示中の月が当月の場合は非表示にする
                    disabled={
                        isSameMonth(getMonth(date), getMonth(initialDate))
                            ? true
                            : false
                    }
                    onClick={() => onClickChangeMonthBtn(1)}
                >
                    次の月へ
                </Button>
            </div>
            <GridList
                // className={styles.grid}
                cols={7}
                spacing={0}
                cellHeight="auto"
            >
                {days.map((day, index) => (
                    <li key={index}>{day}</li>
                ))}
                {createCalendar(date).map((date, index) => {
                    return (
                        <li key={index}>
                            <CalendarElement
                                // month={month}
                                date={date}
                                studyLog={studyLog}
                                open={open}
                                setOpen={setOpen}
                                setCurrentLogs={setCurrentLogs}
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
