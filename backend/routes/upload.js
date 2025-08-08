const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { videoUpload } = require('../middleware/upload');

// Test route to verify JSON parsing
router.post('/test', (req, res) => {
  console.log('Test endpoint hit');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  res.json({
    received: true,
    body: req.body,
    headers: req.headers
  });
});

// Video upload route
router.post('/video', videoUpload.single('video'), uploadController.uploadVideo);
// router.post('/text-binary', uploadController.uploadTextBinary);
// In routes/upload.js
router.post('/text-binary', 
  // Add middleware to capture raw body
  (req, res, next) => {
    if (req.headers['content-type'] === 'text/plain' || 
        req.headers['content-type']?.startsWith('text/')) {
      let data = '';
      req.setEncoding('utf8');
      
      req.on('data', chunk => {
        data += chunk;
      });
      
      req.on('end', () => {
        req.rawBody = data;
        next();
      });
    } else {
      next();
    }
  },
  uploadController.uploadTextBinary
);
// Text upload route - Direct to controller for JSON handling
router.post('/text', uploadController.uploadText);

router.get('/download/:filename',uploadController.sendFile);

module.exports = router;