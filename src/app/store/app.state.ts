import crossfilter from 'crossfilter2';
import { Crossfilter } from '../types/crossfilter.aliases';
import { Message } from '../types/message.interface';
import { ThreadMap } from '../types/thread.interface';

export interface AppState {
    messages: Crossfilter<Message>;
    loadProgress: number;
    threads: ThreadMap;
    darkMode: boolean;
}

export const initialState: AppState = {
    messages: crossfilter([]),
    loadProgress: 0,
    threads: {},
    darkMode: false
};
