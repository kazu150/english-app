import { State } from '../pages/_app';

export const initialState: State = {
    currentUser: {
        userId: '',
        name: '',
        initialTime: 0,
        service: '',
        studyTime: 0,
        photoUrl: '',
    },
    // users: [
    //     {
    //         userId: '1',
    //         name: 'dummy1',
    //         email: 'a@a.a',
    //         initialTime: 10,
    //         service: 'DMM英会話',
    //         password: 'aaaa1111',
    //         userLog: [
    //             {
    //                 date: 20200101,
    //                 nationality: 'US',
    //                 count: 1,
    //                 service: 'DMM英会話',
    //             },
    //         ],
    //     },
    //     {
    //         userId: '2',
    //         name: 'dummy2',
    //         email: 'b@b.b',
    //         initialTime: 100,
    //         service: 'DMM英会話',
    //         password: 'aaaa1111',
    //         userLog: [
    //             {
    //                 date: 20200101,
    //                 nationality: 'US',
    //                 count: 1,
    //                 service: 'DMM英会話',
    //             },
    //         ],
    //     },
    //     {
    //         userId: '3',
    //         name: 'dummy3',
    //         email: 'c@b.b',
    //         initialTime: 100,
    //         service: 'DMM英会話',
    //         password: 'aaaa1111',
    //         userLog: [
    //             {
    //                 date: 20200101,
    //                 nationality: 'US',
    //                 count: 1,
    //                 service: 'DMM英会話',
    //             },
    //         ],
    //     },
    // ],
    // services: [
    //     {
    //         name: 'DMM英会話',
    //         timePerLesson: 25,
    //     },
    //     {
    //         name: 'レアジョブ',
    //         timePerLesson: 30,
    //     },
    //     {
    //         name: 'ネイティブキャンプ',
    //         timePerLesson: 35,
    //     },
    // ],
    error: {
        isOpened: false,
        message: '',
        errorPart: '',
    },
};
