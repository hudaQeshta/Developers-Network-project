import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import EditExperience from "./components/profile-form/EditExperience";
import EditEducation from "./components/profile-form/EditEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import EditPost from "./components/posts/EditPost";
import EditComment from "./components/post/EditComment";
import Post from "./components/post/Post";
import Alert from "./components/layout/Alert";
import PrivateRoute from "./components/routing/PrivateRoute";
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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />

              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
              <PrivateRoute
                exact
                path="/edit-experience/:id"
                component={EditExperience}
              />

              <PrivateRoute
                exact
                path="/edit-education/:id"
                component={EditEducation}
              />
              <PrivateRoute exact path="/posts" component={Posts} />
              <PrivateRoute exact path="/posts/:id" component={Post} />
              <PrivateRoute exact path="/edit-post/:id" component={EditPost} />
              <PrivateRoute
                exact
                path="/edit-comment/:postId/:id"
                component={EditComment}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
