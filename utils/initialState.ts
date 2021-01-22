import { State } from '../pages/_app';

export const initialState: State = {
    currentUser: {
        userId: '',
        name: '',
        initialTime: 0,
        englishService: '',
        studyTime: 0,
        photoUrl: '',
    },
    error: {
        isOpened: false,
        message: '',
        errorPart: '',
    },
};
