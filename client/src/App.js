import React, { Fragment } from "react";
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

const App = () => (
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

export default App;
