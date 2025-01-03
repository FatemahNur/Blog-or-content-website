const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post('/', [auth, [
  check('content', 'Content is required').not().isEmpty(),
  check('post', 'Post ID is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.body.post);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = new Comment({
      content: req.body.content,
      post: req.body.post,
      user: req.user.id
    });

    const comment = await newComment.save();

    // Add comment to post
    post.comments.unshift(comment._id);
    await post.save();

    await comment.populate('user', ['username', 'avatar']);
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/comments/:id/reply
// @desc    Reply to a comment
// @access  Private
router.post('/:id/reply', [auth, [
  check('content', 'Content is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    const newReply = {
      user: req.user.id,
      content: req.body.content
    };

    comment.replies.unshift(newReply);
    await comment.save();

    res.json(comment.replies[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Remove comment from post
    const post = await Post.findById(comment.post);
    if (post) {
      const removeIndex = post.comments.indexOf(comment._id);
      post.comments.splice(removeIndex, 1);
      await post.save();
    }

    await comment.remove();
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
