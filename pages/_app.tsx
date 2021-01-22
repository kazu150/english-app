import React, { useReducer, createContext } from 'react';
import { NextPage } from 'next';
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
import { auth } from '../firebase';
import { reducer, Action } from '../utils/reducer';
import { initialState } from '../utils/initialState';

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

export const MyApp: NextPage<Props> = (props) => {
    const { Component, pageProps } = props;
    const classes = useStyles();

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            dispatch({ type: 'userSignout' });
        } catch (error) {
            dispatch({
                type: 'errorOther',
                payload: `エラー内容：${error.message}`,
            });
            return;
        }
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <React.Fragment>
            <Head>
                <title>オンライン英会話 応援アプリ | Home</title>
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
                                    オンライン英会話 応援アプリ
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
                                            onClick={handleLogout}
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
