const firebase = require('@firebase/testing');
const fs = require('fs');

const project_id = "my-project-id";

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
            // projectId: project_id,
            // auth: auth,
            projectId: "my-test-project",
            auth: auth
        }).firestore();
    }

    describe("usersコレクションのルールテスト", () => {

        //読取りテスト
        test("userの読取り", async () => {
            //条件（uidやprojectId)を指定してdbを生成
            const db = authedApp({ uid: "alice", email: "alice@example.com" });
            //docRefを取得
            const user = db.collection("users").doc();
            //取得ができるか
            // user.get()
            await firebase.assertSucceeds(console.log(user));
        })

        // //書き込みテスト
        // test("userの書き込み", async () => {
        //     //条件（uidやprojectId)を指定してdbを生成
        //     const db = authedApp({ uid: "alice" });
        //     //docRefを取得
        //     const user = db.collection("user").doc("alice");
        //     //書き込みができるか
        //     await firebase.assertSucceeds(
        //         user.set({ text: "hoge" })
        //     );
        // })
    })

})
