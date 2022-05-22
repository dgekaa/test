import { QUERY_PATH } from "../../other/settings";
import QUERY from "../../other/query";
import { PLACE_DATA_QUERY_FOR_ALIAS_PROFILE } from "../../other/queryData";
import axios from "axios";
import { authActions } from "../../store/authenticate";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";

export const profileActionTypes = {
  SET_LOADING: "PROFILE.SET_LOADING",
  SET_PLACE: "PROFILE.SET_PLACE",
  CLEAR_PLACE: "PROFILE.CLEAR_PLACE",
  UPDATE_PLACE: "PROFILE.UPDATE_PLACE",
  SET_IMG_SRC: "PROFILE.SET_IMG_SRC",

  SET_NAME: "PROFILE.SET_NAME",
  SET_ALIAS: "PROFILE.SET_ALIAS",
  SET_DESC: "PROFILE.SET_DESC",
  SET_ADDRESS: "PROFILE.SET_ADDRESS",
  SET_COORDS: "PROFILE.SET_COORDS",
  SET_IMG_DESC: "PROFILE.SET_IMG_DESC",

  SET_SOCIAL: "PROFILE.SET_SOCIAL",

  TOGGLE_MAP_PP: "PROFILE.TOGGLE_MAP_PP",
  TOGGLE_CAT_PP: "PROFILE.TOGGLE_CAT_PP",
  TOGGLE_CITY_PP: "PROFILE.TOGGLE_CITY_PP",

  SET_IMAGE: "PROFILE.SET_IMAGE",

  SET_SWITCH: "PROFILE.SET_SWITCH",
  SET_IS_NEW_SOCIAL: "PROFILE.SET_IS_NEW_SOCIAL",
};

