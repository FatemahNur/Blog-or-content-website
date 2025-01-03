import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  TextField,
  Button,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        setError('Failed to load post');
      }
    };

    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/comments',
        {
          content: comment,
          post: id,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      setPost({
        ...post,
        comments: [response.data, ...post.comments],
      });
      setComment('');
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            {post.title}
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            {post.tags && post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>

          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Comments
            </Typography>
            
            {user && (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={3}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!comment.trim()}
                >
                  Post Comment
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {post.comments && post.comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2 }}>
                    {comment.user.username.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2">
                    {comment.user.username}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PostDetail;
