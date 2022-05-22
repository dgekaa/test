import { workSchActionTypes } from "./actions";

const initialState = {
  loading: false,
  place: null,
  isTimePP: false,
  timeInfo: { isStart: false, id: null, time: null, day: null },
};

export const workSchReducer = (state = initialState, action) => {
  switch (action.type) {
    case workSchActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case workSchActionTypes.SET_PLACE:
      return {
        ...state,
        place: action.payload,
      };

    case workSchActionTypes.TOGGLE_TIME_PP:
      return {
        ...state,
        isTimePP: action.payload,
      };

    case workSchActionTypes.SET_TIME_INFO:
      return {
        ...state,
        timeInfo: action.payload,
      };

    case workSchActionTypes.CLEAR_PLACE:
      return {
        ...state,
        place: null,
      };

    default:
      return state;
  }
};
