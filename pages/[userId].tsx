import React, { FC, useContext, useEffect, useState } from 'react';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Router from 'next/router';
import { db } from '../firebase';

const MyPage: FC = () => {
    const { dispatch, state } = useContext(MyContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [totalStudyTime, setTotalStudyTime] = useState(0);

    useEffect(() => {
        // TODO この部分で、ログインユーザ判定し、falseの場合は弾いてログインページへ
        const f = async () => {
            if (!state.currentUser.userId) {
                Router.push('/');
                dispatch({ type: 'user_signout' });
                return;
            }

            const docRef = await db
                .collection('users')
                .doc(state.currentUser.userId)
                .get();
            if (!docRef.exists) {
                Router.push('/');
                dispatch({ type: 'user_signout' });
                return;
            } else {
                setIsLoggedIn(true);
            }
        };
        f();
    });

    useEffect(() => {
        const getTotalStudyTime = async () => {
            if (!state.currentUser.userId) {
                return;
            }

            const snapshot = await db
                .collection('users')
                .doc(state.currentUser.userId)
                .collection('studyLog')
                .get();

            const sum = snapshot.docs
                .map((doc) => {
                    return doc.data().time;
                })
                .filter((time) => time) //仮に時間の記録がないdocがあったとき用のfilter
                .reduce((prev, current) => {
                    return prev + current;
                }, 0);
            // TODO ↑ここで、無駄にPOST通信走らせてる？計算をDBでやって結果だけ抽出する方が良いのかな

            setTotalStudyTime(sum);
        };
        getTotalStudyTime();
    });

    return (
        <>
            {!isLoggedIn ? (
                ''
            ) : (
                <div>
                    <h2>{state.currentUser.userName}さんのマイページ</h2>
                    <p>（今後作成）今週の英会話時間: X分</p>
                    <p>（今後作成）全ユーザーの第XX位/Y人！</p>
                    <p>（今後作成）今月の英会話時間: XX分</p>
                    <p>（今後作成）全ユーザーの第X位/Y人！</p>
                    <p>Total英会話時間: {totalStudyTime}分</p>
                    {/*<p>
                        全ユーザーの第
                        {
                            state.users.filter(
                                (user) =>
                                    user.initialTime +
                                        user.userLog
                                            .map(
                                                (log) =>
                                                    log.count *
                                                    state.services.filter(
                                                        (service) =>
                                                            service.name ===
                                                            log.service
                                                    )[0].timePerLesson
                                            )
                                            .reduce(
                                                (sum, currentValue) =>
                                                    sum + currentValue
                                            ) -
                                        user.initialTime -
                                        state.currentUser.userLog
                                            .map(
                                                (log) =>
                                                    log.count *
                                                    state.services.filter(
                                                        (service) =>
                                                            service.name ===
                                                            log.service
                                                    )[0].timePerLesson
                                            )
                                            .reduce(
                                                (sum, currentValue) =>
                                                    sum + currentValue
                                            ) >
                                    0
                            ).length
                        }
                        位/{state.users.length}人！
                    </p> */}
                    <br />
                    <p>（今後作成）総合 第X位！</p>
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
