import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setAlert = (msg, alertType, timeout = 5000) => (
  dispatch // We can do that because of the thunk middleware
) => {
  const id = uuid.v4(); // uuid gives us random long string (universal id).
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
  //Remove alert after 5s
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
