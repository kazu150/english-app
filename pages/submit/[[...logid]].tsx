import React, { useState, useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { MyContext } from '../_app';
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
import Router, { useRouter } from 'next/router';
import { db, auth } from '../../firebase';
import firebase from 'firebase/app';
import useGetCollectionFromDb from '../../custom/useGetCollectionFromDb';
import useGetCurrentStudyLog from '../../custom/useGetCurrentStudyLog';

type Result = {
    englishService: string;
    count: number;
    nationality: string;
    defaultTime: number;
};

const useStyles = makeStyles((theme) => ({
    narrowWidthWrapper: {
        width: '500px',
        margin: 'auto',
    },
    button: {
        marginTop: '15px',
    },
}));

const Submit: NextPage = () => {
    const router = useRouter();
    const { state, dispatch } = useContext(MyContext);
    const nationalities = useGetCollectionFromDb('nationalities');
    const englishServices = useGetCollectionFromDb('englishServices');
    const editData = useGetCurrentStudyLog();

    const initialResult: Result = {
        englishService: '',
        count: 1,
        nationality: '',
        defaultTime: 0,
    };
    const classes = useStyles();
    const [result, setResult] = useState<Result>(initialResult);

    // 画面ロード時処理
    useEffect(() => {
        if (editData.englishService === '') {
            setResult({
                ...result,
                englishService:
                    result.englishService === ''
                        ? state.currentUser.englishService
                        : result.englishService,

                defaultTime:
                    englishServices.filter(
                        (service) =>
                            service.id === state.currentUser.englishService
                    )[0]?.defaultTime || 0,
            });
        } else {
            setResult({
                ...editData,
                defaultTime:
                    englishServices.filter(
                        (service) => service.id === editData.englishService
                    )[0]?.defaultTime || 0,
            });
        }
    }, [state.currentUser.englishService, englishServices, editData]);

    // nationalitiesのロード時に、result内のnationalityを変更
    useEffect(() => {
        if (editData.nationality === '') {
            setResult({
                ...result,
                nationality: nationalities[0]?.id || '',
            });
        }
    }, [nationalities, editData]);

    const onEnglishServiceSelected = (
        e: React.ChangeEvent<{
            name?: string;
            value: unknown;
        }>
    ) => {
        setResult({
            ...result,
            englishService: e.target.value as string,
            defaultTime:
                englishServices.filter(
                    (service) => service.id === (e.target.value as string)
                )[0]?.defaultTime || 0,
        });
    };

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
            Router.push(`../${state.currentUser.userId}`);
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
        <main className={classes.narrowWidthWrapper}>
            {state.currentUser.userId === '' ? (
                ''
            ) : (
                <div>
                    <h2>
                        {router.query.logid?.length
                            ? `学習記録ID: ${router.query.logid[0]}の編集`
                            : '英会話をやりました！'}
                    </h2>
                    <InputLabel id="englishService">利用サービス</InputLabel>
                    <Select
                        fullWidth
                        labelId="englishService"
                        id="englishService"
                        value={result.englishService}
                        onChange={(e) => onEnglishServiceSelected(e)}
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
        </main>
    );
};

export default Submit;
