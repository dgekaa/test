import QUERY from "../../other/query";
import { PLACE_DATA_QUERY_FOR_ALIAS_WORK_SCH } from "../../other/queryData";
import { authActions } from "../../store/authenticate";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const workSchActionTypes = {
  SET_LOADING: "WORK_SCH.LOADING",
  SET_PLACE: "WORK_SCH.SET_PLACE",
  CLEAR_PLACE: "WORK_SCH.CLEAR_PLACE",

  TOGGLE_TIME_PP: "WORK_SCH.TOGGLE_TIME_PP",
  SET_TIME_INFO: "WORK_SCH.SET_TIME_INFO",
};

export const workSchActions = {
  setLoading: (payload) => ({
    type: workSchActionTypes.SET_LOADING,
    payload,
  }),
  setPlace: (payload) => ({
    type: workSchActionTypes.SET_PLACE,
    payload,
  }),
  clearPlace: () => ({
    type: workSchActionTypes.CLEAR_PLACE,
  }),
  tglTimePP: (payload) => ({
    type: workSchActionTypes.TOGGLE_TIME_PP,
    payload,
  }),
  setTimeInfo: (payload) => ({
    type: workSchActionTypes.SET_TIME_INFO,
    payload,
  }),
  fetchPlace: (alias) => async (dispatch, getState) => {
    dispatch(workSchActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `query {
          placeByAlias (alias: "${alias}") {${PLACE_DATA_QUERY_FOR_ALIAS_WORK_SCH} }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(workSchActions.setPlace(place.data.placeByAlias));
        } else {
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
        dispatch(workSchActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(workSchActions.setLoading(false));
      });
  },
  fetchUpdateWeekend: (id, num, alias) => async (dispatch, getState) => {
    dispatch(workSchActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateSchedule (input: {id: "${id}", weekend: ${num}} ) { id weekend}
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(workSchActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(workSchActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(workSchActions.setLoading(false));
      });
  },
  fetchUpdateTime: (alias) => async (dispatch, getState) => {
    dispatch(workSchActions.setLoading(true));

    const {
        timeInfo: { isStart, id, time },
      } = getState().workSch,
      { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateSchedule (input: {
            id: "${id}", 
            ${isStart ? `start_time: "${time}"` : `end_time: "${time}"`}
          } ) { id weekend start_time }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(workSchActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(workSchActions.setLoading(false));
        }
        dispatch(workSchActions.tglTimePP(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(workSchActions.tglTimePP(false));
        dispatch(workSchActions.setLoading(false));
      });
  },
};
