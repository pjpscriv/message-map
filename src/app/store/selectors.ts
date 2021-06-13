import {createSelector} from '@ngrx/store';
import {AppState} from './state';
import {MessageAndThread, ThreadInfo} from '../models/thread.interface';

export const selectMessages = createSelector(
  (state: AppState) => state.messages,
  (messages: Array<MessageAndThread>) => messages
);

export const selectLoadProgress = createSelector(
  (state: AppState) => state.loadProgress,
  (loadProgress: number) => loadProgress
);

export const selectThreads = createSelector(
  (state: AppState) => state.threads,
  (threads: Array<ThreadInfo>) => threads
);
