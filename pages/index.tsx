import React, { useContext } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import { MyContext } from './_app';
import { auth } from '../firebase';

const useStyles = makeStyles((theme) => ({
    button: {
        marginBottom: '15px',
    },
}));

const Home: NextPage = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);

    return (
        <div className={styles.button}>
            <Head>
                <title>オンライン英会話 応援アプリ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>オンライン英会話 応援アプリ</h1>
                <p>
                    オンライン英会話を何十回もやっているが、なかなか英語力の伸びを実感できないあなた！
                </p>
                <p>
                    このアプリは、オンライン英会話の継続状況を記録し、自分の英語力の伸びを実感することができます。
                </p>
                <p>ぜひ一緒に、英会話を頑張りましょう！</p>
                {state.currentUser.userId ? (
                    <>
                        <Link href={`./${state.currentUser.userId}`}>
                            <Button
                                className={classes.button}
                                fullWidth
                                variant="contained"
                            >
                                マイページへ
                            </Button>
                        </Link>
                        <Link href="./">
                            <Button
                                className={classes.button}
                                fullWidth
                                variant="contained"
                                onClick={() =>
                                    auth
                                        .signOut()
                                        .then(() => {
                                            dispatch({ type: 'userSignout' });
                                            return;
                                        })
                                        .catch((error) => {
                                            dispatch({
                                                type: 'errorOther',
                                                payload: `エラー内容：${error.message}`,
                                            });
                                            return;
                                        })
                                }
                            >
                                ログアウト
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="./signup">
                            <Button
                                className={classes.button}
                                fullWidth
                                variant="contained"
                            >
                                新規ユーザー登録
                            </Button>
                        </Link>
                        <Link href="./signin">
                            <Button
                                className={classes.button}
                                fullWidth
                                variant="contained"
                            >
                                ログイン
                            </Button>
                        </Link>
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;

// Homeだけは、module.cssでの表記をひとまず残しておく笑
