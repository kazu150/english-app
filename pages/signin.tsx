import React, { FC, useState, useContext } from 'react';
import { MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    const { dispatch } = useContext(MyContext);

    const onSignInButtonClick = (e) => {
        e.preventDefault();
        console.log(signInUser);
        dispatch({
            type: 'user_signin',
            payload: signInUser,
        });
    };
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                fullWidth
                id="standard-basic"
                label="メールアドレス"
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
