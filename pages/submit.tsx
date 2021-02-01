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
    const [englishServices, setEnglishServices] = useState([]);
    const [nationalities, setNationalities] = useState([]);
    const initialResult: Result = {
        englishService: '',
        count: 1,
        nationality: '',
        defaultTime: 0,
    };
    const classes = useStyles();
    const [result, setResult] = useState<Result>(initialResult);

    useEffect(() => {
        (async () => {
            try {
                // ログインユーザ判定し、trueの場合はマイページへ
                if (state.currentUser.userId !== '') {
                    // stateのenglishServicesの中身が無い場合は、サーバーからenglishServicesを取得
                    if (!englishServices.length) {
                        const snapshot = await db
                            .collection('englishServices')
                            .get();
                        const services = snapshot.docs.map((postDoc) => {
                            return {
                                id: postDoc.id,
                                defaultTime: postDoc.data().defaultTime,
                                serviceName: postDoc.data().serviceName,
                            };
                        });
                        setEnglishServices(services);
                    }

                    // stateのnationalitiesの中身が無い場合は、サーバーからnationalitiesを取得
                    if (!nationalities.length) {
                        const snapshot = await db
                            .collection('nationalities')
                            .get();
                        const nat = snapshot.docs.map((postDoc) => {
                            return {
                                id: postDoc.id,
                                countryName: postDoc.data().countryName,
                            };
                        });
                        setNationalities(nat);
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

    // englishServicesの切り替えごとに、関係するstateを変更
    useEffect(() => {
        setResult({
            ...result,
            englishService:
                result.englishService !== ''
                    ? result.englishService
                    : state.currentUser.englishService,
            defaultTime:
                englishServices.filter(
                    (service) => service.id === result?.englishService
                )[0]?.defaultTime || 0,
        });
    }, [result.englishService, englishServices]);

    // nationalitiesのロード時に、currrentUser内のnationalityを変更
    useEffect(() => {
        setResult({
            ...result,
            nationality: nationalities[0]?.id || '',
        });
    }, [nationalities]);

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
                        {nationalities.map((nat, index) => {
                            return (
                                <MenuItem key={index} value={nat.id}>
                                    {nat.countryName}
                                </MenuItem>
                            );
                        })}
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
