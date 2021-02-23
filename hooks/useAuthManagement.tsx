import { useEffect } from 'react';
import { db, auth } from '../firebase';
import Router from 'next/router';

const useCheckAuthState = (dispatch) => {
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
                    payload: '認証関係でエラーが発生しました',
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

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch({ type: 'userSignout' });
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message} [on App 2]`,
            });
            return;
        }
    };

    return handleLogout;
};

export default useCheckAuthState;
