import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux"; // whenever there is an interaction of a component (calling an action or getting the state) with redux

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert // state.(any thing we want from root reducer which is index.js , and for now we just have alert) to get the state inside of alert.
}); // now we will have props.alerts available to us, but we're going to destructure it.

export default connect(mapStateToProps)(Alert);
