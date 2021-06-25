import { createReducer, on } from '@ngrx/store';
import * as assert from 'assert';
import { Message, Thread, ThreadMap } from '../models/thread.interface';
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
    (oldThreadMap, { threads }) => {
      const newThreadMap = {};
      Object.values(oldThreadMap).forEach(thread => addThread(thread, newThreadMap));
      threads.forEach(thread => addThread(thread, newThreadMap));
      return newThreadMap;
    }
  )
);

function addThread(thread: Thread, threads: ThreadMap): void {
  if (threads[thread.id]) {
    console.log('Duplicate', thread.id, thread.title);
    const oldThread = threads[thread.id];
    const newThread = Object.assign({}, thread);
    newThread.nb_messsages += oldThread.nb_messsages;
    threads[oldThread.id] = newThread;
  } else {
    threads[thread.id] = thread;
  }
}
