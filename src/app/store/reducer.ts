import { ActionReducerMap, createReducer, on } from '@ngrx/store';
import { AppState, initialState } from "./state";
import { UpdateMessagesAction, AppActions, AppActionTypes } from './actions';

// export const reducers: ActionReducerMap<AppState> = {
//   messages: appReducer
// };


// export const reducer = createReducer(
//   initialState,
//   on(UpdateMessagesAction,
//     (state, { updatedValue }) => ({ ...state, messages: updatedValue })
//   ),



export function appReducer(state: AppState = initialState, action: AppActions): AppState {
  switch (action.type) {
    case AppActionTypes.UPDATE_MESSAGES:
      console.log('Update messages recieved!');
      return { messages: action.payload.messages };

    default:
      console.log("default thing called")
      return {
        messages: [{
          sender_name: "DEFAULT",
          timestamp: null,
          timestamp_ms: null,
          type: "message",
          photos: null,
          videos: null,
          files: null,
          media: "",
          content: "Hello World!",
          message: "It's a me",
          length: "8",
          reactions: []
        }]
      };
  }
}