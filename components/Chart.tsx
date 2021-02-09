import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Text, Cell } from 'recharts';

const Chart = ({ nationalities, studyLog }) => {
    const [chartData, setChartData] = useState([]);
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
    const data = [
        {
            index: 0,
            name: 'データ1',
            value: 300,
        },
        {
            index: 1,
            name: 'データ2',
            value: 200,
        },
        {
            index: 2,
            name: 'データ3',
            value: 380,
        },
        {
            index: 3,
            name: 'データ3',
            value: 80,
        },
        {
            index: 4,
            name: 'データ4',
            value: 40,
        },
    ];

    const colors = [
        '#3f51b5',
        '#2196f3',
        '#03a9f4',
        '#00bcd4',
        '#4caf50',
        '#8bc34a',
    ];

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
        </div>
    );
};

export default Chart;
