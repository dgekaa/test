import { geolocationActionTypes } from "./actions";

const initialState = {
  geolocation: null,
  wasLocationMain: false,
};

export const geolocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case geolocationActionTypes.SET_CURRENT_LOCATION:
      return {
        ...state,
        geolocation: action.payload,
      };

    case geolocationActionTypes.SET_WAS_LOCATION_MAIN:
      return {
        ...state,
        wasLocationMain: action.payload,
      };

    default:
      return state;
  }
};
