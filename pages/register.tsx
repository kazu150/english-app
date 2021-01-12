import React, { FC, useContext, useState } from 'react';
import { MyContext } from './_app';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

type RegisterData = {
    userName: string;
    initialTime: any;
    service: string;
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

const Register: FC = () => {
    const classes = useStyles();
    const [registerData, setRegisterData] = useState<RegisterData>({
        userName: '',
        initialTime: 0,
        service: null,
    });
    const { dispatch } = useContext(MyContext);

    const onSubmitButtonClick = () => {
        dispatch({
            type: 'user_signup',
            payload: registerData,
        });
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                fullWidth
                id="userName"
                label="ユーザー名"
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
                label="これまでの総会話時間"
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
    );
};

export default Register;
