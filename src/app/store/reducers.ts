import { createReducer, on } from '@ngrx/store';
import { Message, ThreadInfo } from '../models/thread.interface';
import { UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from './actions';

const initialMessagesState: Array<Message> = [];
const initialLoadProgressState = 0;
const initialThreadsState: Array<ThreadInfo> = [];

export const messagesReducer = createReducer(
  initialMessagesState,
  on(UpdateMessagesAction,
    (state, { messages }) => {
      return { ...state, messages };
    }
  )
);

export const loadProgressReducer = createReducer(
  initialLoadProgressState,
  on(UpdateLoadProgressAction,
    (state, { loadProgress }) => {
      return loadProgress;
    }
  )
);

export const threadsReducer = createReducer(
  initialThreadsState,
  on(UpdateThreadsAction,
    (state, { threads }) => {
      return threads;
    }
  )
);
