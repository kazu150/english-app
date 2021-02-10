import React, { useState } from 'react';
import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
        root: {
            borderRadius: '5px',
        },
        title: {
            borderRadius: '5px 5px 0 0',
        },
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
        grid: {
            display: 'flex',
        },
        calendarElement: {
            height: '30px',
            textAlign: 'center',
            margin: 'auto',
        },
    })
);

const Calendar = ({
    open,
    setOpen,
    studyLog,
    onDeleteClick,
    currentLogs,
    setCurrentLogs,
}) => {
    const classes = useStyles();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = dayjs();

    const initialDate = formatMonth(today);
    const [date, setDate] = useState(initialDate);

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
        <Box
            className={classes.root}
            boxShadow={3}
            bgcolor="background.paper"
            p={0}
        >
            <Box
                className={classes.title}
                p={2}
                mb={1}
                bgcolor="primary.main"
                color="primary.text"
            >
                <Typography component="h4">
                    {`${date.year}年${date.month}月の実施記録`}
                </Typography>
            </Box>

            <Box p={2}>
                <GridList cols={7} spacing={0} cellHeight="auto">
                    {days.map((day, index) => (
                        <div key={index} className={classes.grid}>
                            <li className={classes.calendarElement} key={index}>
                                <div>{day}</div>
                            </li>
                        </div>
                    ))}
                    {createCalendar(date).map((day, index) => {
                        return (
                            <div key={index} className={classes.grid}>
                                <CalendarElement
                                    day={day}
                                    month={getMonth(date)}
                                    studyLog={studyLog}
                                    open={open}
                                    setOpen={setOpen}
                                    setCurrentLogs={setCurrentLogs}
                                />
                            </div>
                        );
                    })}
                </GridList>
                <Dialog
                    open={open}
                    setOpen={setOpen}
                    currentLogs={currentLogs}
                    onDeleteClick={onDeleteClick}
                />
                <Box className={classes.btnContainer} mt={3} mb={1}>
                    <Button
                        startIcon={<NavigateBeforeIcon />}
                        className={classes.button}
                        color="primary"
                        onClick={() => onClickChangeMonthBtn(-1)}
                    >
                        前の月へ
                    </Button>
                    <Button
                        // 表示中の月が当月の場合は非表示にする
                        disabled={
                            isSameMonth(getMonth(date), getMonth(initialDate))
                                ? true
                                : false
                        }
                        className={classes.button}
                        color="primary"
                        onClick={() => onClickChangeMonthBtn(0)}
                    >
                        当月へ戻る
                    </Button>
                    <Button
                        endIcon={<NavigateNextIcon />}
                        className={classes.button}
                        // 表示中の月が当月の場合は非表示にする
                        disabled={
                            isSameMonth(getMonth(date), getMonth(initialDate))
                                ? true
                                : false
                        }
                        color="primary"
                        onClick={() => onClickChangeMonthBtn(1)}
                    >
                        次の月へ
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;
