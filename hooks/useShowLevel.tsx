import { useEffect, useState } from 'react';
import { db } from '../firebase';

type Level = {
    name: string;
    character: string;
    comment: string;
    endAt: number;
};

const useShowLevel = (totalStudyTime: number) => {
    const [currentLevel, setCurrentLevel] = useState<Level>({
        name: '',
        character: '',
        comment: '',
        endAt: 0,
    });

    useEffect(() => {
        (async () => {
            // totalStudyTimeが取得できてない時点では、earlyReturn
            if (!totalStudyTime) return;

            // 条件を満たすdocumentのうち、最初の1件のみを取得
            const fetchedLevel = await db
                .collection('levels')
                .where('endAt', '>', totalStudyTime)
                .orderBy('endAt')
                .limit(1)
                .get();

            setCurrentLevel({
                name: fetchedLevel?.docs[0].id,
                character: fetchedLevel?.docs[0].data().character,
                comment: fetchedLevel?.docs[0].data().comment,
                endAt: fetchedLevel?.docs[0].data().endAt,
            });
        })();
    }, [totalStudyTime]);

    return currentLevel;
};

export default useShowLevel;
