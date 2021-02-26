import { useState, useEffect } from 'react';
import { Log } from '../pages/[userId]';
import { db } from '../firebase';
import firebase from 'firebase/app';
import dayjs from 'dayjs';
import { isSameMonth } from '../utils/calendar';

const useFetchStudyLog = (
    userId: string,
    initialTime: number,
    currentLogs: Log[],
    setCurrentLogs: React.Dispatch<React.SetStateAction<Log[]>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const [studyLog, setStudyLog] = useState<Log[]>([]);
    const [totalStudyTime, setTotalStudyTime] = useState(0);
    const [monthlyStudyTime, setMonthlyStudyTime] = useState(0);
    const [myRank, setMyRank] = useState(0);
    const [totalUser, setTotalUser] = useState(0);

    useEffect(() => {
        let usersSnapshot = null;
        (async () => {
            try {
                // currentUserを読み込むまでは発火させない
                if (userId === '') return;

                // myRankを取得
                usersSnapshot = db
                    .collection('publicProfiles')
                    .orderBy('studyTime', 'desc')
                    .onSnapshot((snapshot) => {
                        const userRank = snapshot.docs.findIndex(
                            ({ id }) => id === userId
                        );
                        setMyRank(userRank + 1);

                        setTotalUser(snapshot.docs.length);
                    });

                // totalUserを取得

                // studyLogを取得
                const studyLogs = await db
                    .collection('users')
                    .doc(userId)
                    .collection('studyLog')
                    .get();

                setStudyLog(
                    studyLogs.docs.map((log) => {
                        return {
                            ...log.data(),
                            id: log.id,
                            date: dayjs(log.data().date.toDate()),
                        };
                    })
                );

                // totalStudyTime (initialTime + 全studyLog)を取得
                const publicProfile = await db
                    .collection('users')
                    .doc(userId)
                    .get();

                const initialTime = publicProfile.data().initialTime;

                let totalLogs = 0;
                studyLogs.docs.forEach((doc) => {
                    totalLogs += doc.data().time;
                });

                setTotalStudyTime(totalLogs + initialTime);

                // DB上のstudyTimeも上書き
                await db
                    .collection('publicProfiles')
                    .doc(userId)
                    .update({
                        studyTime: totalLogs + initialTime,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    });

                // monthlyStudyTime (全studyLogのうち今月分)をローカルにて計算
                let logsOnCurrentMonth = 0;
                studyLogs.docs
                    .filter((doc) => {
                        // studyLogsの中から、当月のlogを抜き出し
                        return isSameMonth(
                            dayjs(new Date()),
                            dayjs(doc.data().date.toDate())
                        );
                    })
                    .forEach((doc) => {
                        // 当月のlogを積算
                        logsOnCurrentMonth += doc.data().time;
                    });
                setMonthlyStudyTime(logsOnCurrentMonth);
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            // snapshotに関数が代入されていれば、アンマウント時にクリーンアップする
            usersSnapshot && usersSnapshot();
        };
    }, [userId, initialTime]);

    const onDeleteClick = async (id: string) => {
        try {
            await db
                .collection('users')
                .doc(userId)
                .collection('studyLog')
                .doc(id)
                .delete();

            const newStudyLog = studyLog.filter((log) => {
                return log.id !== id;
            });
            setStudyLog(newStudyLog);

            const newCurrentLogs = currentLogs.filter((log) => {
                return log.id !== id;
            });
            setCurrentLogs(newCurrentLogs);
            !newCurrentLogs.length && setOpen(false);
        } catch (error) {
            console.log(error);
        }
    };

    return {
        studyLog,
        totalStudyTime,
        monthlyStudyTime,
        myRank,
        totalUser,
        onDeleteClick,
    };
};

export default useFetchStudyLog;
