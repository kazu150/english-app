import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

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

const Level = () => {
    const classes = useStyles();

    return (
        <Box className={classes.levelDescription} p={2} mb={3}>
            <span className={classes.levelIcon}>🐹</span>
            あなたは<b>ハムスター</b>レベル！
            <br />
            次のレベルまであと<b>300</b>分
        </Box>
    );
};

export default Level;
