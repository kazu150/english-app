import React, { useContext, useState, useEffect, FC } from 'react';
import { MyContext } from '../pages/_app';
import { db } from '../firebase';
import { useRouter } from 'next/router';

type LogOnSubmitPage = {
    englishService: string;
    count: number;
    nationality: string;
};

// 個別Logの編集画面用のデータを取得
const useGetCurrentStudyLog = () => {
    const router = useRouter();
    const { state } = useContext(MyContext);
    const [dbData, setDbData] = useState<LogOnSubmitPage>({
        englishService: '',
        count: null,
        nationality: '',
    });

    useEffect(() => {
        (async () => {
            // userを取得してない場合は処理をせずreturn
            if (state.currentUser.userId === '') return;

            // データをDBから取得済のときは処理をせずreturn
            if (dbData.englishService !== '') return;

            if (router.query.logid?.length) {
                const snapshot = await db
                    .doc(
                        `users/${state.currentUser.userId}/studyLog/${router.query.logid[0]}`
                    )
                    .get();

                setDbData({
                    englishService: snapshot.data().englishService.id,
                    count: Number(snapshot.data().count),
                    nationality: snapshot.data().nationality.id,
                });
            }
        })();
    }, [router.query, state.currentUser.userId]);

    return dbData;
};

export default useGetCurrentStudyLog;
