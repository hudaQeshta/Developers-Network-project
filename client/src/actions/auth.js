import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//We don't want to have an invalid token in the localStorage.

//Load user
export const loadUser = () => async dispatch => {
  //we want to check if there is a token in localStorage, and if there is we want to always send that (put it in global header)
  if (localStorage.token) {
    setAuthToken(localStorage.token); //Set the header with the token if it exists.
  }
  //Then we can make the request
  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data //The payload is the data sent from the auth route.
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

//Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password }); // Getting the data ready before sending the response.

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data //which is the token.
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors; // returns the arrya of errors.

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL
    });
  }
};

//Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password }); // Getting the data ready before sending the response.

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data //which is the token.
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors; // returns the arrya of errors.

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
