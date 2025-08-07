const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - ORDER IS IMPORTANT
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload directories exist
const ensureUploadDirs = async () => {
  const dirs = [
    path.join(__dirname, 'uploads'),
    path.join(__dirname, 'uploads/videos'),
    path.join(__dirname, 'uploads/texts'),
    path.join(__dirname, 'uploads/generated'),
    path.join(__dirname, 'uploads/generated/bpmn'),
    path.join(__dirname, 'uploads/generated/prd'),
    path.join(__dirname, 'uploads/generated/drd'),
    path.join(__dirname, 'uploads/generated/summaries')
  ];
  
  for (const dir of dirs) {
    await fs.ensureDir(dir);
  }
};

ensureUploadDirs();

// Routes
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Internal server error',
      status: error.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});