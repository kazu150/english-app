import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const sendResponse = (
    response: functions.Response,
    statusCode: number,
    body: any
) => {
    response.send({
        statusCode,
        body: JSON.stringify(body),
    });
};

/**
 * firebaseにLevelsデータセットを登録する
 * 下記コマンドにて、firestore内のlevels_collectionの中身を上書き
 * curl -X POST https://asia-northeast1-englishapp-ab9b0.cloudfunctions.net/addLevelsDataset -H "Content-Type:application/json" -d @levelsDataset.json
 */

export const addLevelsDataset = functions
    .region('asia-northeast1')
    .https.onRequest(async (req: any, res: any) => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, { error: 'Invalid Request' });
        } else {
            const dataset = req.body;
            for (const key of Object.keys(dataset)) {
                const data = dataset[key];
                await db.collection('levels').doc(key).set(data);
            }
            sendResponse(res, 200, {
                message: '✨✨✨ Successfully added dataset! ✨✨✨',
            });
        }
    });

export const sumUpStudyTimeOnChangeInitialTime = functions
    .region('asia-northeast1')
    .firestore.document('users/{uid}')
    .onUpdate(async (change, context) => {
        if (
            change.before.data().initialTime !== change.after.data().initialTime
        ) {
            const newInitialTime = Number(change.after.data().initialTime);
            const currentInitialTime = Number(change.before.data().initialTime);

            try {
                const publicProfile = await db
                    .collection('publicProfiles')
                    .doc(context.params.uid)
                    .get();
                const currentStudyTime =
                    Number(publicProfile.data()?.studyTime) || 0;

                await db
                    .collection('publicProfiles')
                    .doc(context.params.uid)
                    .update({
                        studyTime:
                            currentStudyTime -
                            currentInitialTime +
                            newInitialTime,
                    });
            } catch (error) {
                // console.log('エラー内容：', error);
            }
        }
    });

export const sumUpStudyTimeOnWriteStudyLog = functions
    .region('asia-northeast1')
    .firestore.document('users/{uid}/studyLog/{id}')
    .onWrite(async (change, context) => {
        try {
            const studyLogs = await db
                .collection('users')
                .doc(context.params.uid)
                .collection('studyLog')
                .where('time', '>=', 0)
                .get();

            let totalLogs = 0;
            studyLogs.forEach((doc) => {
                totalLogs += doc.data().time;
            });

            const user = await db
                .collection('users')
                .doc(context.params.uid)
                .get();

            const currentInitialTime = Number(user.data()?.initialTime) || 0;

            await db
                .collection('publicProfiles')
                .doc(context.params.uid)
                .update({
                    studyTime: totalLogs + currentInitialTime,
                });
        } catch (error) {
            // console.log('エラー内容：', error);
        }
    });
