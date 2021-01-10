import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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
    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField fullWidth id="standard-basic" label="メールアドレス" />
            <TextField
                fullWidth
                id="standard-basic"
                label="パスワード"
                type="password"
            />
            <Button variant="contained">ログイン</Button>
        </form>
    );
};

export default SignIn;
