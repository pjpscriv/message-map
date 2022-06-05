import { createSelector } from '@ngrx/store';
import { Crossfilter } from '../types/crossfilter.aliases';
import { Message, WebkitFile } from '../types/message.interface';
import { ThreadMap } from '../types/thread.interface';
import { AppState } from './app.state';
import { EntityState } from '@ngrx/entity';

export const selectMessageData = createSelector(
  (state: AppState) => state.messageData,
  (messages: Crossfilter<Message>) => messages
);

export const selectChartData = createSelector(
  (state: AppState) => state.chartData,
  (messages: Crossfilter<Message>) => messages
);

export const selectFileData = createSelector(
  (state: AppState) => state.fileData,
  (fileMap: EntityState<WebkitFile>) => fileMap
);

export const selectFileById = (name: string) => createSelector(
  (state: AppState) => state.fileData,
  (fileMap: EntityState<WebkitFile>) => fileMap.entities[name]
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
