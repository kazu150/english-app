import React, { FC, useReducer } from 'react';
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

type CurrentUser = {
    userName: string;
    email: string;
    initialTime: string;
    studyTime: string;
};

type Service = {
    name: string;
    timePerLesson: string;
};

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

    const initialState = {
        currentUser: {
            userName: '',
            email: '',
            initialTime: '',
            studyTime: '',
        },
        service: {
            name: '',
            timePerLesson: '',
        },
    };

    const action = ({ type, payload }) => {
        switch (type) {
            case '':
                return {};
            default:
                return {};
        }
    };

    const [state, reducer] = useReducer(action, initialState);

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
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
        </React.Fragment>
    );
};

// MyApp.propTypes = {
//     Component: PropTypes.elementType.isRequired,
//     pageProps: PropTypes.object.isRequired,
// };
// TODO エラー原因わからん

export default MyApp;
