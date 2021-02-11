import { initialState } from './initialState';
import { State } from '../pages/_app';

export type Action =
    | { type: 'userSignup'; payload: object }
    | { type: 'userUpdate'; payload: object }
    | { type: 'userSignin'; payload: object }
    | { type: 'userChangepass' }
    | { type: 'userSignout' }
    | { type: 'studyRegister' }
    | { type: 'studyUpdate' }
    | { type: 'studySettings' }
    | { type: 'studyDelete' }
    | { type: 'studyModify' }
    | { type: 'errorEmptyMail' }
    | { type: 'errorEmptyPassword' }
    | { type: 'errorUnmatchPassword' }
    | { type: 'errorInvalidEmail' }
    | { type: 'errorInvalidPassword' }
    | { type: 'errorUnregisteredPassword' }
    | { type: 'errorEmptyname' }
    | { type: 'errorInvalidInitialTime' }
    | { type: 'errorOther'; payload: string }
    | { type: 'errorClose' };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'userSignup':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload,
                },
            };
        case 'userUpdate':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload,
                },
            };
        case 'userSignin':
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload,
                },
            };
        case 'userChangepass':
            return {
                ...state,
            };
        case 'userSignout':
            return {
                ...state,
                currentUser: initialState.currentUser,
            };
        case 'studyRegister':
            return { ...state };
        case 'studyUpdate':
            return { ...state };
        case 'studySettings':
            return { ...state };
        case 'studyDelete':
            return { ...state };
        case 'studyModify':
            return { ...state };
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
        case 'errorEmptyname':
            return {
                ...state,
                error: {
                    isOpened: true,
                    errorPart: 'name',
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
                    errorPart: '',
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
            return { ...state };
    }
};
