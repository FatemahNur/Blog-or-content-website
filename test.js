const axios = require('axios');

const baseURL = 'http://localhost:5000/api';
let token = '';

// Test user registration
const testRegistration = async () => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Registration successful:', response.data);
    token = response.data.token;
    return token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.data);
    token = response.data.token;
    return token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
};

// Test creating a post
const testCreatePost = async (token) => {
  try {
    const response = await axios.post(
      `${baseURL}/posts`,
      {
        title: 'Test Post',
        content: 'This is a test post content',
        tags: ['test', 'first post']
      },
      {
        headers: { 'x-auth-token': token }
      }
    );
    console.log('Post created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create post failed:', error.response?.data || error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('Starting tests...');
  
  // Test registration
  console.log('\n1. Testing registration...');
  const regToken = await testRegistration();
  
  // Test login
  console.log('\n2. Testing login...');
  const loginToken = await testLogin();
  
  // Test post creation
  if (loginToken) {
    console.log('\n3. Testing post creation...');
    await testCreatePost(loginToken);
  }
  
  console.log('\nTests completed!');
};

// Install axios if not already installed
const installAxios = async () => {
  const { execSync } = require('child_process');
  try {
    execSync('npm install axios', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install axios:', error);
  }
};

// Run the installation and tests
installAxios().then(() => {
  runTests();
});
