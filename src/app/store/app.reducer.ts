import { createReducer, on } from '@ngrx/store';
import crossfilter from 'crossfilter2';
import { Thread, ThreadMap } from '../models/thread.interface';
import { AddThreadAction, UpdateDarkModeAction, UpdateLoadProgressAction, UpdateMessagesAction, UpdateThreadsAction } from './app.actions';
import { initialState } from './app.state';


export const messagesReducer = createReducer(
  initialState.messages,
  on(UpdateMessagesAction,
    (existingMessages, { messages }) => {
      return crossfilter(messages);
    }
  )
);

export const loadProgressReducer = createReducer(
  initialState.loadProgress,
  on(UpdateLoadProgressAction,
    (oldProgress, { loadProgress }) => {
      return loadProgress;
    }
  )
);

export const threadsReducer = createReducer(
  initialState.threads,
  on(UpdateThreadsAction,
    (oldThreadMap, { threads }) => {
      const newThreadMap = {};
      threads.forEach(thread => addThread(thread, newThreadMap));
      return newThreadMap;
    }
  ),
  on(AddThreadAction,
    (oldThreadMap, { thread }) => {
      const newThreadMap = {};
      Object.values(oldThreadMap).forEach(oldThread => addThread(oldThread, newThreadMap));
      addThread(thread, newThreadMap);
      return newThreadMap;
    }
  )
);

export const darkModeReducer = createReducer(
  initialState.darkMode,
  on(UpdateDarkModeAction,
    (oldDarkMode, { darkMode }) => {
      return darkMode;
    }
  )
);

function addThread(thread: Thread, threads: ThreadMap): void {
  if (!threads[thread.id]) {
    threads[thread.id] = thread;
  } else {
    const oldThread = threads[thread.id];
    const newThread = Object.assign({}, thread);
    newThread.nb_messages += oldThread.nb_messages;
    newThread.first_message = oldThread.first_message < newThread.first_message ? oldThread.first_message : newThread.first_message;
    newThread.last_message = oldThread.first_message > newThread.first_message ? oldThread.first_message : newThread.first_message;
    threads[oldThread.id] = newThread;
  }
}
