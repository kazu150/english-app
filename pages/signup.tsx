import React, { FC, useState, useContext } from 'react';
import Router from 'next/router';
import { MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { regEmail, regPass } from '../utils/validate';

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

    const onSignUpSubmit = () => {
        if (signUpUser.email === '') {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'email',
                    message: 'メールアドレスが未入力です',
                },
            });
            return;
        } else if (signUpUser.password === '') {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'password',
                    message: 'パスワードが未入力です',
                },
            });
            return;
        } else if (signUpUser.password !== signUpUser.passwordConfirm) {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'passwordConfirm',
                    message: 'パスワードが一致しません',
                },
            });
            return;
        } else if (!regEmail.test(signUpUser.email)) {
            dispatch({
                type: 'error_show',
                payload: {
                    errorPart: 'email',
                    message: '有効なメールアドレスを入力してください',
                },
            });
            return;
        } else if (!regPass.test(signUpUser.password)) {
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

        dispatch({ type: 'user_signup', payload: signUpUser });
        Router.push('/register');
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
