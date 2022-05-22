import QUERY from "../../other/query";
import { GET_PLACES } from "../../other/queryData";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const mapPlacesActionTypes = {
  SET_PLACES: "MAP_PLACES.SET_PLACES",
  SET_LOADING: "MAP_PLACES.SET_LOADING",
  SET_ISWORKING: "MAP_PLACES.SET_ISWORKING",
};

export const mapPlacesActions = {
  setPlaces: (payload) => ({
    type: mapPlacesActionTypes.SET_PLACES,
    payload,
  }),
  setLoading: (payload) => ({
    type: mapPlacesActionTypes.SET_LOADING,
    payload,
  }),
  setIsWorking: (payload) => ({
    type: mapPlacesActionTypes.SET_ISWORKING,
    payload,
  }),
  fetchPlaces: (bool) => async (dispatch, getState) => {
    dispatch(mapPlacesActions.setLoading(true));

    const { currentCityInfo, currentCategoryInfo, searchString, lng } =
        getState().common,
      { geolocation } = getState().geolocation,
      { isWorking } = getState().mapPlaces;

    QUERY({
      query: `query {
          placesExt(
            first: 300, 
            ${
              !!geolocation.latitude
                ? `client_coordinates: "${geolocation.latitude},${geolocation.longitude}"`
                : ""
            } 
            where: { 
              AND : [
                {column: NAME, operator: LIKE, value: "%${searchString}%"},
               ${
                 !!currentCategoryInfo.id
                   ? `{column: CATEGORY_IDS, operator: LIKE, value: "%[${currentCategoryInfo.id}]%"}`
                   : ""
               },
               ${
                 !!currentCityInfo.id
                   ? `{column: CITY_ID, operator: EQ, value: ${currentCityInfo.id}}`
                   : ""
               },
               ${
                 !bool && isWorking
                   ? `{column: IS_WORK, operator: EQ, value: ${true}}`
                   : ""
               }

               ${
                 bool && !isWorking
                   ? `{column: IS_WORK, operator: EQ, value: ${!isWorking}}`
                   : ""
               }
              ]
            },
          ) { 
            ${GET_PLACES} 
          }
        }`,
    })
      .then((places) => {
        dispatch(mapPlacesActions.setLoading(false));
        if (!places.errors) {
          bool && dispatch(mapPlacesActions.setIsWorking(!isWorking));
          dispatch(mapPlacesActions.setPlaces(places.data.placesExt.data));
          dispatch(mapPlacesActions.setLoading(false));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(mapPlacesActions.setLoading(false));
      });
  },
};
