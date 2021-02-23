import { useState, useEffect } from 'react';
import { Log } from '../pages/[userId]';
import { db } from '../firebase';
import dayjs from 'dayjs';

const useFetchStudyLog = (userId: string) => {
    const [studyLog, setStudyLog] = useState<Log[]>([]);
    const [totalStudyTime, setTotalStudyTime] = useState(0);

    useEffect(() => {
        let snapshot = null;
        (async () => {
            try {
                // currentUserを読み込むまでは発火させない
                if (userId === '') return;

                // ログインユーザーの状態を監視し、cloudfunctionsでstudyTimeを変更
                snapshot = db
                    .collection('publicProfiles')
                    .doc(userId)
                    .onSnapshot((snapshot) => {
                        setTotalStudyTime(snapshot.data().studyTime);
                    });

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
            } catch (error) {
                console.log(error);
            }
        })();
        return () => {
            // snapshotに関数が代入されていれば、アンマウント時にクリーンアップする
            snapshot && snapshot();
        };
    }, [userId]);

    return { studyLog, setStudyLog, totalStudyTime };
};

export default useFetchStudyLog;
