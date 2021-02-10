import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Text, Cell } from 'recharts';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const colors = [
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#4caf50',
    '#8bc34a',
];

const useStyles = makeStyles((theme) => ({
    chartDescription: {
        backgroundColor: '#b3e5fc',
        borderRadius: '5px',
        textAlign: 'center',
    },
}));

const Chart = ({ nationalities, studyLog }) => {
    const [chartData, setChartData] = useState([]);
    const classes = useStyles();
    // 相手国籍ごとの会話時間を算出
    const handleTimeForEachNationality = (nationality) => {
        let totalLogs = 0;

        studyLog
            .filter((log) => log.nationality.id === nationality)
            .forEach((doc) => {
                totalLogs += doc.time;
            });
        return totalLogs;
    };

    const label = ({ name, value, cx, x, y }) => {
        return (
            <>
                {/* 引数で付属情報を受け取れます */}
                <Text x={x} y={y} fill="#000">
                    {name}
                </Text>
                <Text x={x} y={y} dominantBaseline="hanging" fill="#000">
                    {`${value}分`}
                </Text>
            </>
        );
    };
    // 相手国籍ごとの会話時間を表示
    const handleNationalities = () => {
        const array = [];
        nationalities.length &&
            nationalities.map((nationality, index) => {
                array.push({
                    index: index,
                    name: nationality.countryName,
                    value: handleTimeForEachNationality(nationality.id),
                });
            });

        return array;
    };
    return (
        <div>
            <p>会話相手の国籍</p>
            <PieChart width={400} height={300}>
                <Pie
                    dataKey="value"
                    data={handleNationalities()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    label={label}
                >
                    {handleNationalities().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>
            </PieChart>
            <Box className={classes.chartDescription} p={2} mb={3}>
                なるべくいろんな国の英語に触れて、
                <br />
                総合的な英語力を向上させよう！
            </Box>
        </div>
    );
};

export default Chart;
