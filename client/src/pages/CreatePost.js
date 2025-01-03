import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        formData,
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Post
          </Typography>
          {error && (
            <Typography color="error" gutterBottom>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={6}
            />
            <TextField
              fullWidth
              label="Add Tags (Press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              margin="normal"
            />
            <Box sx={{ mt: 2, mb: 2 }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Create Post
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreatePost;
