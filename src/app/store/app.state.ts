import crossfilter from 'crossfilter2';
import { Crossfilter } from '../types/crossfilter.aliases';
import {Message, WebkitFile} from '../types/message.interface';
import { ThreadMap } from '../types/thread.interface';

export interface AppState {
    messageData: Crossfilter<Message>;
    chartData: Crossfilter<Message>;
    fileData: Map<string, WebkitFile>;
    loadProgress: number;
    threads: ThreadMap;
    darkMode: boolean;
}

export const initialState: AppState = {
    messageData: crossfilter([]),
    chartData: crossfilter([]),
    fileData: new Map<string, WebkitFile>(),
    loadProgress: 0,
    threads: {},
    darkMode: false
};
