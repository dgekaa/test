import QUERY from "../../other/query";
import { txt } from "../../other/constants";

export const commonActionTypes = {
  SET_LOADING: "COMMON.SET_LOADING",
  SET_CITIES: "COMMON.SET_CITIES",
  SET_CATEGORIES: "COMMON.SET_CATEGORIES",
  SET_CURRENT_CITY_INFO: "COMMON.SET_CURRENT_CITY_INFO",
  SET_CURRENT_CATEGORY_INFO: "COMMON.SET_CURRENT_CATEGORY_INFO",
  SET_SEARCH_STRING: "COMMON.SET_SEARCH_STRING",
  SET_IS_MOB_SEARCH: "COMMON.SET_IS_MOB_SEARCH",
  SET_ERRORS: "COMMON.SET_ERRORS",
  SET_OK: "COMMON.SET_OK",
  CHANGE_LANG: "COMMON.CHANGE_LANG",
  SET_COOK_PP: "COMMON.SET_COOK_PP",
};

export const commonActions = {
  setLoading: (payload) => ({
    type: commonActionTypes.SET_LOADING,
    payload,
  }),
  setCities: (payload) => ({
    type: commonActionTypes.SET_CITIES,
    payload,
  }),
  setCategories: (payload) => ({
    type: commonActionTypes.SET_CATEGORIES,
    payload,
  }),
  setIsMobSearch: (payload) => ({
    type: commonActionTypes.SET_IS_MOB_SEARCH,
    payload,
  }),
  setCookPp: (payload) => ({
    type: commonActionTypes.SET_COOK_PP,
    payload,
  }),
  setErrors: (payload) => ({
    type: commonActionTypes.SET_ERRORS,
    payload,
  }),
  setOk: (payload) => ({
    type: commonActionTypes.SET_OK,
    payload,
  }),
  changeLang: (payload) => ({
    type: commonActionTypes.CHANGE_LANG,
    payload,
  }),
  setCurrentCityInfo: (payload) => ({
    type: commonActionTypes.SET_CURRENT_CITY_INFO,
    payload,
  }),
  setCurrentCategoryInfo: (payload) => ({
    type: commonActionTypes.SET_CURRENT_CATEGORY_INFO,
    payload,
  }),
  setSearchString: (payload) => ({
    type: commonActionTypes.SET_SEARCH_STRING,
    payload,
  }),
  setErr: (err) => async (dispatch) => {
    dispatch(commonActions.setErrors(""));
    dispatch(commonActions.setErrors(err));
    setTimeout(() => {
      dispatch(commonActions.setErrors(""));
      dispatch(commonActions.setOk(false));
    }, 2000);
  },
  fetchCities: (firstLoad) => async (dispatch, getState) => {
    const { lng } = getState().common;
    dispatch(commonActions.setLoading(true));

    QUERY({
      query: `query {cities {id name slug lat lon address}}`,
    })
      .then((cities) => {
        if (!cities.errors) {
          const { id, name, lat, lon } = cities.data.cities[0];
          dispatch(commonActions.setCities(cities.data.cities));

          const url = decodeURIComponent(window.location.pathname),
            cacheCity = localStorage.getItem("city")
              ? JSON.parse(localStorage.getItem("city"))
              : null,
            cityData = firstLoad && cacheCity ? cacheCity : null;

          if (cityData && url.split("/")[1] !== "map") {
            dispatch(commonActions.setCurrentCityInfo(cityData));
          } else if (url.split("/")[1] === "map") {
            const id = url.split("/")[4],
              name = url.split("/")[5],
              lat = url.split("/")[2].split(";")[0],
              lon = url.split("/")[2].split(";")[1];

            dispatch(commonActions.setCurrentCityInfo({ id, name, lat, lon }));
          } else {
            dispatch(commonActions.setCurrentCityInfo({ id, name, lat, lon }));
          }

          if (!firstLoad) {
            dispatch(commonActions.setLoading(false));
          } else {
            dispatch(commonActions.fetchCategories());
          }
        } else {
          dispatch(commonActions.setLoading(false));
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(commonActions.setLoading(false));
      });
  },
  fetchCategories: () => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(commonActions.setLoading(true));
    QUERY({
      query: `query {categories {id name slug}}`,
    })
      .then((categories) => {
        if (!categories.errors) {
          dispatch(commonActions.setCategories(categories.data.categories));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
        dispatch(commonActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setLoading(false));
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
      });
  },
};
