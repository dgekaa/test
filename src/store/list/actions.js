import { GET_CLIENT_PLACES, GET_ADMIN_PLACES } from "../../other/queryData";
import QUERY from "../../other/query";
import { authActions } from "../../store/authenticate";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const listActionTypes = {
  SET_PLACES: "LIST.SET_PLACES",
  SET_LOADING: "LIST.SET_LOADING",
  CLEAR_PLACES: "LIST.CLEAR_PLACES",
  CREATE_NEW: "LIST.CREATE_NEW",

  TOGGLE_ADD_PLACE_PP: "LIST.TOGGLE_ADD_PLACE_PP",
  TOGGLE_ON_OFF_PP: "LIST.TOGGLE_ON_OFF_PP",
  TOGGLE_ADD_USER_PP: "LIST.TOGGLE_ADD_USER_PP",
  TOGGLE_DELETE_PP: "LIST.TOGGLE_DELETE_PP",

  SET_NEW_PLACE_NAME: "LIST.SET_NEW_PLACE_NAME",
  SET_NEW_PLACE_ALIAS: "LIST.SET_NEW_PLACE_ALIAS",
  SET_ADD_USER_EMAIL: "LIST.SET_ADD_USER_EMAIL",
  SET_ADD_USER_PASSWORD: "LIST.SET_ADD_USER_PASSWORD",
  SET_IS_OLD_USER: "LIST.SET_IS_OLD_USER",

  ON_OFF_POPUP_COMPANY_INFO: "LIST.ON_OFF_POPUP_COMPANY_INFO",
  ADD_USER_POPUP_INFO: "LIST.ADD_USER_POPUP_INFO",
  DELETE_POPUP_COMPANY_INFO: "LIST.DELETE_POPUP_COMPANY_INFO",
};

