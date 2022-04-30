import {ParsedMessage} from './message.interface';

export interface ParsedThread {
    // Core
    thread_path: string;
    title: string;
    thread_type: string;
    participants: Array<{name: string}>;
    is_still_participant: boolean;
    // Optional
    messages?: Array<ParsedMessage>;
}

export interface Thread {
    id: string;
    title: string;
    thread_type: string;
    participants: Array<{name: string}>;
    nb_participants: number;
    nb_messages: number;
    is_still_participant: boolean;
    first_message: Date;
    last_message: Date;
}

export type ThreadMap = {
    [threadId: string]: Thread;
};

export interface KeyThreadDates {
  firstMessage: number;
  lastMessage: number;
}
