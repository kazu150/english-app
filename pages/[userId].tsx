import React, { FC, useContext } from 'react';
import { MyContext } from './_app';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

const User: FC = () => {
    const { dispatch, state } = useContext(MyContext);

    return (
        <div>
            <h2>[userId]さんのマイページ</h2>
            <p>（今後作成）今週の英会話時間；X分</p>
            <p>（今後作成）全ユーザーの第XX位/Y人！</p>
            <p>（今後作成）今月の英会話時間；XX分</p>
            <p>（今後作成）全ユーザーの第X位/Y人！</p>
            <p>
                Total英会話時間；
                {state.currentUser.initialTime +
                    state.currentUser.lessonCount *
                        state.services.filter(
                            (service) =>
                                service.name === state.currentUser.service
                        )[0].timePerLesson}
                分
            </p>
            <p>
                全ユーザーの第
                {state.users.filter(
                    (user) =>
                        user.initialTime +
                            user.lessonCount *
                                state.services.filter(
                                    (service) =>
                                        service.name ===
                                        state.currentUser.service
                                )[0].timePerLesson >
                        state.currentUser.initialTime +
                            state.currentUser.lessonCount *
                                state.services.filter(
                                    (service) =>
                                        service.name ===
                                        state.currentUser.service
                                )[0].timePerLesson
                )}
                位/{state.users.length}人！
            </p>
            <br />
            <p>（今後作成）総合 第X位！</p>
            <Link href="./submit">
                <Button fullWidth variant="contained">
                    英会話の実施を登録する
                </Button>
            </Link>
        </div>
    );
};

export default User;
