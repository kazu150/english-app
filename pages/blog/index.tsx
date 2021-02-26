import React from 'react';
import { NextPage } from 'next';
import Typography from '@material-ui/core/Typography';

const Blog: NextPage = () => {
    return (
        <div>
            <Typography variant="h3">英会話TIPSまとめ</Typography>
            <div>
                <Typography variant="h5">記事カテゴリ</Typography>
                <Typography variant="body1">英会話サービス</Typography>
                <Typography variant="body1">英会話学習法</Typography>
                <Typography variant="body1">その他の英語学習</Typography>
                <Typography variant="body1">わたしの英会話記録</Typography>
            </div>
        </div>
    );
};

export default Blog;
