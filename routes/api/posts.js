const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// @route    POST api/posts
// @desc     Create post
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "You have to write something in your post. ")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password"); //don't send password of the user with it's returned data from findById().
      const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // The most recent one is on top of list of posts.

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route    GET api/posts/:id
// @desc     Get post by id
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!" });
    }
    res.status(500).send("Server Error!");
  }
});

// @route    PUT api/posts/:id
// @desc     Update post by id
// @access   Private
router.put(
  "/:id",
  [
    auth,
    [
      check("text", "You have to write something in your post. ")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let post = await Post.findById(req.params.id);

      if (post) {
        post = await Post.findByIdAndUpdate(
          { _id: req.params.id },
          { text: req.body.text },
          { new: true }
        );
      }
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post Not Found!" });
      }
      res.status(500).send("Server Error!");
    }
  }
);

// @route    DELETE api/posts/:id
// @desc     Delete post by id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!" });
    }
    res.status(500).send("Server Error!");
  }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post already been liked by the same user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      //filter is a higher order array method.
      return res.status(400).json({ msg: "Post is already liked." });
    }
    //If the post isn't liked by the same user
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route    PUT api/posts/unlike/:id
// @desc     Like a post
// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post is liked by the same user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      //filter is a higher order array method.
      return res.status(400).json({ msg: "Post has not yet been liked." });
    }
    //If the post is liked by the same user
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error!");
  }
});

// @route    POST api/posts/comment/:id
// @desc     Create a comment
// @access   Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "You have to write something in your comment. ")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password"); //don't send password of the user with it's returned data from findById().
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error!");
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete a comment
// @access   Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Pull out the comment to be deleted.
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment Not Found!" });
    }

    //Check the user who wrote the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User Not Authorized" });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/posts/comment/:id/:comment_id
// @desc     Update a comment
// @access   Private

router.put(
  "/comment/:id/:comment_id",
  [
    auth,
    [
      check("text", "You have to write something in your comment. ")
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    try {
      const post = await Post.findById(req.params.id);

      //Pull out the comment to be Updated.
      let comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );

      //Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: "Comment Not Found!" });
      }

      //Check the user who wrote the comment
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User Not Authorized" });
      }

      comment.text = text;

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
