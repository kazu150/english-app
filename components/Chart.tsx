import React from 'react';
import { PieChart, Pie, Text } from 'recharts';

const Chart = ({ nationalities, studyLog }) => {
    // 相手国籍ごとの会話時間を算出
    const handleTimeForEachNationality = (nationality) => {
        let totalLogs = 0;

        studyLog
            .filter((log) => log.nationality.id === nationality)
            .forEach((doc) => {
                totalLogs += doc.time;
            });
        return <>{totalLogs}分</>;
    };

    // 相手国籍ごとの会話時間を表示
    const handleNationalities = () => {
        return (
            <>
                {nationalities.length &&
                    nationalities.map((nationality, index) => {
                        return (
                            <li key={index}>
                                {nationality.countryName}:
                                {handleTimeForEachNationality(nationality.id)}
                            </li>
                        );
                    })}
            </>
        );
    };
    return (
        <div>
            <p>
                会話相手の国籍：
                <br />
                {handleNationalities()}
            </p>
        </div>
    );
};

export default Chart;
