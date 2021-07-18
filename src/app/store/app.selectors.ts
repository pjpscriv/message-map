import {createSelector} from '@ngrx/store';
import {AppState} from './app.state';
import {ThreadMap} from '../models/thread.interface';
import {Message} from '../models/message.interface';

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
  (threads: ThreadMap) => threads
);

export const selectDarkMode = createSelector(
  (state: AppState) => state.darkMode,
  (darkMode: boolean) => darkMode
);
