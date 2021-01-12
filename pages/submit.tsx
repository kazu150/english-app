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
    const { state, dispatch } = useContext(MyContext);
    const classes = useStyles();
    const [result, setResult] = useState({
        service: '',
        count: null,
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
            <InputLabel id="service">利用サービス</InputLabel>
            <Select
                fullWidth
                labelId="service"
                id="service"
                value={result.service}
            >
                <MenuItem value={'DMM英会話'}>DMM英会話</MenuItem>
                <MenuItem value={'レアジョブ'}>レアジョブ</MenuItem>
                <MenuItem value={'ネイティブキャンプ'}>
                    ネイティブキャンプ
                </MenuItem>
            </Select>
            <p>一回の英会話時間：２５分</p>
            <FormControl component="fieldset">
                <FormLabel component="legend">実施回数</FormLabel>
                <RadioGroup
                    aria-label="count"
                    name="count1"
                    value={result.count}
                >
                    <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="１回"
                    />
                    <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label="２回"
                    />
                    <FormControlLabel
                        value={3}
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
                <MenuItem value="US">アメリカ</MenuItem>
                <MenuItem value="UK">イギリス</MenuItem>
                <MenuItem value="AUS">オーストラリア</MenuItem>
                <MenuItem value="OTHERS">その他</MenuItem>
            </Select>
            <p>
                合計：
                {state.services.filter(
                    (service) => service.name === result.service
                )[0].timePerLesson * result.count}
                分
            </p>
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
