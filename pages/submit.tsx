import React, { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
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
import { db, auth } from '../firebase';
import firebase from 'firebase/app';

type Result = {
    englishService: string;
    count: number;
    nationality: string;
    defaultTime: number;
};

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: '15px',
    },
}));

const Submit: NextPage = () => {
    const { state, dispatch } = useContext(MyContext);
    const initialResult: Result = {
        englishService: state.currentUser.englishService,
        count: 1,
        nationality: 'others',
        defaultTime: 0,
    };
    const classes = useStyles();
    const [englishServices, setEnglishServices] = useState([]);
    const [result, setResult] = useState<Result>(initialResult);

    // useEffect(() => {
    //     // ログインユーザ判定し、falseの場合はログインページへ
    //     // trueの場合はユーザー情報を出力
    //     let querySnapshot = null;
    //     let services = null;
    //     const unsubscribe = auth.onAuthStateChanged(async (user) => {
    //         try {
    //             if (!user) {
    //                 // console.log('submituser');
    //                 Router.push('/');
    //             } else {
    //                 // console.log('submit!user');
    //                 const userInfo = await db
    //                     .collection('users')
    //                     .doc(user.uid)
    //                     .get();

    //                 dispatch({
    //                     type: 'userUpdate',
    //                     payload: {
    //                         englishService:
    //                             userInfo.data().englishService.id || '',
    //                     },
    //                 });
    //                 // console.log(querySnapshot);
    //                 // console.log(services);

    //                 querySnapshot = await db
    //                     .collection('englishServices')
    //                     .get();
    //                 services = querySnapshot.docs.map((postDoc) => {
    //                     return {
    //                         id: postDoc.id,
    //                         defaultTime: postDoc.data().defaultTime,
    //                         serviceName: postDoc.data().serviceName,
    //                     };
    //                 });
    //                 setEnglishServices(services);
    //                 setResult({
    //                     ...result,
    //                     englishService: userInfo.data().englishService.id || '',
    //                     defaultTime:
    //                         services.filter(
    //                             (service) =>
    //                                 service.id ===
    //                                 userInfo.data().englishService.id
    //                         )[0]?.defaultTime || 0,
    //                 });
    //             }
    //         } catch (error) {
    //             dispatch({
    //                 type: 'errorOther',
    //                 payload: `エラー内容：${error.message} [on submit 1]`,
    //             });
    //         }
    //     });
    //     return () => {
    //         // console.log('submitunsub');
    //         unsubscribe();
    //         querySnapshot && querySnapshot;
    //         services && services;
    //         setEnglishServices([]);
    //         setResult(initialResult);
    //     };
    // }, []);

    useEffect(() => {
        (async () => {
            try {
                // ログインユーザ判定し、trueの場合はマイページへ
                if (state.currentUser.userId !== '') {
                    if (!englishServices.length) {
                        const querySnapshot = await db
                            .collection('englishServices')
                            .get();
                        const services = querySnapshot.docs.map((postDoc) => {
                            return {
                                id: postDoc.id,
                                defaultTime: postDoc.data().defaultTime,
                                serviceName: postDoc.data().serviceName,
                            };
                        });
                        setEnglishServices(services);
                        setResult({
                            ...result,
                            englishService: state.currentUser.englishService,
                        });
                    }
                }
            } catch (error) {
                dispatch({
                    type: 'errorOther',
                    payload: `エラー内容：${error.message} [on submit 1]`,
                });
            }
        })();
        return () => {};
    }, [state.currentUser.userId]);

    const onResultSubmit = async () => {
        try {
            await db
                .collection('users')
                .doc(state.currentUser.userId)
                .collection('studyLog')
                .add({
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    nationality: db.doc(`nationalities/${result.nationality}`),
                    count: result.count,
                    englishService: db.doc(
                        `englishServices/${result.englishService}`
                    ),
                    time: result.defaultTime * result.count,
                });

            dispatch({ type: 'studyRegister' });
            Router.push(`/${state.currentUser.userId}`);
            return;
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message} [on submit 2]`,
            });
            return;
        }
    };

    useEffect(() => {
        const changeDefaultTime = () =>
            setResult({
                ...result,
                defaultTime:
                    englishServices.filter(
                        (service) => service.id === result?.englishService
                    )[0]?.defaultTime || 0,
            });
        changeDefaultTime();
        return () => changeDefaultTime();
    }, [result.englishService, englishServices]);

    return (
        <>
            {state.currentUser.userId === '' ? (
                ''
            ) : (
                <div>
                    <h2>英会話をやりました！</h2>
                    <InputLabel id="englishService">利用サービス</InputLabel>
                    <Select
                        fullWidth
                        labelId="englishService"
                        id="englishService"
                        value={result.englishService}
                        onChange={(
                            e: React.ChangeEvent<{
                                name?: string;
                                value: unknown;
                            }>
                        ) => {
                            setResult({
                                ...result,
                                englishService: e.target.value as string,
                            });
                        }}
                    >
                        {englishServices.map((service, index) => {
                            return (
                                <MenuItem key={index} value={service.id}>
                                    {service.serviceName}
                                    {state.currentUser.englishService ===
                                        `${service.id}` && '（デフォルト設定）'}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <p>一回の英会話時間： {result.defaultTime}分</p>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">実施回数</FormLabel>
                        <RadioGroup
                            aria-label="count"
                            name="count1"
                            value={result.count}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
                        onChange={(
                            e: React.ChangeEvent<{
                                name?: string;
                                value: unknown;
                            }>
                        ) =>
                            setResult({
                                ...result,
                                nationality: e.target.value as string,
                            })
                        }
                    >
                        <MenuItem value="us">アメリカ合衆国</MenuItem>
                        <MenuItem value="uk">イギリス</MenuItem>
                        <MenuItem value="aus">オーストラリア</MenuItem>
                        <MenuItem value="ca">カナダ</MenuItem>
                        <MenuItem value="others">その他・未選択</MenuItem>
                    </Select>
                    <p>合計： {result.defaultTime * result.count}分</p>
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
