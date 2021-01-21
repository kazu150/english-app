import React, { FC, useState, useContext } from 'react';
import { MyContext } from './_app';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { regEmail, regPass } from '../utils/validate';
import { auth, db } from '../firebase';

type SignInUser = {
    email: string;
    password: string;
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

const SignIn: FC = () => {
    const classes = useStyles();
    const [signInUser, setSignInUser] = useState<SignInUser>({
        email: '',
        password: '',
    });
    const { state, dispatch } = useContext(MyContext);

    const onSignInButtonClick = async (e) => {
        e.preventDefault();
        if (signInUser.email === '') {
            dispatch({ type: 'errorEmptyMail' });
            return;
        } else if (!regEmail.test(signInUser.email)) {
            dispatch({ type: 'errorInvalidEmail' });
            return;
        } else if (signInUser.password === '') {
            dispatch({ type: 'errorEmptyPassword' });
            return;
        } else if (!regPass.test(signInUser.password)) {
            dispatch({ type: 'errorInvalidPassword' });
            return;
        }

        try {
            const data = await auth.signInWithEmailAndPassword(
                signInUser.email,
                signInUser.password
            );

            const userInfo = await db
                .collection('users')
                .doc(data.user.uid)
                .get();

            const publicUserInfo = await db
                .collection('publicProfiles')
                .doc(data.user.uid)
                .get();

            dispatch({
                type: 'userSignin',
                payload: {
                    userId: data.user.uid,
                    name: data.user.displayName,
                    initialTime: userInfo.data().initialTime,
                    service: userInfo.data().service,
                    studyTime: publicUserInfo.data().studyTime,
                    photoUrl: publicUserInfo.data().photoUrl,
                },
            });

            Router.push(`./${data.user.uid}`);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                dispatch({ type: 'errorUnregisteredPassword' });
                return;
            } else if (error.code === 'auth/wrong-password') {
                dispatch({ type: 'errorUnmatchPassword' });
                return;
            } else {
                dispatch({
                    type: 'errorOther',
                    payload: `エラー内容：${error.message}`,
                });
                return;
            }
        }
    };
    return (
        <>
            <h2>ログイン</h2>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    fullWidth
                    id="standard-basic"
                    label="メールアドレス"
                    error={state.error.errorPart === 'email' ? true : false}
                    value={signInUser.email}
                    onChange={(e) =>
                        setSignInUser({
                            ...signInUser,
                            email: e.target.value,
                        })
                    }
                />
                <TextField
                    fullWidth
                    id="standard-basic"
                    label="パスワード"
                    type="password"
                    error={state.error.errorPart === 'password' ? true : false}
                    value={signInUser.password}
                    onChange={(e) =>
                        setSignInUser({
                            ...signInUser,
                            password: e.target.value,
                        })
                    }
                />
                <Button
                    variant="contained"
                    type="submit"
                    onClick={onSignInButtonClick}
                >
                    ログイン
                </Button>
            </form>
        </>
    );
};

export default SignIn;
