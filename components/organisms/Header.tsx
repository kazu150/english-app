import React, { useContext } from 'react';
import { MyContext } from '../../pages/_app';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import theme from '../../src/theme';
import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

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

const ItemsOnLoggedIn = ({ state, handleLogout }) => {
    return (
        <>
            <Link href={`/blog`}>
                <Button color="inherit">英会話TIPS</Button>
            </Link>
            <Link href={`/${state.currentUser.userId}`}>
                <Button color="inherit">マイページ</Button>
            </Link>
            <Link href={`/settings`}>
                <Button color="inherit">設定</Button>
            </Link>
            <Link href="/">
                <Button onClick={handleLogout} color="inherit">
                    ログアウト
                </Button>
            </Link>
        </>
    );
};

const ItemsOnLoggedOut = () => {
    return (
        <>
            <Link href={`/blog`}>
                <Button color="inherit">英会話TIPS</Button>
            </Link>
            <Link href="/signin">
                <Button color="inherit">ログイン</Button>
            </Link>
            <Link href="/signup">
                <Button color="inherit">新規登録</Button>
            </Link>
        </>
    );
};

const linkStyle = {
    color: '#000',
    textDecoration: 'auto',
};

const SpMenu = ({ state, handleLogout }) => {
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton
                aria-label="display more actions"
                edge="end"
                color="inherit"
                onClick={handleClick}
            >
                <MoreIcon />
            </IconButton>
            {state.currentUser.userId ? (
                // ログイン状態では以下を表示
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>
                        <Link href={`/blog`}>
                            <a style={linkStyle}>英会話TIPS</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href={`/${state.currentUser.userId}`}>
                            <a style={linkStyle}>マイページ</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href={`/settings`}>
                            <a style={linkStyle}>設定</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Link href="/">
                            <a style={linkStyle}>ログアウト</a>
                        </Link>
                    </MenuItem>
                </Menu>
            ) : (
                // ログアウト状態では以下を表示
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose}>
                        <Link href={`/blog`}>
                            <a style={linkStyle}>英会話TIPS</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href={`/signin`}>
                            <a style={linkStyle}>ログイン</a>
                        </Link>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Link href="/signup">
                            <a style={linkStyle}>新規登録</a>
                        </Link>
                    </MenuItem>
                </Menu>
            )}
        </>
    );
};

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
                {state.currentUser.userId ? (
                    // ログイン状態では以下を表示
                    <>
                        <div className={`${classes.headerRight} ${classes.pc}`}>
                            <ItemsOnLoggedIn
                                state={state}
                                handleLogout={handleLogout}
                            />
                        </div>
                        <div className={`${classes.headerRight} ${classes.sp}`}>
                            <SpMenu state={state} handleLogout={handleLogout} />
                        </div>
                    </>
                ) : (
                    // ログアウト状態では以下を表示
                    <>
                        <div className={`${classes.headerRight} ${classes.pc}`}>
                            <ItemsOnLoggedOut />
                        </div>
                        <div className={`${classes.headerRight} ${classes.sp}`}>
                            <SpMenu handleLogout={handleLogout} state={state} />
                        </div>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
