import { authActionTypes } from "./actions";

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  loading: false,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : false,
  email: "",
  password: "",
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authActionTypes.SET_AUTH:
      return {
        ...state,
        isAuthenticated: action.payload.auth,
        token: action.payload.token,
        user: action.payload.user,
      };

    case authActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: false,
        user: false,
      };

    case authActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case authActionTypes.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };

    case authActionTypes.SET_PASS:
      return {
        ...state,
        password: action.payload,
      };

    default:
      return state;
  }
};
