import { Action } from '@ngrx/store';
import { Message } from '../models/thread.interface';

export enum AppActionTypes {
    UPDATE_MESSAGES = '[Messages] Update Messages',
  }

export class UpdateMessagesAction implements Action {
    readonly type = AppActionTypes.UPDATE_MESSAGES;

    constructor(readonly payload: { messages: Array<Message> }) {}
  }

export type AppActions =
  | UpdateMessagesAction;
