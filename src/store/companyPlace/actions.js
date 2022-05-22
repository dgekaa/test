import { PLACE_EXT_DATA_QUERY_FOR_ALIAS } from "../../other/queryData";
import QUERY from "../../other/query";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const companyPlaceActionTypes = {
  SET_PLACE: "COMPANY_PLACE.SET_PLACES",
  SET_LOADING: "COMPANY_PLACE.SET_LOADING",
  CLEAR_PLACE: "COMPANY_PLACE.CLEAR_PLACE",
};

export const companyPlaceActions = {
  setPlace: (payload) => ({
    type: companyPlaceActionTypes.SET_PLACE,
    payload,
  }),
  clearPlace: () => ({
    type: companyPlaceActionTypes.CLEAR_PLACE,
  }),
  setLoading: (payload) => ({
    type: companyPlaceActionTypes.SET_LOADING,
    payload,
  }),
  fetchPlaceByAlias: (alias) => async (dispatch, getState) => {
    const { lng } = getState().common;
    dispatch(companyPlaceActions.setLoading(true));
    QUERY({
      query: `query {
          placeExtByAlias (alias: "${alias}") {${PLACE_EXT_DATA_QUERY_FOR_ALIAS} }
        }`,
    })
      .then((place) => {
        dispatch(companyPlaceActions.setLoading(false));
        if (!place.errors) {
          dispatch(companyPlaceActions.setPlace(place.data.placeExtByAlias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(companyPlaceActions.setLoading(false));
      });
  },
  fetchPlace: (alias) => async (dispatch, getState) => {
    const { lng } = getState().common;
    dispatch(companyPlaceActions.setLoading(true));
    QUERY({
      query: `query {
          placeExt (id: ${alias}) {${PLACE_EXT_DATA_QUERY_FOR_ALIAS} }
        }`,
    })
      .then((place) => {
        dispatch(companyPlaceActions.setLoading(false));
        if (!place.errors) {
          dispatch(companyPlaceActions.setPlace(place.data.placeExt));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(companyPlaceActions.setLoading(false));
      });
  },
};
