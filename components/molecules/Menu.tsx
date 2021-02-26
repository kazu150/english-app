import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MoreIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from 'next/link';
import { useRouter } from 'next/router';

const linkStyle = {
    color: '#000',
    textDecoration: 'auto',
};

export const PcMenu = ({ state, handleLogout, classes }) => {
    const router = useRouter();
    return (
        <div className={`${classes.headerRight} ${classes.pc}`}>
            {state.currentUser.userId ? (
                // ログイン状態では以下を表示
                <>
                    <a onClick={() => router.push(`/blog`)}>
                        <Button color="inherit">英会話TIPS</Button>
                    </a>
                    <a
                        onClick={() =>
                            router.push(`/${state.currentUser.userId}`)
                        }
                    >
                        <Button color="inherit">マイページ</Button>
                    </a>
                    <a onClick={() => router.push(`/settings`)}>
                        <Button color="inherit">設定</Button>
                    </a>
                    <a onClick={() => router.push('/')}>
                        <Button onClick={handleLogout} color="inherit">
                            ログアウト
                        </Button>
                    </a>
                </>
            ) : (
                // ログアウト状態では以下を表示
                <>
                    <a onClick={() => router.push(`/blog`)}>
                        <Button color="inherit">英会話TIPS</Button>
                    </a>
                    <a onClick={() => router.push('/signin')}>
                        <Button color="inherit">ログイン</Button>
                    </a>
                    <a onClick={() => router.push('/signup')}>
                        <Button color="inherit">新規登録</Button>
                    </a>
                </>
            )}
        </div>
    );
};

export const SpMenu = ({ state, handleLogout, classes }) => {
    const router = useRouter();

    const handleClose = (page) => {
        setAnchorEl(null);
        if (page) {
            router.push(page);
        }

        if (page === '/') {
            handleLogout();
        }
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
                    onClose={() => handleClose(null)}
                >
                    <MenuItem onClick={() => handleClose(`/blog`)}>
                        英会話TIPS
                    </MenuItem>
                    <MenuItem
                        onClick={() =>
                            handleClose(`/${state.currentUser.userId}`)
                        }
                    >
                        マイページ
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(`/settings`)}>
                        設定
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(`/`)}>
                        ログアウト
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
                    <MenuItem onClick={() => handleClose(`/blog`)}>
                        英会話TIPS
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(`/signin`)}>
                        <a style={linkStyle}>ログイン</a>
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(`/signup`)}>
                        <a style={linkStyle}>新規登録</a>
                    </MenuItem>
                </Menu>
            )}
        </div>
    );
};
