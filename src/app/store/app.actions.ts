import {createAction, props} from '@ngrx/store';
import {Message, Thread } from '../models/thread.interface';

export enum AppActionTypes {
  UPDATE_MESSAGES = '[Messages] Update Messages',
  UPDATE_LOAD_PROGRESS = '[Load Progress] Update Load Progress',
  UPDATE_THREADS = '[Threads] Update Threads',
  UPDATE_DARK_MODE = '[Dark Mode] Update Dark Mode',
  ADD_THREAD = '[Threads] Add Thread'
}

export const UpdateMessagesAction = createAction(
  AppActionTypes.UPDATE_MESSAGES,
  props<{ messages: Array<Message> }>()
);

export const UpdateLoadProgressAction = createAction(
  AppActionTypes.UPDATE_LOAD_PROGRESS,
  props<{ loadProgress: number }>()
);

export const UpdateThreadsAction = createAction(
  AppActionTypes.UPDATE_THREADS,
  props<{ threads: Array<Thread> }>()
);

export const UpdateDarkModeAction = createAction(
  AppActionTypes.UPDATE_DARK_MODE,
  props<{ darkMode: boolean }>()
);

export const AddThreadAction = createAction(
  AppActionTypes.ADD_THREAD,
  props<{ thread: Thread }>()
);
