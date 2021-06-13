import { createReducer, on } from '@ngrx/store';
import { MessageAndThread, ThreadInfo } from '../models/thread.interface';
import { AddThreadAction, UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from './actions';

const initialMessagesState: Array<MessageAndThread> = [];
const initialLoadProgressState = 0;
const initialThreadsState: Array<ThreadInfo> = [];

export const messagesReducer = createReducer(
  initialMessagesState,
  on(UpdateMessagesAction,
    (existingMessages, { messages }) => {
      return [...existingMessages, ...messages];
    }
  )
);

export const loadProgressReducer = createReducer(
  initialLoadProgressState,
  on(UpdateLoadProgressAction,
    (oldProgress, { loadProgress }) => {
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
  ),
  on(AddThreadAction,
    (threads, { thread }) => [...threads, thread])
);
