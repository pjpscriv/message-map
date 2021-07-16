import { Message, ThreadMap } from '../models/thread.interface';

export interface AppState {
    messages: Array<Message>;
    loadProgress: number;
    threads: ThreadMap;
    darkMode: boolean;
}

export const initialState: AppState = {
    messages: [],
    loadProgress: 0,
    threads: {},
    darkMode: false
};
