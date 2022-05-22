import { LOGIN_USER_DATA } from "../../other/queryData";
import QUERY from "../../other/query";
import { listActions } from "../../store/list";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const authActionTypes = {
  SET_AUTH: "AUTH.SET_AUTH",
  SET_LOADING: "AUTH.SET_LOADING",
  LOGOUT: "AUTH.LOGOUT",
  SET_EMAIL: "AUTH.SET_EMAIL",
  SET_PASS: "AUTH.SET_PASS",
};

export const authActions = {
  setAuth: (payload) => ({
    type: authActionTypes.SET_AUTH,
    payload,
  }),
  setLoading: (payload) => ({
    type: authActionTypes.SET_LOADING,
    payload,
  }),
  setEmail: (payload) => ({
    type: authActionTypes.SET_EMAIL,
    payload,
  }),
  setPassword: (payload) => ({
    type: authActionTypes.SET_PASS,
    payload,
  }),
  clearPassword: () => async (dispatch) => {
    dispatch(authActions.setPassword(""));
  },
  logout: () => ({
    type: authActionTypes.LOGOUT,
  }),
  fetchLogin: (email, password) => async (dispatch, getState) => {
    dispatch(authActions.setLoading(true));
    const { lng } = getState().common;

    QUERY({
      query: `mutation {login (input: {username: "${email}", password: "${password}"}){${LOGIN_USER_DATA}}}`,
    })
      .then((data) => {
        if (!data.errors) {
          dispatch(
            authActions.setAuth({
              auth: true,
              token: data.data.login.access_token,
              user: data.data.login.user,
            })
          );
          localStorage.setItem("token", data.data.login.access_token);
          localStorage.setItem("user", JSON.stringify(data.data.login.user));
        } else {
          dispatch(authActions.clearPassword());
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.logpas }));
          console.log(data, "LOGIN ERROR");
        }
        dispatch(authActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.logpas }));
        dispatch(authActions.setLoading(false));
      });
  },
  fetchLogout: () => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(authActions.setLoading(true));
    QUERY({
      query: `mutation { logout{status message} }`,
    })
      .then((data) => {
        if (!data.errors) {
          dispatch(authActions.logout());
          dispatch(listActions.clearPlaces());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          console.log(data, "LOGOUT ERROR");
        }
        dispatch(authActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(authActions.setLoading(false));
      });
  },
};
