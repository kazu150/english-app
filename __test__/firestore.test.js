const firebase = require('@firebase/testing');
const fs = require('fs');

const project_id = "my-project-id";
const databaseName = "my-db";

describe("Firestoreのテスト", () => {

    //実行前に一度だけ実行（初期化）
    beforeAll(
        async () => {
            await firebase.loadFirestoreRules({
                projectId: project_id,
                rules: fs.readFileSync('./firestore.rules', 'utf8'),
            });
        }
    );

    //ブロックが終わるたび実行
    afterEach(
        async () => {
            await firebase.clearFirestoreData({ projectId: project_id }); //データリセット
        }
    );

    //終わった後に一度だけ実行
    afterAll(
        async () => {
            await Promise.all(
                firebase.apps().map((app) => app.delete()) //生成したアプリを削除
            );
        }
    );

    //条件(projectIdとauth情報）をの指定を関数化
    //auth : {uid:'alice'}
    //auth : {uid:'alice', admin:true} admin
    //auth : null 未認証
    function authedApp(auth) {
        return firebase.initializeTestApp({
            projectId: project_id,
            databaseName: databaseName,
            auth: auth
        }).firestore();
    }

    describe("usersコレクションのルールテスト", () => {

        test("userの読取り", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await firebase.assertSucceeds(db.collection('users').doc('c05cDZITKVZH5930b6FotWsYLvF3').get());
        })

        test("user,publicProfilesの新規登録", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await firebase.assertSucceeds(db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').set({
                englishService: null,
                initialTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }));
            await firebase.assertSucceeds(db.doc('publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3').set({
                name: '',
                photoUrl: '',
                studyTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }));
        })

        test("間違ったデータでのuser,publicProfilesの新規登録", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await firebase.assertFails(db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').set({
                englishService: null,
                initialTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                hoge: 'aa'
            }));
            await firebase.assertFails(db.doc('publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3').set({
                name: '',
                photoUrl: '',
                studyTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                hoge: 'aa'
            }));
        })

        test("user,publicProfilesの上書き", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await db.doc('publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3').set({
                name: '',
                photoUrl: '',
                studyTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            await db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').set({
                englishService: null,
                initialTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

            await firebase.assertSucceeds(
                db.doc(`users/c05cDZITKVZH5930b6FotWsYLvF3`).update({
                    englishService: db.doc(
                        `englishServices/dmm`
                    ),
                    initialTime: 10000,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            );
            await firebase.assertSucceeds(
                db.doc(`publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3`).update({
                    name: 'testName',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                })
            );
        })

        test("間違ったデータでのuser,publicProfilesの上書き", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await db.doc('publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3').set({
                name: '',
                photoUrl: '',
                studyTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            await db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').set({
                englishService: null,
                initialTime: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })

            await firebase.assertFails(
                db.doc(`users/c05cDZITKVZH5930b6FotWsYLvF3`).update({
                    englishService: db.doc(
                        `englishServices/dmm`
                    ),
                    initialTime: 10000,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    hoge: 1
                })
            );
            await firebase.assertFails(
                db.doc(`publicProfiles/c05cDZITKVZH5930b6FotWsYLvF3`).update({
                    name: 'testName',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    hoge: 1
                })
            );
        })

        test("studyLogの新規登録", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await firebase.assertSucceeds(db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').collection('studyLog').add({
                date: firebase.firestore.FieldValue.serverTimestamp(),
                nationality: db.doc(`nationalities/us`),
                count: 1,
                englishService: db.doc(
                    `englishServices/dmm`
                ),
                time: 25,
            }));
        })

        test("間違ったデータでのstudyLogの新規登録", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "c05cDZITKVZH5930b6FotWsYLvF3"});
            await firebase.assertFails(db.doc('users/c05cDZITKVZH5930b6FotWsYLvF3').collection('studyLog').add({
                date: firebase.firestore.FieldValue.serverTimestamp(),
                nationality: db.doc(`nationalities/us`),
                count: 1,
                englishService: db.doc(
                    `englishServices/dmm`
                ),
                time: 25,
                hoge: 1
            }));
        })


    })

})


// 参考1 https://qiita.com/zaburo/items/e82cff108690eb0493c0
// 参考2 https://zenn.dev/kinmi/articles/firestore-rules-jest