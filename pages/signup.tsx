import React, { FC, useState, useContext } from 'react';
import { MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

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
    const { dispatch } = useContext(MyContext);

    const classes = useStyles();
    const [signUpUser, setSignUpUser] = useState({
        mail: '',
        password: '',
        passwordConfirm: '',
    });

    const onSignUpSubmit = () => {
        dispatch({ type: 'user_signup', payload: signUpUser });
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                fullWidth
                id="standard-basic"
                label="メールアドレス"
                value={signUpUser.mail}
                onChange={(e) =>
                    setSignUpUser({
                        ...signUpUser,
                        mail: e.target.value,
                    })
                }
            />
            <TextField
                fullWidth
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
            <Link href="./">
                <Button onClick={onSignUpSubmit} variant="contained">
                    会員登録
                </Button>
            </Link>
        </form>
    );
};

export default SignUp;
