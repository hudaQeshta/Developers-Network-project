import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import { updateComment, getPost } from "../../actions/post";
import Spinner from "../layout/Spinner";

const EditComment = ({
  getPost,
  post: { post, loading },
  updateComment,
  match,
  history,
}) => {
  const [text, setText] = useState("");
  useEffect(() => {
    getPost(match.params.postId);
  }, [getPost, match.params.postId]);
  return loading || post === null ? (
    <Spinner />
  ) : (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link
          to={`/profile/${
            post.comments[
              post.comments.findIndex(
                (comment) => comment._id === match.params.id + ""
              ).user
            ]
          }`}
        >
          <img
            className="round-img"
            src={
              post.comments[
                post.comments.findIndex(
                  (comment) => comment._id === match.params.id + ""
                )
              ].avatar
            }
            alt=""
          />
          <h4>
            {
              post.comments[
                post.comments.findIndex(
                  (comment) => comment._id === match.params.id + ""
                )
              ].name
            }
          </h4>
        </Link>
      </div>
      <div>
        <form
          className="form my-1"
          onSubmit={(e) => {
            e.preventDefault();
            updateComment(match.params.postId, match.params.id, text, history);
            setText("");
          }}
        >
          <textarea
            name="text"
            cols="30"
            rows="5"
            defaultValue={
              post.comments[
                post.comments.findIndex(
                  (comment) => comment._id === match.params.id + ""
                )
              ].text
            }
            placeholder="update your post"
            onChange={(e) => setText({ [e.target.name]: e.target.value })}
            required
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
          <a className="btn btn-light" href={`/posts/${match.params.postId}`}>
            Cancel
          </a>
        </form>
        <p className="post-date">
          Posted on{" "}
          <Moment format="YYYY/MM/DD">
            {
              post.comments[
                post.comments.findIndex(
                  (comment) => comment._id === match.params.id + ""
                )
              ].date
            }
          </Moment>
        </p>
      </div>
    </div>
  );
};

EditComment.propTypes = {
  getPost: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, {
  getPost,
  updateComment,
})(EditComment);
