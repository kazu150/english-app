import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import Router from 'next/router';
import { db, auth } from '../firebase';
import Chart from '../components/Chart';
import CalendarBoard from '../components/CalendarBoard';
import dayjs from 'dayjs';
import useGetDataFromDb from '../custom/useGetDataFromDb';

const useStyles = makeStyles((theme) => ({
    registerBtn: {
        marginBottom: '40px',
    },
    flexWrapper: {
        display: 'flex',
    },
    animalImg: {
        width: '30%',
        height: '30%',
        paddingRight: '20px',
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
                                date: dayjs(log.data().date.toDate()),
                            };
                        })
                    );
                }
            } catch (error) {
                // console.log(error);
            }
        })();
        return () => {
            // snapshotに関数が代入されていた場合のみ発火
            snapshot && snapshot();
        };
    }, [state.currentUser.userId]);

    return (
        <>
            {state.currentUser.userId === '' ? (
                ''
            ) : (
                <div>
                    <h2>{state.currentUser.name}さんのマイページ</h2>
                    <Link href="./submit">
                        <Button
                            fullWidth
                            variant="contained"
                            className={classes.registerBtn}
                        >
                            英会話の実施を登録する
                        </Button>
                    </Link>
                    <div className={classes.flexWrapper}>
                        <div className={classes.flexElement}>
                            <div className={classes.flexWrapper}>
                                <img
                                    src="computer_usagi.png"
                                    className={classes.animalImg}
                                />
                                    <p>
                                        トータル英会話時間
                                        <br />
                                        <span
                                            className={classes.totalStudyHour}
                                        >
                                            {totalStudyTime}
                                        </span>
                                        分
                                    </p>
                            </div>
                                    <p>
                                        今月の英会話時間：
                                        <span
                                            className={classes.monthlyStudyHour}
                                        >
                                            300
                                        </span>
                                        分
                                    </p>
                            <Chart
                                nationalities={nationalities}
                                studyLog={studyLog}
                            />
                        </div>
                        <div className={classes.flexElement}>
                            <CalendarBoard studyLog={studyLog} />
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
