import React, { useReducer, createContext, useEffect } from 'react';
import { NextPage } from 'next';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Link from 'next/link';
import { auth, db } from '../firebase';
import { reducer, Action } from '../utils/reducer';
import { initialState } from '../utils/initialState';
import Router from 'next/router';

type Props = {
    Component: NextPage;
    pageProps: {};
};

export type User = {
    userId: string;
    name: string;
    initialTime: number;
    englishService: string;
    studyTime: number;
    photoUrl: string;
};

export type State = {
    currentUser: User;
    error: {
        isOpened: boolean;
        message: string;
        errorPart: string;
    };
};

type ContextType = {
    state: State;
    dispatch: React.Dispatch<Action>;
};

export const MyContext = createContext<ContextType>({
    dispatch: null,
    state: initialState,
});

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    headerLeft: {
        marginLeft: 'auto',
    },
    title: {
        width: '150px',
        cursor: 'pointer',
    },
    body: {
        width: '90%',
        maxWidth: '800px',
        margin: 'auto',
        marginTop: '50px',
    },
    footer: {
        marginTop: '80px',
        marginBottom: '20px',
        textAlign: 'center',
    },
}));

export const MyApp: NextPage<Props> = (props) => {
    const { Component, pageProps } = props;
    const classes = useStyles();

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    useEffect(() => {
        let userInfo = null;
        let publicUserInfo = null;

        // ユーザーのログイン状態を監視
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            try {
                // ユーザーが検出されたら、signInの処理
                if (user) {
                    userInfo = await db.collection('users').doc(user.uid).get();

                    publicUserInfo = await db
                        .collection('publicProfiles')
                        .doc(user.uid)
                        .get();

                    dispatch({
                        type: 'userSignin',
                        payload: {
                            userId: user.uid,
                            name: user.displayName,
                            initialTime: userInfo.data()?.initialTime || '',
                            englishService:
                                userInfo.data().englishService?.id || '',
                            studyTime: publicUserInfo.data()?.studyTime || '',
                            photoUrl: publicUserInfo.data()?.photoUrl || '',
                        },
                    });
                    // ユーザーが検出されなかったら、signOutの処理
                } else {
                    await auth.signOut();
                    dispatch({ type: 'userSignout' });
                    Router.push('/');
                    return;
                }
            } catch (error) {
                dispatch({
                    type: 'errorOther',
                    payload: `エラー内容：${error.message} [on App 1]`,
                });
                return;
            }
        });
        return () => {
            userInfo && userInfo;
            publicUserInfo && publicUserInfo;
            unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch({ type: 'userSignout' });
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message} [on App 2]`,
            });
            return;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <React.Fragment>
            <Head>
                <title>えーかいわログ | Home</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <MyContext.Provider value={{ state, dispatch }}>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <Link href="/">
                                <h1>
                                    <img
                                        className={classes.title}
                                        src="/title-white.png"
                                        alt="えーかいわログ"
                                    />
                                </h1>
                            </Link>
                            {state.currentUser.userId ? (
                                <div className={classes.headerLeft}>
                                    <Link href={`/${state.currentUser.userId}`}>
                                        <Button color="inherit">
                                            マイページ
                                        </Button>
                                    </Link>
                                    <Link href={`/settings`}>
                                        <Button color="inherit">設定</Button>
                                    </Link>
                                    <Link href="/">
                                        <Button
                                            onClick={handleLogout}
                                            color="inherit"
                                        >
                                            ログアウト
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className={classes.headerLeft}>
                                    <Link href="/signin">
                                        <Button color="inherit">
                                            ログイン
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button color="inherit">
                                            新規登録
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </Toolbar>
                    </AppBar>
                    <div className={classes.body}>
                        <Component {...pageProps} />
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            open={state.error.isOpened}
                            onClose={() => dispatch({ type: 'errorClose' })}
                        >
                            <MuiAlert
                                elevation={6}
                                severity="error"
                                onClose={() => dispatch({ type: 'errorClose' })}
                                variant="filled"
                            >
                                {state.error.message}
                            </MuiAlert>
                        </Snackbar>
                    </div>
                    <footer className={classes.footer}>
                        <small>© 2021 Shironeko-san Company</small>
                    </footer>
                </ThemeProvider>
            </MyContext.Provider>
        </React.Fragment>
    );
};

// MyApp.propTypes = {
//     Component: PropTypes.elementType.isRequired,
//     pageProps: PropTypes.object.isRequired,
// };
// TODO エラー原因わからん

export default MyApp;
