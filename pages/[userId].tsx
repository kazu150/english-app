import React, { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Router from 'next/router';
import { db, auth } from '../firebase';

const MyPage: NextPage = () => {
    const { dispatch, state } = useContext(MyContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [totalStudyTime, setTotalStudyTime] = useState(0);

    useEffect(() => {
        //     // ログインユーザ判定し、falseの場合は弾いてログインページへ
        //     if (!state.currentUser.userId) {
        //         Router.push('/');
        //         auth.signOut()
        //             .then(() => {
        //                 dispatch({ type: 'userSignout' });
        //                 return;
        //             })
        //             .catch((error) => {
        //                 dispatch({
        //                     type: 'errorOther',
        //                     payload: `エラー内容：${error.message}`,
        //                 });
        //                 return;
        //             });
        //     } else {
        //         auth.onAuthStateChanged((user) => {
        //             if (user.uid !== state.currentUser.userId) {
        //                 Router.push('/');
        //                 auth.signOut()
        //                     .then(() => {
        //                         dispatch({ type: 'userSignout' });
        //                         return;
        //                     })
        //                     .catch((error) => {
        //                         dispatch({
        //                             type: 'errorOther',
        //                             payload: `[userid]エラー内容：${error.message}`,
        //                         });
        //                         return;
        //                     });
        //             } else {
        //                 setIsLoggedIn(true);
        //             }
        //         });

        // studyTimeを表示
        state.currentUser.userId &&
            db
                .collection('publicProfiles')
                .doc(state.currentUser.userId)
                .onSnapshot((snapshot) => {
                    setTotalStudyTime(snapshot.data().studyTime);
                });
    });

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
