import QUERY from "../../other/query";
import { PLACE_DATA_QUERY_FOR_ALIAS_STREAM } from "../../other/queryData";
import { authActions } from "../../store/authenticate";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";
import { curTimeMs } from "../../other/functions";

export const streamActionTypes = {
  SET_LOADING: "STREAM.SET_LOADING",
  SET_PLACE: "STREAM.SET_PLACE",
  CLEAR_PLACE: "STREAM.CLEAR_PLACE",

  TOGGLE_TIME_PP: "STREAM.TOGGLE_TIME_PP",
  SET_TIME_INFO: "STREAM.SET_TIME_INFO",
  SET_SWITCH: "STREAM.SET_SWITCH",
  SET_VOLUME: "STREAM.SET_VOLUME",
  SET_NEW_STREAM_NAME: "STREAM.SET_NEW_STREAM_NAME",
};

export const streamActions = {
  setLoading: (payload) => ({
    type: streamActionTypes.SET_LOADING,
    payload,
  }),
  setPlace: (payload) => ({
    type: streamActionTypes.SET_PLACE,
    payload,
  }),
  setVolume: (payload) => ({
    type: streamActionTypes.SET_VOLUME,
    payload,
  }),
  setNewStreamName: (payload) => ({
    type: streamActionTypes.SET_NEW_STREAM_NAME,
    payload,
  }),
  clearPlace: () => ({
    type: streamActionTypes.CLEAR_PLACE,
  }),
  setSwitch: (payload) => ({
    type: streamActionTypes.SET_SWITCH,
    payload,
  }),
  tglTimePP: (payload) => ({
    type: streamActionTypes.TOGGLE_TIME_PP,
    payload,
  }),
  setTimeInfo: (payload) => ({
    type: streamActionTypes.SET_TIME_INFO,
    payload,
  }),
  fetchUpdateWeekend: (id, num, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateSchedule (input: {id: "${id}", weekend: ${num}} ) { id weekend}
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchUpdateSeeYou: (id, see_you, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateStream (input: {
            id: "${id}", 
            see_you_tomorrow: "${see_you}"
          } ) { id }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchPlace: (alias) => async (dispatch, getState) => {
    const { lng } = getState().common,
      { isSwitch, volume, newStreamName } = getState().stream;

    dispatch(streamActions.setLoading(true));
    QUERY({
      query: `query {
          placeByAlias (alias: "${alias}") {${PLACE_DATA_QUERY_FOR_ALIAS_STREAM} }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          const newSwitch = [...isSwitch],
            newVolume = [...volume],
            newStrName = [...newStreamName];

          place.data.placeByAlias.streams.forEach((str, i) => {
            if (str.see_you_tomorrow) {
              const seeYou = str.see_you_tomorrow,
                seYouMs = new Date(seeYou).getTime();

              newSwitch[i] = seYouMs > curTimeMs();
              dispatch(streamActions.setSwitch(newSwitch));
            } else {
              newSwitch[i] = false;
              dispatch(streamActions.setSwitch(newSwitch));
            }

            newVolume[i] = str.default_sound_volume;
            dispatch(streamActions.setVolume(newVolume));

            newStrName[i] = str.name;
            dispatch(streamActions.setNewStreamName(newStrName));
          });

          dispatch(streamActions.setPlace(place.data.placeByAlias));
        } else {
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
        dispatch(streamActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(streamActions.setLoading(false));
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
      });
  },
  fetchUpdateTime: (alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));

    const {
        timeInfo: { isStart, id, time },
      } = getState().stream,
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
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
        dispatch(streamActions.tglTimePP(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.tglTimePP(false));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchCreateStream: (id, alias) => async (dispatch) => {
    dispatch(streamActions.setLoading(true));

    QUERY({
      query: `mutation {
        createStream( input:{ 
            name: "Name"
            place:{ connect:"${id}"}
            type: ${"RTMP"} 
            default_sound_volume: ${true}
            blur: ${0}
         }) {
            id name url rtmp_url
        }
      }`,
    })
      .then((stream) => {
        if (!stream.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: "Something went wrong" }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(streamActions.setLoading(false));
        dispatch(commonActions.setErr({ ownErr: "Something went wrong" }));
      });
  },
  fetchSeeYou: (id, alias, see_you_tomorrow) => async (dispatch) => {
    dispatch(streamActions.setLoading(true));

    QUERY({
      query: `mutation {
          updateStream( input:{ 
            id: "${id}"
            see_you_tomorrow: "${see_you_tomorrow}"
         }) {
            id name see_you_tomorrow
        }
      }`,
    })
      .then((stream) => {
        if (!stream.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: "Something went wrong" }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: "Something went wrong" }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchDeleteStream: (id, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation { deleteStream(id:"${id}") {id name url rtmp_url}}`,
    })
      .then((stream) => {
        if (!stream.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(streamActions.setLoading(false));
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchUpdateBlur: (id, blur, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateStream (input: {
            id: "${id}", blur: ${blur}
          } ) { id }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchUpdateVolume: (id, vol, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateStream (input: {
            id: "${id}", default_sound_volume: ${vol}
          } ) { id }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
  fetchUpdateStreamName: (id, name, alias) => async (dispatch, getState) => {
    dispatch(streamActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
          updateStream (input: {
            id: "${id}", 
            name: "${name}"
          } ) { id }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(streamActions.fetchPlace(alias));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(streamActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(streamActions.setLoading(false));
      });
  },
};
