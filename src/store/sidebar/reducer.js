import { sidebarActionTypes } from "./actions";

const initialState = {
  sidebar: false,
};

export const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case sidebarActionTypes.SHOW_SIDEBAR:
      return {
        ...state,
        sidebar: true,
      };

    case sidebarActionTypes.HIDE_SIDEBAR:
      return {
        ...state,
        sidebar: false,
      };

    default:
      return state;
  }
};
