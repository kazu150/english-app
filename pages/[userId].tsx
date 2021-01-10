import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

const User: FC = () => {
    return (
        <div>
            <h2>[userId]さんのマイページ</h2>
            <p>今週の英会話時間；XX分</p>
            <p>全ユーザーの第X位/Y人！</p>
            <p>今月の英会話時間；XX分</p>
            <p>全ユーザーの第X位/Y人！</p>
            <p>Total英会話時間；XX分</p>
            <p>全ユーザーの第X位/Y人！</p>
            <br />
            <p>総合 第X位！</p>
            <Link href="./submit">
                <Button fullWidth variant="contained">
                    英会話の実施を登録する
                </Button>
            </Link>
        </div>
    );
};

export default User;
