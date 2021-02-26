import React, { useReducer, createContext, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Header from '../components/organisms/Header';
import { reducer, Action } from '../utils/reducer';
import { initialState } from '../utils/initialState';
import useAuthManagement from '../hooks/useAuthManagement';

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

const useStyles = makeStyles((theme: Theme) => ({
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
    const [state, dispatch] = useReducer(reducer, initialState);
    // ユーザーのログイン状態を管理するカスタムフック
    const handleLogout = useAuthManagement(dispatch);

    useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

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
                    <Header handleLogout={handleLogout} />
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
