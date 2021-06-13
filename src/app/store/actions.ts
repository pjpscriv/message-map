import {createAction, props} from '@ngrx/store';
import {MessageAndThread, ThreadInfo} from '../models/thread.interface';

export enum AppActionTypes {
  UPDATE_MESSAGES = '[Messages] Update Messages',
  UPDATE_LOAD_PROGRESS = '[Load Progress] Update Load Progress',
  UPDATE_THREADS = '[Threads] Update Threads',
  ADD_THREAD = '[Threads] Add Thread'
}

export const UpdateMessagesAction = createAction(
  AppActionTypes.UPDATE_MESSAGES,
  props<{ messages: Array<MessageAndThread> }>()
);

export const UpdateLoadProgressAction = createAction(
  AppActionTypes.UPDATE_LOAD_PROGRESS,
  props<{ loadProgress: number }>()
);

export const UpdateThreadsAction = createAction(
  AppActionTypes.UPDATE_THREADS,
  props<{ threads: Array<ThreadInfo> }>()
);

export const AddThreadAction = createAction(
  AppActionTypes.ADD_THREAD,
  props<{ thread: ThreadInfo }>()
);
