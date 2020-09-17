import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { updatePost, getPost } from "../../actions/post";
import Spinner from "../layout/Spinner";

const EditPost = ({
  getPost,
  post: { post, loading },
  updatePost,
  match,
  history,
}) => {
  const [text, setText] = useState("");
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match.params.id]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${post.user}`}>
          <img className="round-img" src={post.avatar} alt="" />
          <h4>{post.name}</h4>
        </Link>
      </div>

      <form
        className="form my-1"
        onSubmit={(e) => {
          e.preventDefault();
          updatePost(text, match.params.id, history);
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="update your post"
          defaultValue={post.text}
          onChange={(e) => setText({ [e.target.name]: e.target.value })}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
        <a className="btn btn-light" href="/posts">
          Cancel
        </a>
      </form>
    </div>
  );
};

EditPost.propTypes = {
  updatePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { updatePost, getPost })(
  withRouter(EditPost)
);
