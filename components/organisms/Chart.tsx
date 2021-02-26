import React, { FC, useState, useEffect } from 'react';
import { PieChart, Pie, Text, Cell, ResponsiveContainer } from 'recharts';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Log } from '../../pages/[userId]';
import { Nationalities } from '../../hooks/useGetCollectionFromDb';

const colors = [
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#4caf50',
    '#8bc34a',
];

const useStyles = makeStyles((theme: Theme) => ({
    chartWrapper: {
        width: 'auto',
        height: '300px',
    },
    chartDescription: {
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        textAlign: 'center',
    },
}));

type Props = {
    nationalities: Nationalities[];
    studyLog: Log[];
};

const Chart: FC<Props> = ({ nationalities, studyLog }) => {
    const classes = useStyles();
    const [nationalityData, setNationalityData] = useState([]);

    // 相手国籍ごとの会話時間を算出
    const handleTimeForEachNationality = (nationalityId: string): number => {
        let totalLogs = 0;

        studyLog
            .filter((log) => log.nationality.id === nationalityId)
            .forEach((doc) => {
                totalLogs += doc.time;
            });
        return totalLogs;
    };

    // 相手国籍ごとの会話時間を表示
    useEffect(() => {
        const array = [];
        nationalities.length &&
            nationalities.map((nationality, index) => {
                array.push({
                    index: index,
                    name: nationality.countryName,
                    value: handleTimeForEachNationality(nationality.id),
                });
            });
        setNationalityData(array);
        return;
    }, [studyLog]);

    const label = ({ name, value, cx, x, y }) => {
        if (!value) return;
        return (
            <>
                <Text x={x} y={y} fill="#000">
                    {name}
                </Text>
                <Text x={x} y={y} dominantBaseline="hanging" fill="#000">
                    {`${value}分`}
                </Text>
            </>
        );
    };

    useEffect(() => {
        label;
    });

    return (
        <div>
            <p>会話相手の国籍</p>
            <div className={classes.chartWrapper}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            dataKey="value"
                            data={nationalityData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={50}
                            label={label}
                        >
                            {nationalityData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Box className={classes.chartDescription} p={2} mb={3}>
                なるべくいろんな国の英語に触れて、
                <br />
                総合的な英語力を向上させよう！
            </Box>
        </div>
    );
};

export default Chart;
