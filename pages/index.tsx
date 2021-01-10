import React, { FC } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    button: {
        marginBottom: '15px',
    },
}));

const Home: FC = () => {
    const classes = useStyles();

    return (
        <div className={styles.button}>
            <Head>
                <title>英語アプリ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>英語アプリ</h1>
                <p>
                    このサービスは、オンライン英会話のユーザーが、自分の英語力をチェックするためのものです。
                </p>
                <Button
                    className={classes.button}
                    fullWidth
                    variant="contained"
                >
                    新規ユーザ登録
                </Button>
                <Button
                    className={classes.button}
                    fullWidth
                    variant="contained"
                >
                    ログイン
                </Button>
            </main>
        </div>
    );
};

export default Home;

// Homeだけは、module.cssでの表記をひとまず残しておく笑
