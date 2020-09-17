import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILES,
  GET_REPOS,
} from "./types";
import { setAlert } from "./alert";

//Get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }, //status is the http status (200, 404, 500, 400, ...)
    });
  }
};

//Get all profiles
export const getProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE }); //We will get the profiles array from profile state so we have to clear the current profile data in the state first.
  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }, //status is the http status (200, 404, 500, 400, ...)
    });
  }
};

//Get user's profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }, //status is the http status (200, 404, 500, 400, ...)
    });
  }
};

//Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }, //status is the http status (200, 404, 500, 400, ...)
    });
  }
};

// Create or update a profile
// 'history' is passed to this action in order to use the push property in the history object to redirect to dashboard after creating a profile.
//in Order to pass the history object to the action we have to use withRouter in the component that fires the action or passing the history object to the action.
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors; // returns the arrya of errors.

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Experience
export const addExperience = (formData, id, edit = false, history) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let res = {};
    if (!edit) {
      res = await axios.put("/api/profile/experience", formData, config);
    } else {
      res = await axios.put(`/api/profile/experience/${id}`, formData, config);
    }
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(
      setAlert(edit ? "Experience Updated" : "Experience Added", "success")
    );
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors; // returns the arrya of errors.

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Add Education
export const addEducation = (formData, id, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let res = {};
    if (!edit) {
      res = await axios.put("/api/profile/education", formData, config);
    } else {
      res = await axios.put(`/api/profile/education/${id}`, formData, config);
    }
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(
      setAlert(edit ? "Education Updated" : "Education Added", "success")
    );
  } catch (err) {
    const errors = err.response.data.errors; // returns the arrya of errors.

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Delete experience from profile
export const deleteExperience = (id) => async (dispatch) => {
  if (window.confirm("Are you sure ?")) {
    try {
      const res = await axios.delete(`/api/profile/experience/${id}`);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert("Experience Removed", "praimary"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Delete education from profile
export const deleteEducation = (id) => async (dispatch) => {
  if (window.confirm("Are you sure ?")) {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert("Education Removed", "praimary"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

//Delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure ? This can NOT be undone!")) {
    try {
      await axios.delete("/api/profile");
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(
        setAlert("Your account has been permanantly deleted!", "praimary")
      );
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};
