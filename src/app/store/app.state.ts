import crossfilter from 'crossfilter2';
import { Crossfilter } from '../types/crossfilter.aliases';
import { Message, WebkitFile } from '../types/message.interface';
import { ThreadMap } from '../types/thread.interface';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { EntityAdapter } from '@ngrx/entity/src/models';

export const fileAdapter: EntityAdapter<WebkitFile> = createEntityAdapter<WebkitFile>({
  selectId: f => f.name
});

export interface AppState {
    messageData: Crossfilter<Message>;
    chartData: Crossfilter<Message>;
    fileData: EntityState<WebkitFile>;
    loadProgress: number;
    threads: ThreadMap;
    darkMode: boolean;
}

export const initialState: AppState = {
    messageData: crossfilter([]),
    chartData: crossfilter([]),
    fileData: fileAdapter.getInitialState(),
    loadProgress: 0,
    threads: {},
    darkMode: false
};
