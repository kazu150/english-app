import React, { useContext } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Router from 'next/router';
import styles from '../styles/Home.module.css';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Link from 'next/link';
import { MyContext } from './_app';
import { auth, db } from '../firebase';
import firebase from 'firebase/app';

const useStyles = makeStyles((theme: Theme) => ({
    narrowWidthWrapper: {
        width: '500px',
        margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            width: 'auto',
        },
    },
    title: {
        marginTop: '-10px',
        marginBottom: '35px',
    },
    titleImg: {
        width: '100%',
    },
    imgContainer: {
        textAlign: 'center',
    },
    img: {
        height: '250px',
    },
    description: {
        marginBottom: '30px',
        lineHeight: '1.8',
    },
    button: {
        marginBottom: '15px',
    },
}));

const Home: NextPage = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(MyContext);

    const handleGuestLogin = async () => {
        try {
            // ユーザーのログイン状態をどれだけ継続するか（SESSIONの場合、ブラウザを開いている間有効）
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);

            // ゲストログインの場合(envファイルに記載)
            const data = await auth.signInWithEmailAndPassword(
                process.env.NEXT_PUBLIC_GUEST_ID,
                process.env.NEXT_PUBLIC_GUEST_PW
            );

            const userInfo = await db
                .collection('users')
                .doc(data.user.uid)
                .get();

            const publicUserInfo = await db
                .collection('publicProfiles')
                .doc(data.user.uid)
                .get();

            dispatch({
                type: 'userSignin',
                payload: {
                    userId: data.user.uid,
                    name: data.user.displayName,
                    initialTime: userInfo.data().initialTime,
                    englishService: userInfo.data().englishService.id,
                    studyTime: publicUserInfo.data().studyTime,
                    photoUrl: publicUserInfo.data().photoUrl,
                },
            });

            Router.push(`./${data.user.uid}`);
            return;
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                dispatch({ type: 'errorUnregisteredPassword' });
                return;
            } else if (error.code === 'auth/wrong-password') {
                dispatch({ type: 'errorUnmatchPassword' });
                return;
            } else {
                dispatch({
                    type: 'errorOther',
                    payload: `エラー内容：${error.message} [on guestSignin]`,
                });
                return;
            }
        }
    };

    return (
        <div className={styles.button}>
            <Head>
                <title>えーかいわログ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={classes.narrowWidthWrapper}>
                <div className={classes.imgContainer}>
                    <img
                        className={classes.img}
                        src="english_kaiwa_woman.png"
                    />
                </div>
                <h1 className={classes.title}>
                    <img
                        className={classes.titleImg}
                        src="title.png"
                        alt="えーかいわログ"
                    />
                </h1>
                <div className={classes.description}>
                    <p>
                        オンライン英会話を何十回もやっているが、なかなか英語力の伸びを実感できないあなた！
                        <br />
                        このアプリは、オンライン英会話の継続状況を記録し、自分の英語力の伸びを実感することができます。
                    </p>
                    <p>ぜひ一緒に、英会話を頑張りましょう！</p>
                </div>
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
                                                payload: `エラー内容：${error.message} [on index]`,
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
                                color="primary"
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
                        <Button
                            className={classes.button}
                            fullWidth
                            variant="contained"
                            onClick={handleGuestLogin}
                        >
                            ゲストアカウントで利用する
                        </Button>
                    </>
                )}
            </main>
        </div>
    );
};

export default Home;

// Homeだけは、module.cssでの表記をひとまず残しておく笑
