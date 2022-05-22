export const geolocationActionTypes = {
  SET_CURRENT_LOCATION: "MAIN_PLACES.SET_CURRENT_LOCATION",
  SET_WAS_LOCATION_MAIN: "MAIN_PLACES.SET_WAS_LOCATION_MAIN",
};

export const geolocationPlacesActions = {
  setLocation: (payload) => ({
    type: geolocationActionTypes.SET_CURRENT_LOCATION,
    payload,
  }),
  setWasLocationMain: (payload) => ({
    type: geolocationActionTypes.SET_WAS_LOCATION_MAIN,
    payload,
  }),
  getLocation: () => async (dispatch) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          dispatch(
            geolocationPlacesActions.setLocation({ latitude, longitude })
          );
          dispatch(geolocationPlacesActions.setWasLocationMain(true));
        },
        (err) => {
          dispatch(geolocationPlacesActions.setLocation("geo err"));
          dispatch(geolocationPlacesActions.setWasLocationMain(true));
        }
      );
    } else {
      dispatch(geolocationPlacesActions.setLocation("geo err 1"));
      dispatch(geolocationPlacesActions.setWasLocationMain(true));
    }
  },
};
