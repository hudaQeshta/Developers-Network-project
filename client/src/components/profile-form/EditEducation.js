import React, { Fragment, useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import { addEducation, getCurrentProfile } from "../../actions/profile";

const EditEducation = ({
  addEducation,
  profile: { profile, loading },
  getCurrentProfile,
  match,
}) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });

  const [toDateDisabled, toggleDisabled] = useState(false);
  useEffect(() => {
    getCurrentProfile();
    setFormData({
      school:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].school
          ? ""
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].school,
      degree:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].degree
          ? ""
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].degree,
      fieldofstudy:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].fieldofstudy
          ? ""
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].fieldofstudy,
      from:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].from
          ? ""
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].from,
      to:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].to
          ? null
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].to,
      current:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].current
          ? false
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].current,
      description:
        loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].description
          ? ""
          : profile.education[
              profile.education.findIndex(
                (item) => item._id === match.params.id
              )
            ].description,
    });
    toggleDisabled(
      loading ||
        !profile.education[
          profile.education.findIndex((item) => item._id === match.params.id)
        ].current
        ? false
        : true
    );
  }, [loading, getCurrentProfile]);

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school or bootcamp that
        you have attended
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          addEducation(formData, match.params.id, true);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            onChange={(e) => onChange(e)}
            value={school}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            onChange={(e) => onChange(e)}
            value={degree}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldofstudy"
            onChange={(e) => onChange(e)}
            value={fieldofstudy}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            onChange={(e) => onChange(e)}
            value={moment(new Date(from)).format("YYYY-MM-DD")}
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
            Current program
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            onChange={(e) => onChange(e)}
            value={moment(new Date(to)).format("YYYY-MM-DD")}
            disabled={toDateDisabled ? "disabled" : ""}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
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

EditEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { addEducation, getCurrentProfile })(
  withRouter(EditEducation)
);
