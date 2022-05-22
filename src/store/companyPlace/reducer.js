import { companyPlaceActionTypes } from "./actions";

const initialState = {
  place: null,
  loading: false,
};

export const companyPlaceReducer = (state = initialState, action) => {
  switch (action.type) {
    case companyPlaceActionTypes.SET_PLACE:
      return {
        ...state,
        place: action.payload,
      };

    case companyPlaceActionTypes.CLEAR_PLACE:
      return {
        ...state,
        place: null,
      };

    case companyPlaceActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};
