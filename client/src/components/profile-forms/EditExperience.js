import React, { Fragment, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { addExperience, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const EditExperience = ({
  addExperience,
  profile: { profile, loading },
  getCurrentProfile,
  history,
  match,
}) => {
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });
  const [toDateDisabled, toggleDisabled] = useState(false);
  useEffect(() => {
    getCurrentProfile();
    setFormData({
      company:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].company
          ? ""
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].company,
      title:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].title
          ? ""
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].title,
      location:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].location
          ? ""
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].location,
      from:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].from
          ? ""
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].from,
      to:
        loading ||
        profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].current
          ? null
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].to,
      current:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].current
          ? false
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].current,
      description:
        loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].description
          ? ""
          : profile.experience[
              profile.experience.findIndex(
                (item) => item._id === match.params.id
              )
            ].description,
    });
    toggleDisabled(
      loading ||
        !profile.experience[
          profile.experience.findIndex((item) => item._id === match.params.id)
        ].current
        ? false
        : true
    );
  }, [loading, getCurrentProfile]);
  const { company, title, location, from, to, current, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return loading || profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Add An Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addExperience(formData, match.params.id, true, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            name="title"
            onChange={(e) => onChange(e)}
            value={title}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Company"
            name="company"
            onChange={(e) => onChange(e)}
            value={company}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            onChange={(e) => onChange(e)}
            value={location}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            onChange={(e) => onChange(e)}
            value={moment(new Date(from)).format("Y-MM-DD")}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
              value={current}
            />{" "}
            Current Job
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            onChange={(e) => onChange(e)}
            value={moment(new Date(to)).format("YYYY-MM-DD")}
            disabled={toDateDisabled ? true : null}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Job Description"
            onChange={(e) => onChange(e)}
            value={description}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

EditExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { addExperience, getCurrentProfile })(
  withRouter(EditExperience)
);
