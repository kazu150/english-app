import React, { useContext, useState, useEffect } from 'react';
import { NextPage } from 'next';
import { User, MyContext } from './_app';
import { makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import useSettings from '../hooks/useManageSettingsData';

const useStyles = makeStyles((theme: Theme) => ({
    narrowWidthWrapper: {
        width: '500px',
        margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            width: 'auto',
        },
    },
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

const Settings: NextPage = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);

    // settingsで扱うstate群の処理に関するcustomHook
    const { settingsData, setSettingsData, onSubmitButtonClick } = useSettings(
        state.currentUser,
        dispatch
    );

    return (
        <main className={classes.narrowWidthWrapper}>
            {state.currentUser.userId !== '' && (
                <>
                    <h2>ユーザー情報設定</h2>
                    <form
                        className={classes.root}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            fullWidth
                            id="name"
                            label="ユーザー名"
                            error={
                                state.error.errorPart === 'name' ? true : false
                            }
                            value={settingsData.name}
                            onChange={(e) =>
                                setSettingsData({
                                    ...settingsData,
                                    name: e.target.value,
                                })
                            }
                        />
                        <TextField
                            fullWidth
                            id="initialTime"
                            label="これまでの総会話時間（分）"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        分
                                    </InputAdornment>
                                ),
                            }}
                            error={
                                state.error.errorPart === 'initialTime'
                                    ? true
                                    : false
                            }
                            value={settingsData.initialTime}
                            onChange={(e) =>
                                setSettingsData({
                                    ...settingsData,
                                    initialTime: e.target.value,
                                })
                            }
                        />
                        <div>
                            <FormLabel>利用サービス</FormLabel>
                            <RadioGroup
                                aria-label="englishService"
                                name="englishService"
                                value={settingsData.englishService}
                                onChange={(e) =>
                                    setSettingsData({
                                        ...settingsData,
                                        englishService: e.target.value,
                                    })
                                }
                            >
                                <FormControlLabel
                                    value="dmm"
                                    control={<Radio />}
                                    label="DMM英会話"
                                />
                                <FormControlLabel
                                    value="rarejob"
                                    control={<Radio />}
                                    label="レアジョブ"
                                />
                                <FormControlLabel
                                    value="nativeCamp"
                                    control={<Radio />}
                                    label="ネイティブキャンプ"
                                />
                                <FormControlLabel
                                    value="cambly"
                                    control={<Radio />}
                                    label="キャンブリー"
                                />
                            </RadioGroup>
                        </div>
                        <Button
                            variant="contained"
                            onClick={onSubmitButtonClick}
                        >
                            送信
                        </Button>
                    </form>
                </>
            )}
        </main>
    );
};

export default Settings;
