import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Link from 'next/link';
import Router from 'next/router';
import { db, auth } from '../firebase';
import Chart from '../components/Chart';
import CalendarBoard from '../components/CalendarBoard';
import dayjs from 'dayjs';
import useGetDataFromDb from '../custom/useGetDataFromDb';

const useStyles = makeStyles((theme) => ({
    pageTitle: {
        display: 'inline-block',
        marginLeft: '10px',
        marginTop: 0,
        verticalAlign: '9px',
    },
    registerBtn: {
        marginBottom: '40px',
    },
    balloon: {
        position: 'relative',
        padding: '18px',
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        marginBottom: '2em',
        '&::before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            width: 0,
            height: 0,
            left: '20px',
            bottom: '-15px',
            borderTop: '15px solid #b3e5fc',
            borderRight: '15px solid transparent',
            borderLeft: '15px solid transparent',
        },
    },
    flexWrapper: {
        display: 'flex',
    },
    animalImg: {
        width: '30%',
        height: '30%',
        paddingRight: '20px',
        transform: 'scale(-1, 1)',
    },
    levelDescription: {
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        textAlign: 'center',
    },
    levelIcon: {
        display: 'block',
        fontSize: '40px',
    },
    totalStudyHour: {
        fontSize: '45px',
        fontWeight: 'bold',
    },
    monthlyStudyHour: {
        fontSize: '25px',
        fontWeight: 'bold',
    },
    flexElement: {
        flex: 1,
    },
}));

const MyPage: NextPage = () => {
    const { dispatch, state } = useContext(MyContext);
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [studyLog, setStudyLog] = useState([]);
    const [currentLogs, setCurrentLogs] = useState([]);
    const [open, setOpen] = useState(false);
    // const [nationalities, setNationalities] = useState([]);
    const nationalities = useGetDataFromDb('nationalities');
    const classes = useStyles();

    useEffect(() => {
        let snapshot = null;
        (async () => {
            try {
                if (state.currentUser.userId !== '') {
                    snapshot = db
                        .collection('publicProfiles')
                        .doc(state.currentUser.userId)
                        .onSnapshot((snapshot) => {
                            setTotalStudyTime(snapshot.data().studyTime);
                        });

                    const studyLogs = await db
                        .collection('users')
                        .doc(state.currentUser.userId)
                        .collection('studyLog')
                        .get();

                    setStudyLog(
                        studyLogs.docs.map((log) => {
                            return {
                                ...log.data(),
                                id: log.id,
                                date: dayjs(log.data().date.toDate()),
                            };
                        })
                    );
                }
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            // snapshotに関数が代入されていた場合のみ発火
            snapshot && snapshot();
        };
    }, [state.currentUser.userId]);

    const onDeleteClick = async (id) => {
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
            {state.currentUser.userId === '' ? (
                ''
            ) : (
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
                    <div className={classes.flexWrapper}>
                        <Box mr={3} className={classes.flexElement}>
                            <div className={classes.balloon}>
                                このペースでがんばろう！
                            </div>
                            <div className={classes.flexWrapper}>
                                <img
                                    src="computer_usagi.png"
                                    className={classes.animalImg}
                                />
                                <p>
                                    トータル英会話時間
                                    <br />
                                    <span className={classes.totalStudyHour}>
                                        {totalStudyTime}
                                    </span>
                                    分
                                </p>
                            </div>
                            <p>
                                今月の英会話時間：
                                <span className={classes.monthlyStudyHour}>
                                    300
                                </span>
                                分
                            </p>
                            <Box
                                className={classes.levelDescription}
                                p={2}
                                mb={3}
                            >
                                <span className={classes.levelIcon}>🐹</span>
                                あなたは<b>ハムスター</b>レベル！
                                <br />
                                次のレベルまであと<b>300</b>分
                            </Box>
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
                    {/* <p>（今後作成したい）今週の英会話時間: X分</p>
                    <p>（今後作成したい）全ユーザーの第XX位/Y人！</p>
                    <p>（今後作成したい）今月の英会話時間: XX分</p>
                    <p>（今後作成したい）全ユーザーの第X位/Y人！</p>
                    <p>（今後作成したい）総合 第X位！</p> */}
                </div>
            )}
        </>
    );
};

export default MyPage;
