import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from 'next/link';

const linkStyle = {
    color: '#000',
    textDecoration: 'auto',
};

export const PcMenu = ({ state, handleLogout, classes }) => {
    return (
        <div className={`${classes.headerRight} ${classes.pc}`}>
            {state.currentUser.userId ? (
                // ログイン状態では以下を表示
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
            ) : (
                // ログアウト状態では以下を表示
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
            )}
        </div>
    );
};

export const SpMenu = ({ state, handleLogout, classes }) => {
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    return (
        <div className={`${classes.headerRight} ${classes.sp}`}>
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
        </div>
    );
};
