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
        case 'errorOther':
            return {
                ...state,
                error: {
                    isOpened: true,
                    ...action.payload,
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
