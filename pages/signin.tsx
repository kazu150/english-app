import React, { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { MyContext } from './_app';
import Router from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { regEmail, regPass } from '../utils/validate';
import { auth, db } from '../firebase';
import firebase from 'firebase/app';

type SignInUser = {
    email: string;
    password: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    narrowWidthWrapper: {
        width: '500px',
        margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            width: 'auto',
        },
    },
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

const SignIn: NextPage = () => {
    const classes = useStyles();
    const [signInUser, setSignInUser] = useState<SignInUser>({
        email: '',
        password: '',
    });
    const { state, dispatch } = useContext(MyContext);

    useEffect(() => {
        // ログインユーザ判定し、trueの場合はマイページへ
        if (state.currentUser.userId !== '') {
            Router.push(`/${state.currentUser.userId}`);
        }
        return () => {};
    }, [state.currentUser.userId]);

    const onSignInButtonClick = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
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
            // ユーザーのログイン状態をどれだけ継続するか（LOCALの場合、ブラウザを閉じても情報が保持される）
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
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
                    englishService: userInfo.data().englishService.id,
                    studyTime: publicUserInfo.data().studyTime,
                    photoUrl: publicUserInfo.data().photoUrl,
                },
            });

            Router.push(`./${data.user.uid}`);
            return;
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
                    payload: `エラー内容：${error.message} [on signin]`,
                });
                return;
            }
        }
    };

    return (
        <main className={classes.narrowWidthWrapper}>
            <h2>ログイン</h2>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    fullWidth
                    id="email"
                    label="メールアドレス"
                    error={state.error.errorPart === 'email' ? true : false}
                    value={signInUser.email}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setSignInUser({
                            ...signInUser,
                            email: e.target.value,
                        })
                    }
                />
                <TextField
                    fullWidth
                    id="password"
                    label="パスワード"
                    type="password"
                    autoComplete="off"
                    error={state.error.errorPart === 'password' ? true : false}
                    value={signInUser.password}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
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
        </main>
    );
};

export default SignIn;
