import { createReducer, on } from '@ngrx/store';
import { Message, ThreadMap } from '../models/thread.interface';
import { UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from './app.actions';

const initialMessagesState: Array<Message> = [];
const initialLoadProgressState = 0;
const initialThreadsState: ThreadMap = {};

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
  )
  // on(AddThreadAction,
  //   (threads, { thread }) => [...threads, thread])
);
