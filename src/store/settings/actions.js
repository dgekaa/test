import QUERY from "../../other/query";
import { commonActions } from "../common";
import { txt } from "../../other/constants";
import { GET_SETTINGS_PLACES } from "../../other/queryData/places";

export const settingsActionTypes = {
  SET_LOADING: "SETTINGS.SET_LOADING",

  TOGGLE_ADD_CITY_PP: "SETTINGS.TOGGLE_ADD_CITY_PP",
  TOGGLE_ADD_CATEGORY_PP: "SETTINGS.TOGGLE_ADD_CATEGORY_PP",
  SET_NEW_CITY_NAME: "SETTINGS.SET_NEW_CITY_NAME",
  SET_NEW_CATEGORY_NAME: "SETTINGS.SET_NEW_CATEGORY_NAME",
  SET_NEW_CITY_LAT_LON: "SETTINGS.SET_NEW_CITY_LAT_LON",

  TOGGLE_DELETE_CITY_PP: "SETTINGS.TOGGLE_DELETE_CITY_PP",
  TOGGLE_DELETE_CATEGORY_PP: "SETTINGS.TOGGLE_DELETE_CATEGORY_PP",
  TOGGLE_EDIT_CITY_PP: "SETTINGS.TOGGLE_EDIT_CITY_PP",
  TOGGLE_EDIT_CAT_PP: "SETTINGS.TOGGLE_EDIT_CAT_PP",

  DELETE_CITY_POPUP_INFO: "SETTINGS.DELETE_CITY_POPUP_INFO",
  DELETE_CATEGORY_POPUP_INFO: "SETTINGS.DELETE_CATEGORY_POPUP_INFO",
  EDIT_CITY_POPUP_INFO: "SETTINGS.EDIT_CITY_POPUP_INFO",
  EDIT_CAT_POPUP_INFO: "SETTINGS.EDIT_CAT_POPUP_INFO",

  SET_PLACES: "SETTINGS.SET_PLACES",
};

