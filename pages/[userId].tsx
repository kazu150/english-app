import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { db } from '../firebase';
import Chart from '../components/organisms/Chart';
import CalendarBoard from '../components/molecules/CalendarBoard';
import StudyStatistics from '../components/molecules/StudyStatistics';
import Level from '../components/molecules/Level';
import useGetCollectionFromDb, {
    EnglishServices,
    Nationalities,
} from '../hooks/useGetCollectionFromDb';
import useFetchStudyLog from '../hooks/useFetchStudyLog';
import dayjs from 'dayjs';

export type Log = {
    id?: string;
    date?: dayjs.Dayjs;
    count?: number;
    englishService?: EnglishServices;
    nationality?: Nationalities;
    time?: number;
};

const useStyles = makeStyles((theme: Theme) => ({
    pageTitle: {
        display: 'inline-block',
        marginLeft: '10px',
        marginTop: 0,
        verticalAlign: '9px',
    },
    registerBtn: {
        marginBottom: '40px',
    },
    mainFlexWrapper: {
        display: 'flex',
        [theme.breakpoints.down(800)]: {
            flexWrap: 'wrap',
        },
    },
    flexElement: {
        flex: 1,
        [theme.breakpoints.down(800)]: {
            width: '100%',
            flex: 'none',
        },
    },
}));

const MyPage: NextPage = () => {
    const router = useRouter();
    const { state } = useContext(MyContext);
    const [currentLogs, setCurrentLogs] = useState<Log[]>([]);
    const [open, setOpen] = useState(false);
    const nationalities = useGetCollectionFromDb<Nationalities>(
        'nationalities'
    );
    const classes = useStyles();
    const { studyLog, setStudyLog, totalStudyTime } = useFetchStudyLog(
        state.currentUser.userId
    );

    const onDeleteClick = async (id: string) => {
        try {
            await db
                .collection('users')
                .doc(state.currentUser.userId)
                .collection('studyLog')
                .doc(id)
                .delete();

            const newStudyLog = studyLog.filter((log) => {
                return log.id !== id;
            });
            setStudyLog(newStudyLog);

            const newCurrentLogs = currentLogs.filter((log) => {
                return log.id !== id;
            });
            setCurrentLogs(newCurrentLogs);
            !newCurrentLogs.length && setOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {state.currentUser.userId !== '' && (
                <div>
                    <div>
                        <AccountCircleIcon fontSize="large" color="primary" />
                        <h2 className={classes.pageTitle}>
                            {state.currentUser.name}さんのマイページ
                        </h2>
                    </div>
                    <Link href="./submit">
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.registerBtn}
                        >
                            英会話の実施を登録する
                        </Button>
                    </Link>
                    <div className={classes.mainFlexWrapper}>
                        <Box mr={3} className={classes.flexElement}>
                            <StudyStatistics totalStudyTime={totalStudyTime} />
                            <Level totalStudyTime={totalStudyTime} />
                            <Chart
                                nationalities={nationalities}
                                studyLog={studyLog}
                            />
                        </Box>
                        <div className={classes.flexElement}>
                            <CalendarBoard
                                open={open}
                                setOpen={setOpen}
                                currentLogs={currentLogs}
                                setCurrentLogs={setCurrentLogs}
                                onDeleteClick={onDeleteClick}
                                studyLog={studyLog}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyPage;
