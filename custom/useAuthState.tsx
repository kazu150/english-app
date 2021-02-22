import React, { useEffect, useContext } from 'react';
import { db, auth } from '../firebase';
import { MyContext } from '../pages/_app';
import Router from 'next/router';

const useAuthState = () => {
    const { state, dispatch } = useContext(MyContext);

    useEffect(() => {
        let userInfo = null;
        let publicUserInfo = null;

        // ユーザーのログイン状態を監視
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            try {
                // ユーザーが検出されたら、signInの処理
                if (user) {
                    userInfo = await db.collection('users').doc(user.uid).get();

                    publicUserInfo = await db
                        .collection('publicProfiles')
                        .doc(user.uid)
                        .get();

                    dispatch({
                        type: 'userSignin',
                        payload: {
                            userId: user.uid,
                            name: user.displayName,
                            initialTime: userInfo.data()?.initialTime || '',
                            englishService:
                                userInfo.data().englishService?.id || '',
                            studyTime: publicUserInfo.data()?.studyTime || '',
                            photoUrl: publicUserInfo.data()?.photoUrl || '',
                        },
                    });
                    // ユーザーが検出されなかったら、signOutの処理
                } else {
                    await auth.signOut();
                    dispatch({ type: 'userSignout' });
                    Router.push('/');
                    return;
                }
            } catch (error) {
                dispatch({
                    type: 'errorOther',
                    payload: {},
                });
                return;
            }
        });
        return () => {
            userInfo && userInfo;
            publicUserInfo && publicUserInfo;
            unsubscribe();
        };
    }, []);

    return [];
};

export default useAuthState;
