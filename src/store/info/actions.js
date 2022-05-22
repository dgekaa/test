import QUERY from "../../other/query";
import { commonActions } from "../../store/common";
import { txt } from "../../other/constants";
import { QUERY_PATH } from "../../other/settings";
import axios from "axios";

export const infoActionTypes = {
  SET_LOADING: "INFO.SET_LOADING",
  SET_NAME: "INFO.SET_NAME",
  SET_EMAIL: "INFO.SET_EMAIL",
  SET_SUBJECT: "INFO.SET_SUBJECT",
  SET_MESSAGE: "INFO.SET_MESSAGE",
  SET_FILES: "INFO.SET_FILES",
};

export const infoActions = {
  setLoading: (payload) => ({
    type: infoActionTypes.SET_LOADING,
    payload,
  }),
  setName: (payload) => ({
    type: infoActionTypes.SET_NAME,
    payload,
  }),
  setEmail: (payload) => ({
    type: infoActionTypes.SET_EMAIL,
    payload,
  }),
  setSubject: (payload) => ({
    type: infoActionTypes.SET_SUBJECT,
    payload,
  }),
  setMessage: (payload) => ({
    type: infoActionTypes.SET_MESSAGE,
    payload,
  }),
  setFiles: (payload) => ({
    type: infoActionTypes.SET_FILES,
    payload,
  }),
  logout: () => ({
    type: infoActionTypes.LOGOUT,
  }),
  clearContacts: () => async (dispatch) => {
    dispatch(infoActions.setName(""));
    dispatch(infoActions.setEmail(""));
    dispatch(infoActions.setSubject(""));
    dispatch(infoActions.setMessage(""));
    dispatch(infoActions.setFiles(null));
  },
  fetchSendMail: (gtoken) => async (dispatch, getState) => {
    const { name, email, subject, message, files } = getState().info;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email_to", email);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("token", gtoken);

    if (files) {
      Object.keys(files).forEach((index) => {
        if (files[index].name && index < 3) {
          formData.append("attachments[]", files[index]);
        }
      });
    }

    dispatch(infoActions.setLoading(true));
    fetch(`${QUERY_PATH}/send-email`, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        dispatch(infoActions.setLoading(false));
        dispatch(infoActions.clearContacts());
      })
      .catch((err) => {
        dispatch(commonActions.setErr(err));
        dispatch(infoActions.setLoading(false));
      });
  },
};
