import {createAction, props} from '@ngrx/store';
import {Message, ThreadInfo} from '../models/thread.interface';
import {MODAL_STATE} from './state';

export enum AppActionTypes {
  UPDATE_MESSAGES = '[Messages] Update Messages',
  UPDATE_LOAD_PROGRESS = '[Load Progress] Update Load Progress',
  UPDATE_MODAL_DISPLAY = '[Modal Display] Update Modal Display',
  UPDATE_THREADS = '[Threads] Update Threads'
}

export const UpdateMessagesAction = createAction(
  AppActionTypes.UPDATE_MESSAGES,
  props<{ messages: Array<Message> }>()
);

export const UpdateLoadProgressAction = createAction(
  AppActionTypes.UPDATE_LOAD_PROGRESS,
  props<{ loadProgress: number }>()
);

export const UpdateModalDisplayAction = createAction(
  AppActionTypes.UPDATE_MODAL_DISPLAY,
  props<{ modalDisplay: MODAL_STATE }>()
);

export const UpdateThreadsAction = createAction(
  AppActionTypes.UPDATE_THREADS,
  props<{ threads: Array<ThreadInfo> }>()
)
