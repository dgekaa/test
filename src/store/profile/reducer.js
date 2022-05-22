import { profileActionTypes } from "./actions";

const initialState = {
  loading: false,
  place: null,
  imgSrc: null,
  isMapPP: false,
  isNewImage: false,
  isCatPP: false,
  isCityPP: false,
  address: "",
  coords: "",
  social: [],
  isNewSocial: true,
  imgDesc: "",
  isSwitch: false,
};

export const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case profileActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case profileActionTypes.SET_PLACE:
      return {
        ...state,
        place: action.payload,
      };

    case profileActionTypes.SET_IS_NEW_SOCIAL:
      return {
        ...state,
        isNewSocial: action.payload,
      };

    case profileActionTypes.SET_IMG_SRC:
      return {
        ...state,
        imgSrc: action.payload,
      };

    case profileActionTypes.SET_SWITCH:
      return {
        ...state,
        isSwitch: action.payload,
      };

    case profileActionTypes.SET_SOCIAL:
      return {
        ...state,
        social: action.payload,
      };

    case profileActionTypes.SET_NAME:
      return {
        ...state,
        place: { ...state.place, name: action.payload },
      };

    case profileActionTypes.SET_ALIAS:
      return {
        ...state,
        place: { ...state.place, alias: action.payload },
      };

    case profileActionTypes.SET_DESC:
      return {
        ...state,
        place: { ...state.place, description: action.payload },
      };

    case profileActionTypes.SET_IMG_DESC:
      return {
        ...state,
        imgDesc: action.payload,
      };

    case profileActionTypes.SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };

    case profileActionTypes.SET_COORDS:
      return {
        ...state,
        coords: action.payload,
      };

    case profileActionTypes.UPDATE_PLACE:
      return {
        ...state,
        place: action.payload,
      };

    case profileActionTypes.CLEAR_PLACE:
      return {
        ...state,
        place: null,
      };

    case profileActionTypes.TOGGLE_MAP_PP:
      return {
        ...state,
        isMapPP: action.payload,
      };

    case profileActionTypes.SET_IMAGE:
      return {
        ...state,
        isNewImage: action.payload,
      };

    case profileActionTypes.TOGGLE_CAT_PP:
      return {
        ...state,
        isCatPP: action.payload,
      };

    case profileActionTypes.TOGGLE_CITY_PP:
      return {
        ...state,
        isCityPP: action.payload,
      };

    default:
      return state;
  }
};
