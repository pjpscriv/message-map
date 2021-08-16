import crossfilter from 'crossfilter2';
import { Crossfilter } from '../models/crossfilter.aliases';
import { Message } from '../models/message.interface';
import { ThreadMap } from '../models/thread.interface';

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