export const settingsActions = {
  setLoading: (payload) => ({
    type: settingsActionTypes.SET_LOADING,
    payload,
  }),
  tglAddCityPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_ADD_CITY_PP,
    payload,
  }),
  tglAddCategoryPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_ADD_CATEGORY_PP,
    payload,
  }),
  tglDelCityPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_DELETE_CITY_PP,
    payload,
  }),
  tglEditCityPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_EDIT_CITY_PP,
    payload,
  }),
  tglEditCatPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_EDIT_CAT_PP,
    payload,
  }),
  tglDelCategoryPP: (payload) => ({
    type: settingsActionTypes.TOGGLE_DELETE_CATEGORY_PP,
    payload,
  }),
  setNewCityName: (payload) => ({
    type: settingsActionTypes.SET_NEW_CITY_NAME,
    payload,
  }),
  setNewCatName: (payload) => ({
    type: settingsActionTypes.SET_NEW_CATEGORY_NAME,
    payload,
  }),
  setNewCityLatLon: (payload) => ({
    type: settingsActionTypes.SET_NEW_CITY_LAT_LON,
    payload,
  }),
  setDelCityPPInfo: (payload) => ({
    type: settingsActionTypes.DELETE_CITY_POPUP_INFO,
    payload,
  }),
  setDelCategoryPPInfo: (payload) => ({
    type: settingsActionTypes.DELETE_CATEGORY_POPUP_INFO,
    payload,
  }),
  editCityPPInfo: (payload) => ({
    type: settingsActionTypes.EDIT_CITY_POPUP_INFO,
    payload,
  }),
  editCatPPInfo: (payload) => ({
    type: settingsActionTypes.EDIT_CAT_POPUP_INFO,
    payload,
  }),
  setPlaces: (payload) => ({
    type: settingsActionTypes.SET_PLACES,
    payload,
  }),
  clearNewCityData: () => async (dispatch) => {
    dispatch(settingsActions.setNewCityName(""));
    dispatch(settingsActions.setNewCityLatLon(""));
  },
  clearNewCatData: () => async (dispatch) => {
    dispatch(settingsActions.setNewCatName(""));
  },
  clearDelCityPPInfo: () => async (dispatch) => {
    dispatch(settingsActions.setDelCityPPInfo({ id: "", name: "" }));
  },
  clearEditCityPPInfo: () => async (dispatch) => {
    dispatch(
      settingsActions.editCityPPInfo({
        name: "",
        id: "",
        slug: "",
        lat: "",
        lon: "",
      })
    );
  },
  clearEditCatPPInfo: () => async (dispatch) => {
    dispatch(
      settingsActions.editCatPPInfo({
        name: "",
        id: "",
        slug: "",
      })
    );
  },
  clearDelCatPPInfo: () => async (dispatch) => {
    dispatch(settingsActions.setDelCategoryPPInfo({ id: "", name: "" }));
  },
  fetchAddCity: (name, coords) => async (dispatch, getState) => {
    const { lng } = getState().common;

    if (name && coords) {
      dispatch(settingsActions.setLoading(true));
      const lat = coords.split(";")[0],
        lon = coords.split(";")[1];

      QUERY({
        query: `mutation {
        createCity(input:{
          name: "${name.replace(/"/g, "'")}", 
          lat: ${lat},lon: ${lon}, 
          address: "default address"})
        {id name lat lon slug}
    }`,
      })
        .then((place) => {
          if (!place.errors) {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
            dispatch(commonActions.setOk(true));
            dispatch(settingsActions.clearNewCityData());
            dispatch(settingsActions.tglAddCityPP(false));
            dispatch(commonActions.fetchCities(false));
          } else {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          }
          dispatch(settingsActions.setLoading(false));
        })
        .catch((err) => {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(settingsActions.setLoading(false));
        });
    }
  },
  fetchAddCategory: (name) => async (dispatch, getState) => {
    const { lng } = getState().common;

    if (name) {
      dispatch(settingsActions.setLoading(true));

      QUERY({
        query: `mutation {createCategory(input:{
          name: "${name.replace(/"/g, "'")}"
        }){id name slug}}`,
      })
        .then((place) => {
          if (!place.errors) {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
            dispatch(commonActions.setOk(true));
            dispatch(settingsActions.clearNewCatData());
            dispatch(settingsActions.tglAddCategoryPP(false));
            dispatch(commonActions.fetchCategories(false));
          } else {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          }
          dispatch(settingsActions.setLoading(false));
        })
        .catch((err) => {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(settingsActions.setLoading(false));
        });
    }
  },
  fetchDelCity: (id) => async (dispatch, getState) => {
    dispatch(settingsActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({ query: `mutation {deleteCity(id:${id}){id name}}` })
      .then((place) => {
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(settingsActions.clearDelCityPPInfo());
          dispatch(settingsActions.tglDelCityPP(false));
          dispatch(commonActions.fetchCities(false));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
        dispatch(settingsActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(settingsActions.setLoading(false));
      });
  },
  fetchEditCity:
    (id, name, slug, lat, lon, address) => async (dispatch, getState) => {
      const { lng } = getState().common;
      if (
        id &&
        name &&
        slug &&
        (lat || lat === 0) &&
        (lon || lon === 0) &&
        address
      ) {
        dispatch(settingsActions.setLoading(true));

        QUERY({
          query: `mutation {updateCity(input:{
          id:${+id}, 
          name:"${name.replace(/"/g, "'")}", 
          slug:"${slug.replace(/"/g, "'")}", 
          lat:${lat}, lon:${lon}, 
          address:"${address.replace(/"/g, "'")}"
        }){id name}}`,
        })
          .then((city) => {
            if (!city.errors) {
              dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
              dispatch(commonActions.setOk(true));
              dispatch(settingsActions.clearEditCityPPInfo());
              dispatch(settingsActions.tglEditCityPP(false));
              dispatch(commonActions.fetchCities(false));
            } else {
              dispatch(
                commonActions.setErr({ ownErr: txt[lng].err.something })
              );
            }
            dispatch(settingsActions.setLoading(false));
          })
          .catch((err) => {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
            dispatch(settingsActions.setLoading(false));
          });
      }
    },
  fetchEditCat: (id, name, slug) => async (dispatch, getState) => {
    const { lng } = getState().common;

    if (id && name && slug) {
      dispatch(settingsActions.setLoading(true));

      QUERY({
        query: `mutation {updateCategory(input:{id:${+id}, 
          name:"${name.replace(/"/g, "'")}", 
          slug:"${slug.replace(/"/g, "'")}"}){id name}}`,
      })
        .then((cat) => {
          if (!cat.errors) {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
            dispatch(commonActions.setOk(true));
            dispatch(settingsActions.clearEditCatPPInfo());
            dispatch(settingsActions.tglEditCatPP(false));
            dispatch(commonActions.fetchCategories(false));
          } else {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          }
          dispatch(settingsActions.setLoading(false));
        })
        .catch((err) => {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(settingsActions.setLoading(false));
        });
    }
  },
  fetchDelCategory: (id) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(settingsActions.setLoading(true));

    QUERY({ query: `mutation {deleteCategory(id:${id}){id name}}` })
      .then((place) => {
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(settingsActions.clearDelCatPPInfo());
          dispatch(settingsActions.tglDelCategoryPP(false));
          dispatch(commonActions.fetchCategories());
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
        dispatch(settingsActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(settingsActions.setLoading(false));
      });
  },
  fetchPlaces: (id, isCat) => async (dispatch, getState) => {
    dispatch(settingsActions.setLoading(true));

    const { lng } = getState().common;

    QUERY({
      query: `query {
            placesExt(
              where: { AND :
                ${
                  !isCat
                    ? `{column: CITY_ID, operator: EQ, value: ${id}}`
                    : `{column: CATEGORY_IDS, operator: LIKE, value: "%[${id}]%"}`
                },
              }
            )
              {${GET_SETTINGS_PLACES}}
          }`,
    })
      .then((places) => {
        dispatch(settingsActions.setLoading(false));
        if (!places.errors) {
          dispatch(settingsActions.setPlaces(places.data.placesExt.data));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(settingsActions.setLoading(false));
      });
  },
};
