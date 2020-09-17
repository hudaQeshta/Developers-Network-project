import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";
export default combineReducers({
  // all reducers will be listed inside here
  alert,
  auth,
  profile,
  post,
});
