import { createSelector } from '@ngrx/store';
import { Crossfilter } from '../models/crossfilter.aliases';
import { Message } from '../models/message.interface';
import { ThreadMap } from '../models/thread.interface';
import { AppState } from './app.state';

export const selectMessages = createSelector(
  (state: AppState) => state.messages,
  (messages: Crossfilter<Message>) => messages
);

export const selectLoadProgress = createSelector(
  (state: AppState) => state.loadProgress,
  (loadProgress: number) => loadProgress
);

export const selectThreads = createSelector(
  (state: AppState) => state.threads,
  (threads: ThreadMap) => threads
);

export const selectDarkMode = createSelector(
  (state: AppState) => state.darkMode,
  (darkMode: boolean) => darkMode
);
