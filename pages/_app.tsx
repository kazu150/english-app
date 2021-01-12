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
import Link from 'next/link';

type Props = {
    Component?: FC;
    pageProps?: {};
};

type User = {
    userId: number;
    userName: string;
    email: string;
    initialTime: number;
    lessonCount: number;
    service: string;
    userLog?: UserLog;
};

type UserLog = {
    date: number;
    nationality: string[];
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
};

type ContextType = State & {
    state?: State;
    dispatch?: any;
};

const initialState: State = {
    currentUser: {
        userId: null,
        userName: '',
        email: '',
        initialTime: null,
        lessonCount: null,
        service: '',
    },
    users: [],
    services: [
        {
            name: '',
            timePerLesson: null,
        },
    ],
};

export const MyContext = createContext<ContextType>(initialState);

const useStyles = makeStyles((theme) => ({
    root: {},
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
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

    const reducer = (state, action) => {
        switch (action.type) {
            case 'user_signup':
                return {
                    ...state,
                    users: [...state.users, action.payload],
                };
            case 'user_register':
                return {
                    ...state,
                    users: [
                        ...state.users,
                        {
                            ...state.users.filter(
                                (user) => user.email === action.payload.email
                            )[0],
                            ...action.payload,
                        },
                    ],
                };
            case 'user_signin':
                return {
                    ...state,
                    currentUser: {
                        ...state.users.filter(
                            (user) => user.email === action.payload.email
                        )[0],
                    },
                };
            case 'user_changepass':
                return {};
            case 'user_signout':
                return {};
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
                            <Typography variant="h6" className={classes.title}>
                                英語アプリ
                            </Typography>
                            <Link href="./signin">
                                <Button color="inherit">Login</Button>
                            </Link>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.body}>
                        <Component {...pageProps} />
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
