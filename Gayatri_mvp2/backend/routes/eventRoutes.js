const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { createCloudinaryUploader, imageVideoFileFilter } = require('../middleware/upload');

const upload = createCloudinaryUploader({
  folder: 'gvp/events',
  allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'gif', 'mp4', 'mov'],
  transformation: [{ quality: 'auto' }],
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: imageVideoFileFilter,
});

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/register', eventController.registerForEvent);

// Admin protected routes
router.get('/admin/all', auth, requireRole('admin', 'manager', 'super-admin'), eventController.getAllEventsAdmin);
router.get('/:id/registrations', auth, requireRole('admin', 'manager', 'super-admin'), eventController.getEventRegistrations);
router.post('/', auth, requireRole('admin', 'manager', 'super-admin'), eventController.createEvent);
router.put('/:id', auth, requireRole('admin', 'manager', 'super-admin'), eventController.updateEvent);
router.delete('/:id', auth, requireRole('admin', 'manager', 'super-admin'), eventController.deleteEvent);
router.delete('/:id/hard', auth, requireRole('admin', 'manager', 'super-admin'), eventController.hardDeleteEvent);

// Dedicated event image upload endpoint (prevents event images from showing up in main gallery)
router.post('/upload', auth, requireRole('admin', 'manager', 'super-admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;
    return res.status(201).json({ success: true, imageUrl });
  } catch (err) {
    console.error('Event photo upload failed:', err.message);
    return res.status(500).json({ success: false, message: 'Server upload failed' });
  }
});

module.exports = router;
