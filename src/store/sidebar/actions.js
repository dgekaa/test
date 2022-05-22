export const sidebarActionTypes = {
  SHOW_SIDEBAR: "SIDEBAR.SHOW_SIDEBAR",
  HIDE_SIDEBAR: "SIDEBAR.HIDE_SIDEBAR",
};

export const sidebarActions = {
  showSidebar: (payload) => ({
    type: sidebarActionTypes.SHOW_SIDEBAR,
    payload,
  }),
  hideSidebar: (payload) => ({
    type: sidebarActionTypes.HIDE_SIDEBAR,
    payload,
  }),
};
