import { initialState } from '../pages/_app';

export const reducer = (state, action) => {
    switch (action.type) {
        case 'userSignup':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload,
                },
                users: [...state.users, action.payload],
            };
        case 'userUpdate':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload,
                },
                users: [
                    ...state.users.filter(
                        (user) => user.email !== state.currentUser.email
                    ),
                    {
                        ...state.users.filter(
                            (user) => user.email === state.currentUser.email
                        )[0],
                        ...action.payload,
                    },
                ],
            };
        case 'userSignin':
            return {
                ...state,
                currentUser: { ...action.payload },
            };
        case 'userChangepass':
            return {};
        case 'userSignout':
            return {
                ...state,
                currentUser: initialState.currentUser,
            };
        case 'studySettings':
            return {
                ...state,
                // users: [
                //     ...state.users.filter(
                //         (user) => user.email !== state.currentUser.email
                //     ),
                //     {
                //         ...state.users.filter(
                //             (user) => user.email === state.currentUser.email
                //         )[0],
                //         ...state.users
                //             .filter(
                //                 (user) =>
                //                     user.email === state.currentUser.email
                //             )[0]
                //             .userLog.push(action.payload),
                //     },
                // ],
            };
        case 'studyDelete':
            return {};
        case 'studyModify':
            return {};
        case 'errorEmptyMail':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'email',
                    message: 'メールアドレスが未入力です',
                },
            };
        case 'errorEmptyPassword':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'password',
                    message: 'パスワードが未入力です',
                },
            };
        case 'errorUnmatchPassword':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'passwordConfirm',
                    message: 'パスワードが一致しません',
                },
            };
        case 'errorInvalidEmail':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'email',
                    message: '有効なメールアドレスを入力してください',
                },
            };
        case 'errorInvalidPassword':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'password',
                    message:
                        'パスワードは半角英数字の組み合わせ8-15文字で入力してください',
                },
            };
        case 'errorUnregisteredPassword':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'password',
                    message: 'このメールアドレスは登録されていません',
                },
            };
        case 'errorEmptyUserName':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'userName',
                    message: 'ユーザー名を入力してください',
                },
            };
        case 'errorInvalidInitialTime':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'initialTime',
                    message: '正しい学習時間を入力してください',
                },
            };
        case 'errorOther':
            return {
                ...state,
                error: {
                    isOpened: true,
                    message: action.payload,
                },
            };
        case 'errorClose':
            return {
                ...state,
                error: {
                    isOpened: false,
                    message: '',
                    errorPart: '',
                },
            };
        default:
            return {};
    }
};