export const listActions = {
  setPlaces: (payload) => ({
    type: listActionTypes.SET_PLACES,
    payload,
  }),
  clearPlaces: () => ({
    type: listActionTypes.CLEAR_PLACES,
  }),
  setLoading: (payload) => ({
    type: listActionTypes.SET_LOADING,
    payload,
  }),

  setIsOldUser: (payload) => ({
    type: listActionTypes.SET_IS_OLD_USER,
    payload,
  }),

  tglAddPlacePP: (payload) => ({
    type: listActionTypes.TOGGLE_ADD_PLACE_PP,
    payload,
  }),

  tglOnOffPP: (payload) => ({
    type: listActionTypes.TOGGLE_ON_OFF_PP,
    payload,
  }),
  tglAddUserPP: (payload) => ({
    type: listActionTypes.TOGGLE_ADD_USER_PP,
    payload,
  }),
  tglDelPlacePP: (payload) => ({
    type: listActionTypes.TOGGLE_DELETE_PP,
    payload,
  }),

  setOnOffPPInfo: (payload) => ({
    type: listActionTypes.ON_OFF_POPUP_COMPANY_INFO,
    payload,
  }),
  setAddUserPPInfo: (payload) => ({
    type: listActionTypes.ADD_USER_POPUP_INFO,
    payload,
  }),
  setDelPPPlaceInfo: (payload) => ({
    type: listActionTypes.DELETE_POPUP_COMPANY_INFO,
    payload,
  }),

  createNew: () => ({
    type: listActionTypes.CREATE_NEW,
  }),
  setNewPlaceName: (payload) => ({
    type: listActionTypes.SET_NEW_PLACE_NAME,
    payload,
  }),
  setNewPlaceAlias: (payload) => ({
    type: listActionTypes.SET_NEW_PLACE_ALIAS,
    payload,
  }),
  setAddUserEmail: (payload) => ({
    type: listActionTypes.SET_ADD_USER_EMAIL,
    payload,
  }),
  setAddUserPass: (payload) => ({
    type: listActionTypes.SET_ADD_USER_PASSWORD,
    payload,
  }),
  fetchAdminPlaces: () => async (dispatch, getState) => {
    dispatch(listActions.setLoading(true));

    const { currentCityInfo, searchString, lng } = getState().common;

    QUERY({
      query: `query {
            places(first : 100 , orderBy: [{ column: CREATED_AT, order: DESC }]
              where: { AND : [
                {column: NAME, operator: LIKE, value: "%${searchString}%"},
                ${
                  !!currentCityInfo.id
                    ? `{column: CITY_ID, operator: EQ, value: ${currentCityInfo.id}}`
                    : ""
                },
              ]}
            )
              {${GET_ADMIN_PLACES}}
          }`,
    })
      .then((places) => {
        dispatch(listActions.setLoading(false));
        if (!places.errors) {
          dispatch(listActions.setPlaces(places.data.places.data));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchAddPlace: (name, alias) => async (dispatch, getState) => {
    dispatch(listActions.setLoading(true));

    const { cities, categories, lng } = getState().common;

    QUERY({
      query: `mutation {
        createPlace(
          input:{
            name: "${name.replace(/"/g, "'")}",
            address: "${cities[0].address}",
            description: "",
            lat: ${cities[0].lat},
            lon: ${cities[0].lon},
            alias: "${alias.replace(/"/g, "'")}",
            categories:{
              connect: ${categories[0].id}
            },
            city_id: ${cities[0].id},
            disabled:${true}
          }){id name address description lat lon categories{slug} city{id name slug}}        
    }`,
    })
      .then((place) => {
        dispatch(listActions.setLoading(false));
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(listActions.setNewPlaceName(""));
          dispatch(listActions.setNewPlaceAlias(""));
          dispatch(listActions.tglAddPlacePP(false));
          dispatch(listActions.fetchAdminPlaces());
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  sendMailFrom: (subject, message, email) => async (dispatch, getState) => {
    const { lng } = getState().common;

    QUERY({
      query: `mutation {
                sendMail(input:{
                    name: "",
                    subject: "${subject.replace(/"/g, "'")}", 
                    message: "${message
                      .replace(/"/g, "'")
                      .replace(/\n/g, "\\n")}",
                    email_to: "${email}",
                })
        }`,
    })
      .then((place) => {
        if (!place.errors && place.data.sendMail) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(listActions.fetchAdminPlaces());
          dispatch(listActions.tglAddUserPP(false));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(listActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchAddUser: (email, pass, placeId) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(listActions.setLoading(true));

    QUERY({
      query: `mutation {
        register(input:{
          name: "${email}",
          email: "${email}",
          type: ${"client"},
          password: "${pass}", 
          password_confirmation: "${pass}"
        })
        {status tokens{user{id type name email }}}        
    }`,
    })
      .then((user) => {
        if (!user.errors) {
          QUERY({
            query: `mutation {
                updatePlace(input:{ id:"${placeId}" user_id: ${user.data.register.tokens.user.id}})
                {id disabled name}
            }`,
          })
            .then((data) => {
              if (!data.errors) {
                dispatch(listActions.setAddUserEmail(""));
                dispatch(listActions.setAddUserPass(""));
                dispatch(listActions.tglAddUserPP(false));

                dispatch(
                  listActions.sendMailFrom(
                    "Adding an admin account",
                    `Your account has been successfully registered for the establishment '${data.data.updatePlace.name}'.<br/><br/>
                     <b>Login:</b> ${email}<br/>
                     <b>Password:</b> ${pass}<br/><br/>
                     Go to the site ... and change the settings for yourself.<br/>
                     Have a good time =)`,
                    email
                  )
                );
              } else {
                dispatch(
                  commonActions.setErr({ ownErr: txt[lng].err.something })
                );
                dispatch(listActions.setLoading(false));
              }
            })
            .catch((err) => {
              dispatch(
                commonActions.setErr({ ownErr: txt[lng].err.something })
              );
              dispatch(listActions.setLoading(false));
            });
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.olduser }));
          dispatch(listActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchAddOldUser:
    (email, placeId, placeName) => async (dispatch, getState) => {
      const { lng } = getState().common;

      dispatch(listActions.setLoading(true));

      QUERY({
        query: `query {
        userByEmail(email: "${email}")
        {id}        
    }`,
      })
        .then((user) => {
          if (user.data.userByEmail) {
            if (!user.errors) {
              QUERY({
                query: `mutation {
                updatePlace(input:{ id:"${placeId}" user_id: ${user.data.userByEmail.id}})
                {id disabled name}
            }`,
              })
                .then((data) => {
                  if (!data.errors) {
                    dispatch(listActions.setAddUserEmail(""));
                    dispatch(listActions.setAddUserPass(""));
                    dispatch(listActions.setIsOldUser(false));
                    dispatch(listActions.tglAddUserPP(false));

                    dispatch(
                      listActions.sendMailFrom(
                        "Adding an admin account",
                        `Your account has been successfully registered for the establishment '${placeName}'.<br/><br/>
                     <b>Login:</b> ${email}<br/>
                     <b>Password:</b> your old password<br/><br/>
                     Go to the site ... and change the settings for yourself.<br/>
                     Have a good time =)`,
                        email
                      )
                    );
                  } else {
                    dispatch(
                      commonActions.setErr({ ownErr: txt[lng].err.something })
                    );
                    dispatch(listActions.setLoading(false));
                  }
                })
                .catch((err) => {
                  dispatch(
                    commonActions.setErr({ ownErr: txt[lng].err.something })
                  );
                  dispatch(listActions.setLoading(false));
                });
            } else {
              dispatch(
                commonActions.setErr({ ownErr: txt[lng].err.something })
              );
              dispatch(listActions.setLoading(false));
            }
          } else {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.nouser }));
            dispatch(listActions.setLoading(false));
          }
        })
        .catch((err) => {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(listActions.setLoading(false));
        });
    },
  fetchDeleteUser:
    (id, placeId, email, placeName) => async (dispatch, getState) => {
      const { lng } = getState().common;
      dispatch(listActions.setLoading(true));
      if (!placeId) {
        dispatch(listActions.setLoading(true));
        QUERY({
          query: `mutation { deleteUser( id: ${id} ){id name email} }`,
        })
          .then((user) => {
            if (!user.errors) {
              dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
              dispatch(commonActions.setOk(true));
              dispatch(listActions.setAddUserEmail(""));
              dispatch(listActions.setAddUserPass(""));
              dispatch(listActions.fetchAdminPlaces());
              dispatch(listActions.tglAddUserPP(false));
            } else {
              dispatch(
                commonActions.setErr({ ownErr: txt[lng].err.something })
              );
              dispatch(listActions.setLoading(false));
            }
          })
          .catch((err) => {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
            dispatch(listActions.setLoading(false));
          });
      } else {
        QUERY({
          query: `mutation {
        updatePlace(input:{ id:"${placeId}" user_id: ${null}})
        {id name}
    }`,
        })
          .then((data) => {
            if (!data.errors) {
              dispatch(
                listActions.sendMailFrom(
                  "Deleting user from admin account",
                  `User has been deleted from the account '${placeName}'.<br/><br/>
                  <b>Login:</b> ${email}<br/>`,
                  email
                )
              );
            } else {
              dispatch(
                commonActions.setErr({ ownErr: txt[lng].err.something })
              );
              dispatch(listActions.setLoading(false));
            }
          })
          .catch((err) => {
            dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
            dispatch(listActions.setLoading(false));
          });
      }
    },
  fetchClientPlaces: () => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(listActions.setLoading(true));
    QUERY({
      query: `query {me{id name places {${GET_CLIENT_PLACES}}}}`,
    })
      .then((places) => {
        dispatch(listActions.setLoading(false));
        if (!places.errors) {
          dispatch(listActions.setPlaces(places.data.me.places));
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchDisablePlace: (id, disabled) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(listActions.setLoading(true));
    QUERY({
      query: `mutation {
      updatePlace(
        input:{
          id:"${id}"            
          disabled : ${disabled ? false : true}
        }
      ){id disabled}
  }`,
    })
      .then((place) => {
        dispatch(listActions.setLoading(false));
        if (!place.errors) {
          dispatch(
            listActions.setOnOffPPInfo({
              name: "",
              id: "",
              disabled: false,
            })
          );
          dispatch(listActions.tglOnOffPP(false));
          dispatch(listActions.fetchAdminPlaces());
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchDeletePlace: (id) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(listActions.setLoading(true));
    QUERY({
      query: `mutation { deletePlace( id:${id}){id name}}`,
    })
      .then((place) => {
        dispatch(listActions.setLoading(false));
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(listActions.setDelPPPlaceInfo({ id: "", name: "" }));
          dispatch(listActions.tglDelPlacePP(false));
          dispatch(listActions.fetchAdminPlaces());
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
  fetchChangePass: (id, pass, email) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(listActions.setLoading(true));
    QUERY({
      query: `mutation {
        setPassword(input:{ user_id: "${id}" password: "${pass}" }){status message}
      }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(listActions.setAddUserPass(""));
          dispatch(listActions.tglAddUserPP(false));

          dispatch(
            listActions.sendMailFrom(
              "Password changing",
              `Your password has been changed.<br/><br/>
               <b>Login:</b> ${email}<br/>
               <b>New password:</b> ${pass}<br/><br/>
               Have a good time =)`,
              email
            )
          );
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
          dispatch(listActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(listActions.setLoading(false));
      });
  },
};
