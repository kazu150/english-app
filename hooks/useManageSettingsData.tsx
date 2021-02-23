import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import firebase from 'firebase/app';
import Router from 'next/router';

type SettingsData = {
    name: string;
    initialTime: string;
    englishService: string;
};

const useManageSettingsData = (currentUser, dispatch) => {
    const [settingsData, setSettingsData] = useState<SettingsData>({
        name: '',
        initialTime: '0',
        englishService: 'dmm',
    });

    useEffect(() => {
        setSettingsData({
            name: currentUser.name,
            initialTime: currentUser.initialTime.toString(),
            englishService: currentUser.englishService,
        });
    }, [currentUser]);

    // Submitしたときの処理
    const onSubmitButtonClick = async () => {
        // フロント側バリデーション
        if (settingsData.name === '') {
            dispatch({ type: 'errorEmptyname' });
            return;
        } else if (
            Number(settingsData.initialTime) < 0 ||
            isNaN(Number(settingsData.initialTime))
        ) {
            dispatch({ type: 'errorInvalidInitialTime' });
            return;
        }

        try {
            // Firebase Authentication側のdisplayNameを上書き
            if (auth.currentUser.displayName !== settingsData.name) {
                auth.currentUser.updateProfile({
                    displayName: settingsData.name,
                });
            }

            // Firestore側のユーザー情報のアップデート
            const batch = firebase.firestore().batch();

            batch.update(db.doc(`users/${currentUser.userId}`), {
                englishService: db.doc(
                    `englishServices/${settingsData.englishService}`
                ),
                initialTime: Number(settingsData.initialTime),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            batch.update(db.doc(`publicProfiles/${currentUser.userId}`), {
                name: settingsData.name,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            dispatch({
                type: 'userUpdate',
                payload: {
                    englishService: settingsData.englishService,
                    initialTime: settingsData.initialTime,
                    name: settingsData.name,
                },
            });

            Router.push(`/${currentUser.userId}`);
            return;
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message} [on settings]`,
            });
            return;
        }
    };
    return { settingsData, setSettingsData, onSubmitButtonClick };
};

export default useManageSettingsData;
