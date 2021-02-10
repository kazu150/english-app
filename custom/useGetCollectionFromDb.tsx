import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../pages/_app';
import { db } from '../firebase';

const useGetCollectionFromDb = (collectionName) => {
    const { state } = useContext(MyContext);
    const [dbData, setDbData] = useState([]);

    useEffect(() => {
        (async () => {
            // データをDBから未取得のときのみ発火
            if (!dbData.length) {
                const snapshot = await db.collection(collectionName).get();

                const formedSnapshot = snapshot.docs.map((postDoc) => {
                    return {
                        ...postDoc.data(),
                        id: postDoc.id,
                    };
                });
                setDbData(formedSnapshot);
            }
        })();
    }, [state.currentUser.userId]);

    return dbData;
};

export default useGetCollectionFromDb;
