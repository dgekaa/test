import { mainPlacesActionTypes } from "./actions";

const initialState = {
  places: [],
  loading: false,
  fetching: false,
  currentPage: 1,
  hasMore: true,
};

export const mainPlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case mainPlacesActionTypes.SET_PLACES:
      return {
        ...state,
        places: action.payload,
      };

    case mainPlacesActionTypes.SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload,
      };

    case mainPlacesActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case mainPlacesActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case mainPlacesActionTypes.SET_FETCHING:
      return {
        ...state,
        fetching: action.payload,
      };

    case mainPlacesActionTypes.CLEAR_PLACES:
      return {
        ...state,
        places: [],
        currentPage: 1,
        hasMore: true,
      };

    default:
      return state;
  }
};
