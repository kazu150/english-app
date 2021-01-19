import React, { FC, useState, useContext, useEffect } from 'react';
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
import Router from 'next/router';
import { db } from '../firebase';
import firebase from 'firebase/app';

type Result = {
    service: string;
    count: number;
    nationality: string;
    time: number;
};

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: '15px',
    },
}));

const Submit: FC = () => {
    const { state, dispatch } = useContext(MyContext);
    const classes = useStyles();
    const [result, setResult] = useState<Result>({
        service: state.currentUser.service,
        count: 1,
        nationality: 'OTHERS',
        time: 0,
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // TODO この部分で、ログインユーザ判定し、falseの場合は弾いてログインページへ
        const f = async () => {
            if (!state.currentUser.userId) {
                Router.push('/');
                dispatch({ type: 'userSignout' });
                return;
            }

            const docRef = await db
                .collection('users')
                .doc(state.currentUser.userId)
                .get();

            if (!docRef.exists) {
                Router.push('/');
                dispatch({ type: 'userSignout' });
                return;
            } else {
                setIsLoggedIn(true);
            }
        };
        f();

        return () => f();
    });

    const onResultSubmit = async () => {
        try {
            await db
                .collection('users')
                .doc(state.currentUser.userId)
                .collection('studyLog')
                .add({
                    ...result,
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                });
            dispatch({ type: 'study_register' });
            Router.push(`/${state.currentUser.userId}`);
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: {
                    message: 'すみません…何らかのエラーが発生しました><',
                },
            });
            return;
        }
    };

    useEffect(() => {
        setResult({
            ...result,
            time:
                state.services.filter(
                    (service) => service.name === result.service
                )[0]?.timePerLesson * result.count,
        });
    }, [result.service, result.count]);

    return (
        <>
            {!isLoggedIn ? (
                ''
            ) : (
                <div>
                    <h2>英会話をやりました！</h2>
                    <InputLabel id="service">利用サービス</InputLabel>
                    <Select
                        fullWidth
                        labelId="service"
                        id="service"
                        value={result.service}
                        onChange={(e) => {
                            setResult({
                                ...result,
                                service: e.target.value as string,
                            });
                        }}
                    >
                        <MenuItem value="DMM英会話">
                            DMM英会話
                            {state.currentUser.service === 'DMM英会話' &&
                                '（デフォルト設定）'}
                        </MenuItem>
                        <MenuItem value="レアジョブ">
                            レアジョブ
                            {state.currentUser.service === 'レアジョブ' &&
                                '（デフォルト設定）'}
                        </MenuItem>
                        <MenuItem value="ネイティブキャンプ">
                            ネイティブキャンプ
                            {state.currentUser.service ===
                                'ネイティブキャンプ' && '（デフォルト設定）'}
                        </MenuItem>
                    </Select>
                    <p>
                        一回の英会話時間：
                        {
                            state.services.filter(
                                (service) => service.name === result.service
                            )[0]?.timePerLesson
                        }
                        分
                    </p>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">実施回数</FormLabel>
                        <RadioGroup
                            aria-label="count"
                            name="count1"
                            value={result.count}
                            onChange={(e) => {
                                setResult({
                                    ...result,
                                    count: Number(e.target.value),
                                });
                            }}
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

                    <InputLabel id="nationality">会話相手の国籍</InputLabel>
                    <Select
                        fullWidth
                        labelId="nationality"
                        id="nationality"
                        value={result.nationality}
                        onChange={(e) =>
                            setResult({
                                ...result,
                                nationality: e.target.value as string,
                            })
                        }
                    >
                        <MenuItem value="US">アメリカ</MenuItem>
                        <MenuItem value="UK">イギリス</MenuItem>
                        <MenuItem value="AUS">オーストラリア</MenuItem>
                        <MenuItem value="OTHERS">その他・未選択</MenuItem>
                    </Select>
                    <p>合計： {result.time}分</p>
                    <Button
                        className={classes.button}
                        fullWidth
                        variant="contained"
                        onClick={onResultSubmit}
                    >
                        英会話を登録
                    </Button>
                </div>
            )}
        </>
    );
};

export default Submit;
