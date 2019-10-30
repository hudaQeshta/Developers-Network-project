import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import "./App.css";

//Redux
import { Provider } from "react-redux"; // react and redux are seperated from ech other, this package connects them by wrapping every thing in retrun of App functional component inside Provider.
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser()); //to use loadUser.
  }, []); // When the state updates useEffect hook will keep running, wo when adding the empty [] (which tells react that this effect doesn't depend on any value from props or state), it will only run once when the app is mounted or loaded, if we added certian props to the [], the useEffect will only run when one of those props changes. (if you were using react class, this should be in componentDidMount()).

  return (
    <Provider store={store}>
      {/* it will allow all components to accesss applevel state. */}
      <Router>
        {/* Every thing should be inside Router in order to work */}
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              {/* Switch can only have routes in it */}
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
