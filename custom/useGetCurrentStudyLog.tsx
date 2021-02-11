import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../pages/_app';
import { db } from '../firebase';
import { useRouter } from 'next/router';

// 個別Logの編集画面用のデータを取得
const useGetCurrentStudyLog = () => {
    const router = useRouter();
    const { state } = useContext(MyContext);
    const [dbData, setDbData] = useState({
        englishService: '',
        count: null,
        nationality: '',
    });

    useEffect(() => {
        (async () => {
            // データをDBから未取得のときのみ発火
            if (dbData.englishService === '') {
                if (router.query.logid?.length && state.currentUser.userId) {
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
            }
        })();
    }, [router.query, state.currentUser.userId]);

    return dbData;
};

export default useGetCurrentStudyLog;
