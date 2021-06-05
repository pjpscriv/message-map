import {createReducer, on} from '@ngrx/store';
import {UpdateLoadProgressAction, UpdateMessagesAction, UpdateModalDisplayAction} from './actions';
import {Message} from '../models/thread.interface';
import {MODAL_STATE} from './state';

const initialMessagesState: Array<Message> = [];
const initialLoadProgressState = 0;
const initialModalsState = MODAL_STATE.EXPLANATION;

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
