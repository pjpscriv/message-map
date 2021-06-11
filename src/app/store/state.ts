import { Message, ThreadInfo } from '../models/thread.interface';

export interface AppState {
    messages: Array<Message>;
    loadProgress: number;
    threads: Array<ThreadInfo>
}

export const initialState: AppState = {
    messages: [],
    loadProgress: 0,
    threads: []
};
