import {createAction, props} from '@ngrx/store';
import {Thread } from '../types/thread.interface';
import {Message, WebkitFile} from '../types/message.interface';
import {Crossfilter} from '../types/crossfilter.aliases';

export enum AppActionTypes {
  UPDATE_MESSAGES       = '[Messages] Update Messages',
  UPDATE_MESSAGE_FILTER = '[Messages] Update Message Filter',
  UPDATE_FILES          = '[Files] Update Files',
  UPDATE_LOAD_PROGRESS  = '[Load Progress] Update Load Progress',
  ADD_THREAD            = '[Threads] Add Thread',
  UPDATE_THREADS        = '[Threads] Update Threads',
  UPDATE_DARK_MODE      = '[Dark Mode] Update Dark Mode',
  TOGGLE_DARK_MODE      = '[Dark Mode] Toggle Dark Mode',
}

export const UpdateMessagesAction = createAction(
  AppActionTypes.UPDATE_MESSAGES,
  props<{ messages: Array<Message> }>()
);

export const UpdateMessageFilterAction = createAction(
  AppActionTypes.UPDATE_MESSAGE_FILTER,
  props<{ messageFilter: Crossfilter<Message> }>()
);

export const UpdateFilesAction = createAction(
  AppActionTypes.UPDATE_FILES,
  props<{ files: Map<string, WebkitFile> }>()
);

export const UpdateLoadProgressAction = createAction(
  AppActionTypes.UPDATE_LOAD_PROGRESS,
  props<{ loadProgress: number }>()
);

export const AddThreadAction = createAction(
  AppActionTypes.ADD_THREAD,
  props<{ thread: Thread }>()
);

export const UpdateThreadsAction = createAction(
  AppActionTypes.UPDATE_THREADS,
  props<{ threads: Array<Thread> }>()
);

export const UpdateDarkModeAction = createAction(
  AppActionTypes.UPDATE_DARK_MODE,
  props<{ darkMode: boolean }>()
);

export const ToggleDarkModeAction = createAction(
  AppActionTypes.TOGGLE_DARK_MODE
);


