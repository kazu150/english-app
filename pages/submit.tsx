import React, { FC, useState, useContext } from 'react';
import { MyContext } from './_app';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: '15px',
    },
}));

const Submit = () => {
    const { dispatch } = useContext(MyContext);
    const classes = useStyles();
    const [result, setResult] = useState({
        service: '',
        count: '',
        nationality: '',
    });

    const onResultSubmit = () => {
        dispatch({
            type: 'study_register',
            payload: result,
        });
    };
    return (
        <div>
            <h2>英会話をやりました！</h2>
            <InputLabel id="demo-simple-select-label">利用サービス</InputLabel>
            <Select
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={result.service}
            >
                <MenuItem value={10}>DMM英会話</MenuItem>
                <MenuItem value={20}>レアジョブ</MenuItem>
                <MenuItem value={30}>ネイティブキャンプ</MenuItem>
            </Select>
            <p>一回の英会話時間：２５分</p>
            <FormControl component="fieldset">
                <FormLabel component="legend">実施回数</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={result.count}
                >
                    <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="１回"
                    />
                    <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="２回"
                    />
                    <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="３回"
                    />
                </RadioGroup>
            </FormControl>

            <InputLabel id="demo-simple-select-label">
                会話相手の国籍
            </InputLabel>
            <Select
                fullWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={result.nationality}
            >
                <MenuItem value={10}>アメリカ</MenuItem>
                <MenuItem value={20}>イギリス</MenuItem>
                <MenuItem value={30}>オーストラリア</MenuItem>
                <MenuItem value={30}>その他</MenuItem>
            </Select>
            <p>合計：XX分</p>
            <Button
                className={classes.button}
                fullWidth
                variant="contained"
                onClick={onResultSubmit}
            >
                英会話を登録
            </Button>
        </div>
    );
};

export default Submit;
