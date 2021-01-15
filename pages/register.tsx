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
import { db } from '../firebase';
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

const Register: FC = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [registerData, setRegisterData] = useState({
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

    const onSubmitButtonClick = async () => {
        if (registerData.userName === '') {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'userName',
                    message: 'ユーザー名を入力してください',
                },
            });
            return;
        } else if (
            Number(registerData.initialTime) < 0 ||
            isNaN(Number(registerData.initialTime))
        ) {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'initialTime',
                    message: '正しい学習時間を入力してください',
                },
            });
            return;
        }

        db.collection('users')
            .doc(state.currentUser.userId)
            .update({
                ...registerData,
                initialTime: Number(registerData.initialTime),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((docRef) => {
                dispatch({
                    type: 'user_update',
                    payload: {
                        ...registerData,
                        initialTime: Number(registerData.initialTime),
                    },
                });

                Router.push(`/${state.currentUser.userId}`);
            })
            .catch((error) => {
                dispatch({
                    type: 'error_show',
                    payload: {
                        message: 'すみません…何らかのエラーが発生しました><',
                    },
                });
                return;
            });
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
                        value={registerData.userName}
                        onChange={(e) =>
                            setRegisterData({
                                ...registerData,
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
                        value={registerData.initialTime}
                        onChange={(e) =>
                            setRegisterData({
                                ...registerData,
                                initialTime: e.target.value,
                            })
                        }
                    />
                    <div>
                        <FormLabel>利用サービス</FormLabel>
                        <RadioGroup
                            aria-label="service"
                            name="service"
                            value={registerData.service}
                            onChange={(e) =>
                                setRegisterData({
                                    ...registerData,
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

export default Register;
