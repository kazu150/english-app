import React, { useContext, useState, useEffect } from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import { User, MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { db, auth } from '../firebase';
import firebase from 'firebase/app';

type SettingsData = {
    name: string;
    initialTime: string;
    englishService: string;
};

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            marginLeft: 0,
            marginBottom: '30px',
            width: '100%',
            display: 'block',
        },
    },
}));

const Settings: NextPage = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [settingsData, setSettingsData] = useState<SettingsData>({
        name: '',
        initialTime: '0',
        englishService: 'dmm',
    });

    useEffect(() => {
        // ログインユーザ判定し、falseの場合は弾いてログインページへ
        if (!state.currentUser.userId) {
            Router.push('/');
            auth.signOut()
                .then(() => {
                    dispatch({ type: 'userSignout' });
                    return;
                })
                .catch((error) => {
                    dispatch({
                        type: 'errorOther',
                        payload: `エラー内容：${error.message}`,
                    });
                    return;
                });
            return;
        }

        const checkLogInStatus = auth.onAuthStateChanged((user) => {
            if (user.uid !== state.currentUser.userId) {
                Router.push('/');
                auth.signOut()
                    .then(() => {
                        dispatch({ type: 'userSignout' });
                        return;
                    })
                    .catch((error) => {
                        dispatch({
                            type: 'errorOther',
                            payload: `エラー内容：${error.message}`,
                        });
                        return;
                    });
            } else {
                setIsLoggedIn(true);
            }
        });

        return () => {
            checkLogInStatus();
        };
    });

    const onSubmitButtonClick = async () => {
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
            auth.currentUser.updateProfile({
                displayName: settingsData.name,
            });

            const batch = firebase.firestore().batch();

            batch.update(db.doc(`users/${state.currentUser.userId}`), {
                englishService: db.doc(
                    `englishServices/${settingsData.englishService}`
                ),
                initialTime: Number(settingsData.initialTime),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            batch.update(db.doc(`publicProfiles/${state.currentUser.userId}`), {
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

            Router.push(`/${state.currentUser.userId}`);
            return;
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message}`,
            });
            return;
        }
    };

    return (
        <>
            {!isLoggedIn ? (
                ''
            ) : (
                <>
                    <h2>ユーザー情報設定</h2>
                    <form
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            fullWidth
                            id="name"
                            label="ユーザー名"
                            error={
                                state.error.errorPart === 'name' ? true : false
                            }
                            value={settingsData.name}
                            onChange={(e) =>
                                setSettingsData({
                                    ...settingsData,
                                    name: e.target.value,
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            id="initialTime"
                            label="これまでの総会話時間（分）"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        分
                                    </InputAdornment>
                                ),
                            }}
                            error={
                                state.error.errorPart === 'initialTime'
                                    ? true
                                    : false
                            }
                            value={settingsData.initialTime}
                            onChange={(e) =>
                                setSettingsData({
                                    ...settingsData,
                                    initialTime: e.target.value,
                                })
                            }
                        />
                        <div>
                            <FormLabel>利用サービス</FormLabel>
                            <RadioGroup
                                aria-label="englishService"
                                name="englishService"
                                value={settingsData.englishService}
                                onChange={(e) =>
                                    setSettingsData({
                                        ...settingsData,
                                        englishService: e.target.value,
                                    })
                                }
                            >
                                <FormControlLabel
                                    value="dmm"
                                    control={<Radio />}
                                    label="DMM英会話"
                                />
                                <FormControlLabel
                                    value="rarejob"
                                    control={<Radio />}
                                    label="レアジョブ"
                                />
                                <FormControlLabel
                                    value="nativeCamp"
                                    control={<Radio />}
                                    label="ネイティブキャンプ"
                                />
                                <FormControlLabel
                                    value="cambly"
                                    control={<Radio />}
                                    label="キャンブリー"
                                />
                            </RadioGroup>
                        </div>
                        <Button
                            variant="contained"
                            onClick={onSubmitButtonClick}
                        >
                            送信
                        </Button>
                    </form>
                </>
            )}
        </>
    );
};

export default Settings;
