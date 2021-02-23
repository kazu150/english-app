import React, { useContext, useState, useEffect, FC } from 'react';
import { MyContext } from '../pages/_app';
import { db } from '../firebase';
import { AppProps } from 'next/app';

export type Nationalities = {
    id?: string;
    countryName?: string;
};
export type EnglishServices = {
    id?: string;
    defaultTime?: number;
    serviceName?: string;
};

const useGetCollectionFromDb = <T,>(collectionName): T[] => {
    const { state } = useContext(MyContext);
    const [dbData, setDbData] = useState([]);

    useEffect(() => {
        (async () => {
            // userを取得してない場合は処理をせずreturn
            if (state.currentUser.userId === '') return;

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
