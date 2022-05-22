import { infoActionTypes } from "./actions";

const initialState = {
  loading: false,
  name: "",
  email: "",
  subject: "",
  message: "",
  files: null,
};

export const infoReducer = (state = initialState, action) => {
  switch (action.type) {
    case infoActionTypes.SET_NAME:
      return {
        ...state,
        name: action.payload,
      };

    case infoActionTypes.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };

    case infoActionTypes.SET_SUBJECT:
      return {
        ...state,
        subject: action.payload,
      };

    case infoActionTypes.SET_FILES:
      return {
        ...state,
        files: action.payload,
      };

    case infoActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case infoActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};
