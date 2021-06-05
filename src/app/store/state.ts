import { Message } from '../models/thread.interface';

export interface AppState {
    messages: Array<Message>;
    loadProgress: number;
    modalDisplay: MODAL_STATE;
}

export enum MODAL_STATE {
  NONE,
  EXPLANATION,
  EXPLORE,
  PROGRESS
}

export const initialState: AppState = {
    messages: [],
    loadProgress: 0,
    modalDisplay: MODAL_STATE.EXPLANATION
};
