import { useContext, useState, useEffect } from 'react';
import { MyContext } from '../pages/_app';
import { db } from '../firebase';

const useGetDataFromDb = (collectionName) => {
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

    console.log(dbData);
    return dbData;
};

export default useGetDataFromDb;
