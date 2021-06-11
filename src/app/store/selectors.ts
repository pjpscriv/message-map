import {createSelector} from '@ngrx/store';
import {AppState} from './state';
import {Message, ThreadInfo} from '../models/thread.interface';

export const selectMessages = createSelector(
  (state: AppState) => state.messages,
  (messages: Array<Message>) => messages
);

export const selectLoadProgress = createSelector(
  (state: AppState) => state.loadProgress,
  (loadProgress: number) => loadProgress
);

export const selectThreads = createSelector(
  (state: AppState) => state.threads,
  (threads: Array<ThreadInfo>) => threads
);
