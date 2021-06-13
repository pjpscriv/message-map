import { MessageAndThread, ThreadInfo } from '../models/thread.interface';

export interface AppState {
    messages: Array<MessageAndThread>;
    loadProgress: number;
    threads: Array<ThreadInfo>
}

export const initialState: AppState = {
    messages: [],
    loadProgress: 0,
    threads: []
};
