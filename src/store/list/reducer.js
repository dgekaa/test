import { listActionTypes } from "./actions";

const initialState = {
  places: null,
  loading: false,
  isAddPlacePP: false,
  newPlaceName: "",
  newPlaceAlias: "",
  addUserEmail: "",
  addUserPass: "",
  isOnOffPP: false,
  isAddUserPP: false,
  onOffPlaceInfo: { name: "", id: "", disabled: false },
  addUserInfo: { name: "", id: "", disabled: false, user: {} },
  isDeletePP: false,
  delPlaceInfo: { id: "", name: "" },
  isOldUser: false,
};

export const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case listActionTypes.SET_PLACES:
      return {
        ...state,
        places: action.payload,
      };

    case listActionTypes.CLEAR_PLACES:
      return {
        ...state,
        places: null,
      };

    case listActionTypes.TOGGLE_ADD_PLACE_PP:
      return {
        ...state,
        isAddPlacePP: action.payload,
      };

    case listActionTypes.SET_IS_OLD_USER:
      return {
        ...state,
        isOldUser: action.payload,
      };

    case listActionTypes.TOGGLE_ON_OFF_PP:
      return {
        ...state,
        isOnOffPP: action.payload,
      };

    case listActionTypes.TOGGLE_ADD_USER_PP:
      return {
        ...state,
        isAddUserPP: action.payload,
      };

    case listActionTypes.TOGGLE_DELETE_PP:
      return {
        ...state,
        isDeletePP: action.payload,
      };

    case listActionTypes.ON_OFF_POPUP_COMPANY_INFO:
      return {
        ...state,
        onOffPlaceInfo: action.payload,
      };

    case listActionTypes.ADD_USER_POPUP_INFO:
      return {
        ...state,
        addUserInfo: action.payload,
      };

    case listActionTypes.DELETE_POPUP_COMPANY_INFO:
      return {
        ...state,
        delPlaceInfo: action.payload,
      };

    case listActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case listActionTypes.SET_NEW_PLACE_NAME:
      return {
        ...state,
        newPlaceName: action.payload,
      };

    case listActionTypes.SET_NEW_PLACE_ALIAS:
      return {
        ...state,
        newPlaceAlias: action.payload,
      };

    case listActionTypes.SET_ADD_USER_EMAIL:
      return {
        ...state,
        addUserEmail: action.payload,
      };

    case listActionTypes.SET_ADD_USER_PASSWORD:
      return {
        ...state,
        addUserPass: action.payload,
      };

    default:
      return state;
  }
};
