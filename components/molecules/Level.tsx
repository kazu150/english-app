import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useShowLevel from '../../hooks/useShowLevel';

const useStyles = makeStyles((theme: Theme) => ({
    levelDescription: {
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        textAlign: 'center',
    },
    levelIcon: {
        display: 'block',
        fontSize: '40px',
    },
}));

const Level = ({ totalStudyTime }: { totalStudyTime: number }) => {
    const classes = useStyles();
    const currentLevel = useShowLevel(totalStudyTime);

    return (
        <Box className={classes.levelDescription} p={2} mb={3}>
            <span className={classes.levelIcon}>{currentLevel?.character}</span>
            あなたは<b>{currentLevel?.name}</b>レベル！
            <br />
            {currentLevel?.comment}
            <br />
            次のレベルまであと<b>{currentLevel?.endAt - totalStudyTime}</b>分!!!
        </Box>
    );
};

export default Level;
