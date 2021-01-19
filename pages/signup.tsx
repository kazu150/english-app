import React, { FC, useState, useContext } from 'react';
import Router from 'next/router';
import { MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { regEmail, regPass } from '../utils/validate';
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

const SignUp: FC = () => {
    const { dispatch, state } = useContext(MyContext);

    const classes = useStyles();
    const [signUpUser, setSignUpUser] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const onSignUpSubmit = async () => {
        if (signUpUser.email === '') {
            dispatch({ type: 'errorEmptyMail' });
            return;
        } else if (signUpUser.password === '') {
            dispatch({ type: 'errorEmptyPassword' });
            return;
        } else if (signUpUser.password !== signUpUser.passwordConfirm) {
            dispatch({ type: 'errorUnmatchPassword' });
            return;
        } else if (!regEmail.test(signUpUser.email)) {
            dispatch({ type: 'errorInvalidEmail' });
            return;
        } else if (!regPass.test(signUpUser.password)) {
            dispatch({ type: 'errorInvalidPassword' });
            return;
        }

        try {
            const data = await auth.createUserWithEmailAndPassword(
                signUpUser.email,
                signUpUser.password
            );

            const batch = firebase.firestore().batch();

            batch.set(db.doc(`users/${data.user.uid}`), {
                service: null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            batch.set(
                db.doc(`users/${data.user.uid}`).collection('studyLog').doc(),
                {
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    nationality: null,
                    count: null,
                    service: null,
                }
            );

            batch.set(db.doc(`publicProfiles/${data.user.uid}`), {
                name: null,
                photoUrl: null,
                studyTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            await batch.commit();

            dispatch({
                type: 'userSignup',
                payload: {
                    email: signUpUser.email,
                    userId: data.user.uid,
                },
            });

            Router.push('/settings');
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message}`,
            });
            return;
        }
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                fullWidth
                error={state.error.errorPart === 'email' ? true : false}
                id="email"
                label="メールアドレス"
                value={signUpUser.email}
                onChange={(e) =>
                    setSignUpUser({
                        ...signUpUser,
                        email: e.target.value,
                    })
                }
            />
            <TextField
                fullWidth
                error={state.error.errorPart === 'password' ? true : false}
                id="standard-basic"
                label="パスワード"
                type="password"
                value={signUpUser.password}
                onChange={(e) =>
                    setSignUpUser({
                        ...signUpUser,
                        password: e.target.value,
                    })
                }
            />
            <TextField
                fullWidth
                error={
                    state.error.errorPart === 'passwordConfirm' ? true : false
                }
                id="standard-basic"
                label="パスワード(確認用)"
                type="password"
                value={signUpUser.passwordConfirm}
                onChange={(e) =>
                    setSignUpUser({
                        ...signUpUser,
                        passwordConfirm: e.target.value,
                    })
                }
            />
            <Button onClick={onSignUpSubmit} variant="contained">
                会員登録
            </Button>
        </form>
    );
};

export default SignUp;
