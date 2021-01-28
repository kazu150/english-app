import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Router from 'next/router';
import { db, auth } from '../firebase';
import CalendarBoard from '../components/CalendarBoard';
import dayjs from 'dayjs';
import { SignalCellularNullTwoTone, Unsubscribe } from '@material-ui/icons';

const MyPage: NextPage = () => {
    const { dispatch, state } = useContext(MyContext);
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [studyLog, setStudyLog] = useState([]);

    useEffect(() => {
        // ログインユーザ判定し、falseの場合はログインページへ
        let showStudyTime = null;
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                console.log('!user');
                Router.push('/');
            } else {
                console.log('user');
                // 常に最新のstudyTimeを表示
                showStudyTime = db
                    .collection('publicProfiles')
                    .doc(user.uid)
                    .onSnapshot((snapshot) => {
                        setTotalStudyTime(snapshot.data().studyTime);
                    });
            }
        });
        return () => {
            console.log('unsubs');
            // unsubscribeにonSnapshot関数が代入されていた場合のみ発火
            showStudyTime();
            setTotalStudyTime(0);
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        let studyLogs = null;
        (async () => {
            try {
                if (state.currentUser.userId !== '') {
                    studyLogs = await db
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
                console.log(error);
            }
        })();
        return () => {
            // studyLogsに関数が代入されていた場合のみ発火
            studyLogs && studyLogs;
            setStudyLog([]);
        };
    }, [state.currentUser.userId]);

    return (
        <>
            {!state.currentUser.userId ? (
                ''
            ) : (
                <div>
                    <h2>{state.currentUser.name}さんのマイページ</h2>
                    {/* <p>（今後作成）今週の英会話時間: X分</p>
                    <p>（今後作成）全ユーザーの第XX位/Y人！</p>
                    <p>（今後作成）今月の英会話時間: XX分</p>
                    <p>（今後作成）全ユーザーの第X位/Y人！</p> */}
                    <p>Total英会話時間: {totalStudyTime}分</p>
                    <CalendarBoard studyLog={studyLog} />
                    <br />
                    {/* <p>（今後作成）総合 第X位！</p> */}
                    <Link href="./submit">
                        <Button fullWidth variant="contained">
                            英会話の実施を登録する
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
};

export default MyPage;
