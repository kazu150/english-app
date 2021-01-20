import React, { FC, useContext, useState, useEffect } from 'react';
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

const Settings: FC = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [settingsData, setSettingsData] = useState({
        userName: '',
        initialTime: '0',
        service: 'DMM英会話',
        userLog: [
            {
                date: 20200101,
                nationality: 'US',
                count: 1,
                service: 'DMM英会話',
            },
        ],
    });

    useEffect(() => {
        // ログインユーザ判定し、falseの場合は弾いてログインページへ
        if (!state.currentUser.userId) {
            Router.push('/');
            dispatch({ type: 'userSignout' });
            return;
        }

        const checkLogInStatus = auth.onAuthStateChanged((user) => {
            if (user.uid !== state.currentUser.userId) {
                Router.push('/');
                dispatch({ type: 'userSignout' });
            } else {
                setIsLoggedIn(true);
            }
        });

        return () => {
            checkLogInStatus();
        };
    });

    const onSubmitButtonClick = async () => {
        if (settingsData.userName === '') {
            dispatch({ type: 'errorEmptyUserName' });
            return;
        } else if (
            Number(settingsData.initialTime) < 0 ||
            isNaN(Number(settingsData.initialTime))
        ) {
            dispatch({ type: 'errorInvalidInitialTime' });
            return;
        }

        try {
            const batch = firebase.firestore().batch();

            batch.update(db.doc(`users/${state.currentUser.userId}`), {
                service: settingsData.service,
                initialTime: settingsData.initialTime,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            batch.update(db.doc(`publicProfiles/${state.currentUser.userId}`), {
                name: settingsData.userName,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            dispatch({
                type: 'userUpdate',
                payload: {
                    service: settingsData.service,
                    initialTime: settingsData.initialTime,
                    name: settingsData.userName,
                },
            });

            Router.push(`/${state.currentUser.userId}`);
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
                <form className={classes.root} noValidate autoComplete="off">
                    <TextField
                        fullWidth
                        id="userName"
                        label="ユーザー名"
                        error={
                            state.error.errorPart === 'userName' ? true : false
                        }
                        value={settingsData.userName}
                        onChange={(e) =>
                            setSettingsData({
                                ...settingsData,
                                userName: e.target.value,
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
                            aria-label="service"
                            name="service"
                            value={settingsData.service}
                            onChange={(e) =>
                                setSettingsData({
                                    ...settingsData,
                                    service: e.target.value,
                                })
                            }
                        >
                            <FormControlLabel
                                value="DMM英会話"
                                control={<Radio />}
                                label="DMM英会話"
                            />
                            <FormControlLabel
                                value="レアジョブ"
                                control={<Radio />}
                                label="レアジョブ"
                            />
                            <FormControlLabel
                                value="ネイティブキャンプ"
                                control={<Radio />}
                                label="ネイティブキャンプ"
                            />
                        </RadioGroup>
                    </div>
                    <Button variant="contained" onClick={onSubmitButtonClick}>
                        送信
                    </Button>
                </form>
            )}
        </>
    );
};

export default Settings;
