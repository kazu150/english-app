import React, { useContext } from 'react';
import { MyContext } from '../../pages/_app';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from 'next/link';
import theme from '../../src/theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { PcMenu, SpMenu } from '../molecules/Menu';

const useStyles = makeStyles((theme: Theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    headerRight: {
        marginLeft: 'auto',
    },
    title: {
        width: '150px',
        cursor: 'pointer',
    },
    pc: {
        [theme.breakpoints.up('xs')]: {
            display: 'block',
        },
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    sp: {
        [theme.breakpoints.up('xs')]: {
            display: 'none',
        },
        [theme.breakpoints.down('xs')]: {
            display: 'block',
        },
    },
}));

const Header = ({ handleLogout }: { handleLogout: () => Promise<void> }) => {
    const classes = useStyles();
    const { state } = useContext(MyContext);

    return (
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
                <PcMenu
                    state={state}
                    handleLogout={handleLogout}
                    classes={classes}
                />
                <SpMenu
                    state={state}
                    handleLogout={handleLogout}
                    classes={classes}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
