import QUERY from "../../other/query";
import { GET_PLACES, PAGINATOR_INFO } from "../../other/queryData";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const mainPlacesActionTypes = {
  SET_PLACES: "MAIN_PLACES.SET_PLACES",
  CLEAR_PLACES: "MAIN_PLACES.CLEAR_PLACES",
  SET_LOADING: "MAIN_PLACES.SET_LOADING",
  SET_FETCHING: "MAIN_PLACES.SET_FETCHING",
  SET_CURRENT_PAGE: "MAIN_PLACES.SET_CURRENT_PAGE",
  SET_HAS_MORE: "MAIN_PLACES.SET_HAS_MORE",
};

export const mainPlacesActions = {
  setPlaces: (payload) => ({
    type: mainPlacesActionTypes.SET_PLACES,
    payload,
  }),
  clearPlaces: () => ({
    type: mainPlacesActionTypes.CLEAR_PLACES,
  }),
  setLoading: (payload) => ({
    type: mainPlacesActionTypes.SET_LOADING,
    payload,
  }),
  setCurrentPage: (payload) => ({
    type: mainPlacesActionTypes.SET_CURRENT_PAGE,
    payload,
  }),
  setHasMore: (payload) => ({
    type: mainPlacesActionTypes.SET_HAS_MORE,
    payload,
  }),
  setFetching: (payload) => ({
    type: mainPlacesActionTypes.SET_FETCHING,
    payload,
  }),
  fetchPlaces: () => async (dispatch, getState) => {
    dispatch(mainPlacesActions.setLoading(true));

    const { currentCityInfo, currentCategoryInfo, searchString, lng } =
        getState().common,
      { geolocation } = getState().geolocation,
      { currentPage } = getState().mainPlaces;

    QUERY({
      query: `query {
        placesExt(
          first: ${currentPage * 21},
          page: 1, 
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
             } ,
             ${
               !!currentCityInfo.id
                 ? `{column: CITY_ID, operator: EQ, value: ${currentCityInfo.id}}`
                 : ""
             }
          ]
          },
        ) { 
          ${PAGINATOR_INFO} ${GET_PLACES} 
        }
      }`,
    })
      .then((pl) => {
        dispatch(mainPlacesActions.setLoading(false));
        dispatch(mainPlacesActions.setFetching(false));

        if (!pl.errors) {
          dispatch(mainPlacesActions.setPlaces(pl.data.placesExt.data));
          dispatch(mainPlacesActions.setCurrentPage(currentPage + 1));
          dispatch(
            mainPlacesActions.setHasMore(
              pl.data.placesExt.paginatorInfo.hasMorePages
            )
          );
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(mainPlacesActions.setFetching(false));
        dispatch(mainPlacesActions.setLoading(false));
      });
  },
};
