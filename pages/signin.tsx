import React, { FC, useState, useContext } from 'react';
import { MyContext } from './_app';
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { regEmail, regPass } from '../utils/validate';
import { db } from '../firebase';

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
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'email',
                    message: 'メールアドレスが未入力です',
                },
            });
            return;
        } else if (!regEmail.test(signInUser.email)) {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'email',
                    message: '有効なメールアドレスを入力してください',
                },
            });
            return;
        } else if (signInUser.password === '') {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'password',
                    message: 'パスワードが未入力です',
                },
            });
            return;
        } else if (!regPass.test(signInUser.password)) {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'password',
                    message:
                        'パスワードは半角英数字の組み合わせ8-15文字で入力してください',
                },
            });
            return;
        }

        try {
            const userRef = await db
                .collection('users')
                .where('email', '==', signInUser.email)
                .get();

            if (!userRef.docs.length) {
                dispatch({
                    type: 'error_show',
                    payload: {
                        errorPart: 'email',
                        message: 'このメールアドレスは登録されていません',
                    },
                });
                return;
            } else if (
                signInUser.password !== userRef.docs[0].data().password
            ) {
                dispatch({
                    type: 'error_show',
                    payload: {
                        errorPart: 'password',
                        message: 'パスワードが一致しません',
                    },
                });
                return;
            }

            dispatch({
                type: 'user_signin',
                payload: {
                    ...userRef.docs[0].data(),
                    userId: userRef.docs[0].id,
                },
            });
            Router.push(`./${userRef.docs[0].id}`);
        } catch (error) {
            // TODO デバグ用
            console.log(error);
            dispatch({
                type: 'error_show',
                payload: {
                    message: 'すみません…何らかのエラーが発生しました><',
                },
            });
            return;
        }
    };
    return (
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
    );
};

export default SignIn;