export const profileActions = {
  setLoading: (payload) => ({
    type: profileActionTypes.SET_LOADING,
    payload,
  }),
  setPlace: (payload) => ({
    type: profileActionTypes.SET_PLACE,
    payload,
  }),
  setIsNewSocial: (payload) => ({
    type: profileActionTypes.SET_IS_NEW_SOCIAL,
    payload,
  }),
  updatePlace: (payload) => ({
    type: profileActionTypes.UPDATE_PLACE,
    payload,
  }),
  setImgSrc: (payload) => ({
    type: profileActionTypes.SET_IMG_SRC,
    payload,
  }),
  setSwitch: (payload) => ({
    type: profileActionTypes.SET_SWITCH,
    payload,
  }),
  setName: (payload) => ({
    type: profileActionTypes.SET_NAME,
    payload,
  }),
  setSocial: (payload) => ({
    type: profileActionTypes.SET_SOCIAL,
    payload,
  }),
  setAlias: (payload) => ({
    type: profileActionTypes.SET_ALIAS,
    payload,
  }),
  setDesc: (payload) => ({
    type: profileActionTypes.SET_DESC,
    payload,
  }),
  setImgDesc: (payload) => ({
    type: profileActionTypes.SET_IMG_DESC,
    payload,
  }),
  setAddr: (payload) => ({
    type: profileActionTypes.SET_ADDRESS,
    payload,
  }),
  setCoords: (payload) => ({
    type: profileActionTypes.SET_COORDS,
    payload,
  }),
  clearPlace: () => ({
    type: profileActionTypes.CLEAR_PLACE,
  }),
  tglMapPP: (payload) => ({
    type: profileActionTypes.TOGGLE_MAP_PP,
    payload,
  }),
  tglCatPP: (payload) => ({
    type: profileActionTypes.TOGGLE_CAT_PP,
    payload,
  }),
  tglCityPP: (payload) => ({
    type: profileActionTypes.TOGGLE_CITY_PP,
    payload,
  }),
  setNewImage: (payload) => ({
    type: profileActionTypes.SET_IMAGE,
    payload,
  }),
  updateSocial: (id, name, url, N) => async (dispatch, getState) => {
    const { social } = getState().profile;

    if (N) {
      social[id] = { ...social[id], name, changed: true };
    } else {
      social[id] = { ...social[id], url, changed: true };
    }

    dispatch(profileActions.setSocial(social));
  },
  fetchPlace: (alias) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(profileActions.setLoading(true));
    QUERY({
      query: `query {
          placeByAlias (alias: "${alias}") {${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE} }
        }`,
    })
      .then((place) => {
        if (!place.errors) {
          dispatch(profileActions.setPlace(place.data.placeByAlias));
          dispatch(profileActions.setSwitch(place.data.placeByAlias.adult));
          dispatch(profileActions.setSocial(place.data.placeByAlias.socials));
        } else {
          dispatch(authActions.logout());
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.sessionerr }));
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchChangeMainImage: (id, image) => async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true));
    const { place } = getState().profile;

    const first = place.images[0],
      current = image;

    QUERY({
      query: `mutation { updatePlace(
        input:{
          id:"${id}"
          images: {${`update:[{ id:${first.id} url:"${current.url}" description:"${current.description}"}]`}}
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
    }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          QUERY({
            query: `mutation { updatePlace(
              input:{
                id:"${id}"
                images: {${`update:[{ id:${current.id} url:"${first.url}" description:"${first.description}" }]`}}
              }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
          }`,
          })
            .then((pl) => {
              if (!pl.errors) {
                delete pl.data.updatePlace.description;
                delete pl.data.updatePlace.alias;
                delete pl.data.updatePlace.name;
                dispatch(profileActions.setNewImage(false));
                dispatch(
                  profileActions.setPlace({ ...place, ...pl.data.updatePlace })
                );
                dispatch(profileActions.setImgSrc(null));
                dispatch(profileActions.setImgDesc(""));
              } else {
                dispatch(commonActions.setErr(pl.errors));
              }
              dispatch(profileActions.setLoading(false));
            })
            .catch((err) => {
              dispatch(commonActions.setErr(err));
              dispatch(profileActions.setLoading(false));
            });
        } else {
          dispatch(commonActions.setErr(pl.errors));
          dispatch(profileActions.setLoading(false));
        }
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateImgDesc: (id, imageId) => async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true));
    const { imgDesc, place } = getState().profile;

    QUERY({
      query: `mutation { updatePlace(
              input:{
                id:"${id}"
                images: {${`update:[{ id:${imageId} description:"${imgDesc
                  .replace(/"/g, "'")
                  .replace(/\n/g, "\\n")}" }]`}}
              }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
          }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(profileActions.setNewImage(false));
          dispatch(profileActions.setImgDesc(""));
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
        } else {
          dispatch(commonActions.setErr(pl.errors));
        }
        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateImage:
    (id, image, imageId, arrId) => async (dispatch, getState) => {
      dispatch(profileActions.setLoading(true));
      const { place, imgDesc } = getState().profile,
        { lng } = getState().common;

      QUERY({
        query: `mutation { updatePlace(input:{ id:"${id}" images: {${
          image
            ? `create:[{url:"${image}" 
              description: "${imgDesc
                .replace(/"/g, "'")
                .replace(/\n/g, "\\n")}"}]`
            : `delete:[{id:${+imageId}}]`
        }}}){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
      })
        .then((pl) => {
          if (!pl.errors) {
            !image &&
              dispatch(profileActions.deleteImage(place.images[arrId].url));

            delete pl.data.updatePlace.description;
            delete pl.data.updatePlace.alias;
            delete pl.data.updatePlace.name;
            dispatch(profileActions.setNewImage(false));
            dispatch(
              profileActions.setPlace({ ...place, ...pl.data.updatePlace })
            );

            dispatch(profileActions.setImgSrc(null));
            dispatch(profileActions.setImgDesc(""));
          } else {
            dispatch(commonActions.setErr(txt[lng].err.largeonly));
          }
          dispatch(profileActions.setLoading(false));
        })
        .catch((err) => {
          dispatch(commonActions.setErr(txt[lng].err.largeonly));
          dispatch(profileActions.setLoading(false));
        });
    },
  deleteImage: (path) => async (dispatch, getState) => {
    const { lng } = getState().common;
    QUERY({
      query: `mutation { deletePlaceImage ( path:"${path}" )}`,
    })
      .then((img) => {
        if (!img.errors) {
        } else {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }));
        }
      })
      .catch((err) =>
        dispatch(commonActions.setErr({ ownErr: txt[lng].err.something }))
      );
  },
  fetchSocial: (id, index, isUpd, isDel) => async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true));
    const { place, social } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          socials: {
            ${
              isDel
                ? `delete:[{id:${+id}}]`
                : isUpd
                ? `update:[{id:${+id} 
                  url:"${social[index].url.replace(/"/g, "'")}" 
                  name: "${social[index].name.replace(/"/g, "'")}"}]`
                : `create:[{url:"${social[index].url.replace(/"/g, "'")}" 
                  name: "${social[index].name.replace(/"/g, "'")}"}]`
            }
        }
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!place.errors) {
          if (isUpd) {
            const soc = social;
            soc[index].changed = false;
            dispatch(profileActions.setSocial(soc));
          }

          if (isDel) {
            const soc = social;
            soc.splice(index, 1);
            dispatch(profileActions.setSocial(soc));
          }

          if (!id) {
            const soc = social;
            soc[soc.length - 1].changed = false;
            dispatch(profileActions.setSocial(soc));
            dispatch(profileActions.setIsNewSocial(true));
          }

          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
        } else {
          dispatch(commonActions.setErr(place.errors));
        }
        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdatePlace: (changeUrl) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(profileActions.setLoading(true));
    const { place } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          name: ${place.name ? `"${place.name.replace(/"/g, "'")}"` : null},
          alias:  ${place.alias ? `"${place.alias.replace(/"/g, "'")}"` : null}
          description:  "${place.description
            .replace(/"/g, "'")
            .replace(/\n/g, "\\n")}"
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!place.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));
          dispatch(profileActions.setPlace(pl.data.updatePlace));
          changeUrl(pl.data.updatePlace.alias);
        } else {
          dispatch(commonActions.setErr(place.errors));
        }
        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateCategory: (id, active) => async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true));
    const { place } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          ${
            active
              ? `categories:{
              disconnect: "${id}"`
              : `categories:{
              connect: "${id}"`
          }
          }
         
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
        } else {
          dispatch(commonActions.setErr(pl.errors));
        }

        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateCity: (id) => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(profileActions.setLoading(true));
    const { place } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          city_id: ${id}
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));

          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
        } else {
          dispatch(commonActions.setErr(pl.errors));
        }

        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateAdult: (bool) => async (dispatch, getState) => {
    dispatch(profileActions.setLoading(true));
    const { place } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          adult: ${bool}
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
          dispatch(profileActions.setSwitch(bool));
        } else {
          dispatch(commonActions.setErr(pl.errors));
        }

        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUpdateCoords: () => async (dispatch, getState) => {
    const { lng } = getState().common;

    dispatch(profileActions.setLoading(true));
    const { place, address, coords } = getState().profile;

    QUERY({
      query: `mutation {
        updatePlace(input:{
          id:"${place.id}",
          address : "${address.replace(/"/g, "'")}"
          lat: ${coords.lat}
          lon: ${coords.lon}
        }){${PLACE_DATA_QUERY_FOR_ALIAS_PROFILE}}
      }`,
    })
      .then((pl) => {
        if (!pl.errors) {
          dispatch(commonActions.setErr({ ownErr: txt[lng].err.succ }));
          dispatch(commonActions.setOk(true));

          dispatch(profileActions.tglMapPP(false));
          dispatch(profileActions.setAddr(""));
          dispatch(profileActions.setCoords(""));

          delete pl.data.updatePlace.description;
          delete pl.data.updatePlace.alias;
          delete pl.data.updatePlace.name;
          dispatch(
            profileActions.setPlace({ ...place, ...pl.data.updatePlace })
          );
        } else {
          dispatch(commonActions.setErr(pl.errors));
        }
        dispatch(profileActions.setLoading(false));
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(profileActions.setLoading(false));
      });
  },
  fetchUploadImage: (id, image) => async (dispatch, getState) => {
    const { lng } = getState().common;

    const query = `mutation ($file: Upload!) {placeImage(file: $file)}`,
      operations = JSON.stringify({
        query,
        variables: {
          data: {
            file: null,
          },
        },
      }),
      formData = new FormData();

    formData.append("operations", operations);
    formData.append(
      "map",
      JSON.stringify({
        0: ["variables.file"],
      })
    );
    formData.append("0", image);
    if (image.size >= 2000000) {
      dispatch(commonActions.setErr({ ownErr: txt[lng].err.largeimg }));
    } else {
      dispatch(profileActions.setLoading(true));
      axios({
        url: `${QUERY_PATH}/graphql`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: localStorage.getItem("token")
            ? "Bearer " + localStorage.getItem("token")
            : "",
        },
        data: formData,
      })
        .then((res) => {
          if (res.data.data.placeImage && !res.data.errors) {
            dispatch(
              profileActions.fetchUpdateImage(id, res.data.data.placeImage)
            );
          } else {
            dispatch(commonActions.setErr(res.data.errors[0]));
            dispatch(profileActions.setLoading(false));
          }
        })
        .catch((err) => {
          dispatch(commonActions.setErr(err));
          dispatch(profileActions.setLoading(false));
        });
    }
  },
};
