import {createReducer, on} from '@ngrx/store';
import {UpdateLoadProgressAction, UpdateMessagesAction, UpdateModalDisplayAction, UpdateThreadsAction} from './actions';
import {Message, ThreadInfo} from '../models/thread.interface';
import {MODAL_STATE} from './state';

const initialMessagesState: Array<Message> = [];
const initialLoadProgressState = 0;
const initialModalsState = MODAL_STATE.EXPLANATION;
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

export const modalDisplayReducer = createReducer(
  initialModalsState,
  on(UpdateModalDisplayAction,
    (state, { modalDisplay }) => {
      return modalDisplay;
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
