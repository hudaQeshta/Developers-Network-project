import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from "../actions/types";

//We don't want to have an invalid token in the localStorage.

const initialState = {
  token: localStorage.getItem("token"), //we can access localStorage by vanilla.js, then bring the token if it's exists.
  isAuthenticated: null, //When making a request to register ( or login ) and got success this prop will be set to true, but here it is null because we're going to check for it in order to change the navbar.
  loading: true, // When we send a request and get a response it will be set to false (loading is done) to make sure that isAuthenticated has a value depending on the response (if it is success or fail) bu t not null.
  user: null //When we make a request to the backend (api/auth) and when we get the user data as a response it will get put in here.
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload //Because the payload includes the user.
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token); //since it is a SUCCESS then we get back a token for the registered user in order to be logged in right away, so we need to set token in the localStorage to the returned one in the payload.
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };

    case REGISTER_FAIL: //Since both will do the same we can include a case inside the other.
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem("token"); //Remove the token from localStorage if the register failed.
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false //Even if the register fails we're done loading.
      };
    default:
      return state;
  }
}
