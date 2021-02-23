import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useAnimalNum from '../../hooks/useAnimalNum';

const useStyles = makeStyles((theme: Theme) => ({
    balloon: {
        position: 'relative',
        padding: '18px',
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        marginBottom: '2em',
        '&::before': {
            content: '""',
            position: 'absolute',
            display: 'block',
            width: 0,
            height: 0,
            left: '20px',
            bottom: '-15px',
            borderTop: '15px solid #b3e5fc',
            borderRight: '15px solid transparent',
            borderLeft: '15px solid transparent',
        },
    },
    totalTimeFlexWrapper: {
        display: 'flex',
        [theme.breakpoints.down(800)]: {
            flexWrap: 'wrap',
        },
    },
    animalImg: {
        width: '30%',
        height: '30%',
        paddingRight: '20px',
        transform: 'scale(-1, 1)',
    },
    totalStudyHour: {
        fontSize: '45px',
        fontWeight: 'bold',
    },
    monthlyFlexWrapper: {
        display: 'flex',
        justifyContent: 'space-around',
        [theme.breakpoints.down(800)]: {
            flexWrap: 'wrap',
            justifyContent: 'left',
        },
    },
    monthlyData: {
        fontSize: '12px',
        [theme.breakpoints.down(800)]: {
            width: '100%',
        },
    },
    monthlyStudyHour: {
        fontSize: '22px',
        fontWeight: 'bold',
    },
}));

const StudyStatistics = ({ totalStudyTime }) => {
    const classes = useStyles();
    // 動物画像とコメントを返すカスタムフック
    const [animalNum, comment] = useAnimalNum();

    return (
        <>
            <div className={classes.balloon}>{comment}</div>
            <div className={classes.totalTimeFlexWrapper}>
                <img
                    src={`computer_operator/${animalNum}.png`}
                    className={classes.animalImg}
                />
                <p>
                    トータル英会話時間
                    <br />
                    <span className={classes.totalStudyHour}>
                        {totalStudyTime}
                    </span>
                    分
                </p>
            </div>
            <div className={classes.monthlyFlexWrapper}>
                <p className={classes.monthlyData}>
                    今月の英会話時間：
                    <span className={classes.monthlyStudyHour}>300</span>分
                </p>
                <p className={classes.monthlyData}>
                    今月のランキング：
                    <span className={classes.monthlyStudyHour}>20</span>
                    位/101人中
                </p>
            </div>
        </>
    );
};

export default StudyStatistics;
