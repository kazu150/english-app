import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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

const Register: FC = () => {
    const classes = useStyles();
    const [value, setValue] = React.useState('female');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField fullWidth id="standard-basic" label="ユーザー名" />
            <TextField
                fullWidth
                id="standard-basic"
                label="これまでの総会話時間"
            />
            <div>
                <FormLabel component="legend">利用サービス</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={value}
                    onChange={handleChange}
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
            <Button variant="contained">送信</Button>
        </form>
    );
};

export default Register;
