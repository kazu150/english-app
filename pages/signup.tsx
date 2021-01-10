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

const SignUp: FC = () => {
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
            <TextField
                fullWidth
                id="standard-basic"
                label="パスワード(確認用)"
                type="password"
            />
            <Button variant="contained">会員登録</Button>
        </form>
    );
};

export default SignUp;
