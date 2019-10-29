import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const inintialState = [];

export default function(state = inintialState, action) {
  // action by default has a type and a payload (payload contains the data)
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT: {
      return [...state, payload]; //Add payload to the state
    }

    case REMOVE_ALERT: {
      return state.filter(alert => alert.id !== payload); //the payload can be anything, but in this case it is just the id.
    }
    default:
      return state;
  }
}
