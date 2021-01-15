import React, { FC, useReducer, createContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme.js';
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

type Props = {
    Component?: FC;
    pageProps?: {};
};

export type User = {
    userId: string;
    userName: string;
    email: string;
    initialTime: number;
    service: string;
    userLog?: UserLog;
    password?: string;
};

type UserLog = {
    date: number;
    nationality: string;
    count: number;
    service: string;
}[];

type State = {
    currentUser?: User;
    users?: User[];
    services?: {
        name: string;
        timePerLesson: number;
    }[];
    error?: {
        isOpened: boolean;
        message: string;
        errorPart: string;
    };
};

type ContextType = State & {
    state?: State;
    dispatch?: any;
};

const initialState: State = {
    currentUser: {
        userId: '',
        userName: '',
        email: '',
        initialTime: null,
        service: '',
        userLog: [
            {
                date: 20200101,
                nationality: 'US',
                count: 1,
                service: 'DMM英会話',
            },
        ],
    },
    users: [
        {
            userId: '1',
            userName: 'dummy1',
            email: 'a@a.a',
            initialTime: 10,
            service: 'DMM英会話',
            password: 'aaaa1111',
            userLog: [
                {
                    date: 20200101,
                    nationality: 'US',
                    count: 1,
                    service: 'DMM英会話',
                },
            ],
        },
        {
            userId: '2',
            userName: 'dummy2',
            email: 'b@b.b',
            initialTime: 100,
            service: 'DMM英会話',
            password: 'aaaa1111',
            userLog: [
                {
                    date: 20200101,
                    nationality: 'US',
                    count: 1,
                    service: 'DMM英会話',
                },
            ],
        },
        {
            userId: '3',
            userName: 'dummy3',
            email: 'c@b.b',
            initialTime: 100,
            service: 'DMM英会話',
            password: 'aaaa1111',
            userLog: [
                {
                    date: 20200101,
                    nationality: 'US',
                    count: 1,
                    service: 'DMM英会話',
                },
            ],
        },
    ],
    services: [
        {
            name: 'DMM英会話',
            timePerLesson: 25,
        },
        {
            name: 'レアジョブ',
            timePerLesson: 30,
        },
        {
            name: 'ネイティブキャンプ',
            timePerLesson: 35,
        },
    ],
    error: {
        isOpened: false,
        message: '',
        errorPart: '',
    },
};

export const MyContext = createContext<ContextType>(initialState);

const useStyles = makeStyles((theme) => ({
    root: {},
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        marginRight: 'auto',
        cursor: 'pointer',
    },
    body: {
        width: '90%',
        maxWidth: '500px',
        margin: 'auto',
        marginTop: '50px',
    },
}));

export const MyApp: FC<Props> = (props) => {
    const { Component, pageProps } = props;
    const classes = useStyles();

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    // TODO デバグ用なので最後に削除します
    React.useEffect(() => console.log(state));

    const reducer = (state, action) => {
        switch (action.type) {
            case 'user_signup':
                return {
                    ...state,
                    currentUser: {
                        ...state.currentUser,
                        ...action.payload,
                    },
                    users: [...state.users, action.payload],
                };
            case 'user_update':
                return {
                    ...state,
                    currentUser: {
                        ...state.currentUser,
                        ...action.payload,
                    },
                    users: [
                        ...state.users.filter(
                            (user) => user.email !== state.currentUser.email
                        ),
                        {
                            ...state.users.filter(
                                (user) => user.email === state.currentUser.email
                            )[0],
                            ...action.payload,
                        },
                    ],
                };
            case 'user_signin':
                return {
                    ...state,
                    currentUser: { ...action.payload },
                };
            case 'user_changepass':
                return {};
            case 'user_signout':
                return {
                    ...state,
                    currentUser: initialState.currentUser,
                };
            case 'study_register':
                return {
                    ...state,
                    users: [
                        ...state.users.filter(
                            (user) => user.email !== state.currentUser.email
                        ),
                        {
                            ...state.users.filter(
                                (user) => user.email === state.currentUser.email
                            )[0],
                            ...state.users
                                .filter(
                                    (user) =>
                                        user.email === state.currentUser.email
                                )[0]
                                .userLog.push(action.payload),
                        },
                    ],
                };
            case 'study_delete':
                return {};
            case 'study_modify':
                return {};
            case 'error_show':
                return {
                    ...state,
                    error: {
                        isOpened: true,
                        ...action.payload,
                    },
                };
            case 'error_close':
                return {
                    ...state,
                    error: {
                        isOpened: false,
                        message: '',
                        errorPart: '',
                    },
                };
            default:
                return {};
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <React.Fragment>
            <Head>
                <title>英語アプリ | Home</title>
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
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Link href="./">
                                <Typography
                                    variant="h6"
                                    className={classes.title}
                                >
                                    英語アプリ
                                </Typography>
                            </Link>
                            {state.currentUser.userId ? (
                                <>
                                    <Link
                                        href={`./${state.currentUser.userId}`}
                                    >
                                        <Button color="inherit">
                                            マイページ
                                        </Button>
                                    </Link>
                                    <Link href="./">
                                        <Button
                                            onClick={() =>
                                                dispatch({
                                                    type: 'user_signout',
                                                })
                                            }
                                            color="inherit"
                                        >
                                            ログアウト
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="./signin">
                                        <Button color="inherit">
                                            ログイン
                                        </Button>
                                    </Link>
                                    <Link href="./signup">
                                        <Button color="inherit">
                                            新規登録
                                        </Button>
                                    </Link>
                                </>
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
                            onClose={() => dispatch({ type: 'error_close' })}
                        >
                            <MuiAlert
                                elevation={6}
                                severity="error"
                                onClose={() =>
                                    dispatch({ type: 'error_close' })
                                }
                                variant="filled"
                            >
                                {state.error.message}
                            </MuiAlert>
                        </Snackbar>
                    </div>
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
