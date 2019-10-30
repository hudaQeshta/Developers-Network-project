import axios from "axios";

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token; //Create global header and send it with every request insted of choosing which request to send it with.
  } else {
    delete axios.defaults.headers.common["x-auth-token"]; // delete the token if there is no token in localStorage.
  }
};

export default setAuthToken;
