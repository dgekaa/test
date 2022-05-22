import { streamActionTypes } from "./actions";

const initialState = {
  loading: false,
  place: null,

  isTimePP: false,
  timeInfo: { isStart: false, id: null, time: null, day: null },
  isSwitch: [],
  volume: [],
  newStreamName: [],
};

export const streamReducer = (state = initialState, action) => {
  switch (action.type) {
    case streamActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case streamActionTypes.SET_PLACE:
      return {
        ...state,
        place: action.payload,
      };

    case streamActionTypes.SET_NEW_STREAM_NAME:
      return {
        ...state,
        newStreamName: action.payload,
      };

    case streamActionTypes.SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
      };

    case streamActionTypes.CLEAR_PLACE:
      return {
        ...state,
        place: null,
      };

    case streamActionTypes.SET_SWITCH:
      return {
        ...state,
        isSwitch: action.payload,
      };

    case streamActionTypes.TOGGLE_TIME_PP:
      return {
        ...state,
        isTimePP: action.payload,
      };

    case streamActionTypes.SET_TIME_INFO:
      return {
        ...state,
        timeInfo: action.payload,
      };

    default:
      return state;
  }
};
