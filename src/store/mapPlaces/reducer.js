import { mapPlacesActionTypes } from "./actions";

const initialState = {
  places: [],
  loading: false,
  isWorking: false,
};

export const mapPlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case mapPlacesActionTypes.SET_PLACES:
      return {
        ...state,
        places: action.payload,
      };

    case mapPlacesActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case mapPlacesActionTypes.SET_ISWORKING:
      return {
        ...state,
        isWorking: action.payload,
      };

    default:
      return state;
  }
};
