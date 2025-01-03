# Modern Blog Platform

A full-featured blog and content sharing platform built with Node.js, Express, React, and MongoDB.

## Features

- User authentication and authorization
- Article creation and management
- Category system
- Comment functionality
- Social sharing options
- Responsive design
- Rich text editor
- Image upload support

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Project Structure

```
├── client/             # React frontend
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # API routes
├── utils/             # Utility functions
└── server.js          # Entry point
```
