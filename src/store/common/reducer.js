import { commonActionTypes } from "./actions";

const initialState = {
  isLoading: false,
  cities: [],
  categories: [],
  currentCityInfo: { id: null, name: null, lat: null, lon: null },
  currentCategoryInfo: { id: null, name: null, lat: null, lon: null },
  searchString: "",
  isMobSearch: false,
  errors: "",
  ok: false,
  lng: localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "gb",
  languages: ["gb", "pl", "ua"],
  languagesText: ["English", "Polski", "Українська"],
  isCookPP: !localStorage.getItem("isCookPp"),
};

export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case commonActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case commonActionTypes.SET_CITIES:
      return {
        ...state,
        cities: action.payload,
      };

    case commonActionTypes.SET_COOK_PP:
      return {
        ...state,
        isCookPP: action.payload,
      };

    case commonActionTypes.SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };

    case commonActionTypes.SET_OK:
      return {
        ...state,
        ok: action.payload,
      };

    case commonActionTypes.CHANGE_LANG:
      return {
        ...state,
        lng: action.payload,
      };

    case commonActionTypes.SET_IS_MOB_SEARCH:
      return {
        ...state,
        isMobSearch: action.payload,
      };

    case commonActionTypes.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case commonActionTypes.SET_CURRENT_CITY_INFO:
      return {
        ...state,
        currentCityInfo: action.payload,
      };

    case commonActionTypes.SET_CURRENT_CATEGORY_INFO:
      return {
        ...state,
        currentCategoryInfo: action.payload,
      };

    case commonActionTypes.SET_SEARCH_STRING:
      return {
        ...state,
        searchString: action.payload,
      };

    default:
      return state;
  }
};
