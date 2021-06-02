import { Message } from "../models/thread.interface";

export interface AppState {
    messages: Array<Message>;
}

export const initialState: AppState = {
    messages: []
}
