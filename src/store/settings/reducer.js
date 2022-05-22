import { settingsActionTypes } from "./actions";

const initialState = {
  loading: false,
  isAddCityPP: false,
  isAddCategoryPP: false,
  isDelCityPP: false,
  isEditCityPP: false,
  isEditCatPP: false,
  isDelCategoryPP: false,
  newCityName: "",
  newCityLatLon: "",
  newCatName: "",
  deleteCityInfo: { name: "", id: "" },
  deleteCategoryInfo: { name: "", id: "" },
  editCityInfo: { name: "", id: "", slug: "", lat: "", lon: "", address: "" },
  editCatInfo: { name: "", id: "", slug: "" },
  places: [],
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case settingsActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case settingsActionTypes.DELETE_CITY_POPUP_INFO:
      return {
        ...state,
        deleteCityInfo: action.payload,
      };

    case settingsActionTypes.SET_PLACES:
      return {
        ...state,
        places: action.payload,
      };

    case settingsActionTypes.DELETE_CATEGORY_POPUP_INFO:
      return {
        ...state,
        deleteCategoryInfo: action.payload,
      };

    case settingsActionTypes.EDIT_CITY_POPUP_INFO:
      return {
        ...state,
        editCityInfo: action.payload,
      };

    case settingsActionTypes.EDIT_CAT_POPUP_INFO:
      return {
        ...state,
        editCatInfo: action.payload,
      };

    case settingsActionTypes.TOGGLE_ADD_CITY_PP:
      return {
        ...state,
        isAddCityPP: action.payload,
      };

    case settingsActionTypes.TOGGLE_ADD_CATEGORY_PP:
      return {
        ...state,
        isAddCategoryPP: action.payload,
      };

    case settingsActionTypes.TOGGLE_DELETE_CITY_PP:
      return {
        ...state,
        isDelCityPP: action.payload,
      };

    case settingsActionTypes.TOGGLE_EDIT_CITY_PP:
      return {
        ...state,
        isEditCityPP: action.payload,
      };

    case settingsActionTypes.TOGGLE_EDIT_CAT_PP:
      return {
        ...state,
        isEditCatPP: action.payload,
      };

    case settingsActionTypes.TOGGLE_DELETE_CATEGORY_PP:
      return {
        ...state,
        isDelCategoryPP: action.payload,
      };

    case settingsActionTypes.SET_NEW_CITY_NAME:
      return {
        ...state,
        newCityName: action.payload,
      };

    case settingsActionTypes.SET_NEW_CATEGORY_NAME:
      return {
        ...state,
        newCatName: action.payload,
      };

    case settingsActionTypes.SET_NEW_CITY_LAT_LON:
      return {
        ...state,
        newCityLatLon: action.payload,
      };

    default:
      return state;
  }
};
