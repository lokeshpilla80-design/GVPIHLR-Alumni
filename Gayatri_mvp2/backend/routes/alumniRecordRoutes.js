const express = require('express');
const { createCloudinaryUploader } = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const controller = require('../controllers/alumniRecordController');

const router = express.Router();
const admin = requireRole('admin', 'manager', 'super-admin');
const profilePhotoUpload = createCloudinaryUploader({
  folder: 'gvp/alumni-profiles',
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  transformation: [{ width: 800, height: 800, crop: 'limit' }, { quality: 'auto' }],
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/me', auth, requireRole('alumni'), controller.getMyProfile);
router.put('/me', auth, requireRole('alumni'), controller.saveMyProfile);
router.post('/me/photo', auth, requireRole('alumni'), profilePhotoUpload.single('photo'), controller.uploadMyPhoto);

router.get('/summary', auth, requireRole('alumni', 'admin', 'editor', 'manager', 'super-admin'), controller.getAdminSummary);
router.get('/admin/summary', auth, admin, controller.getAdminSummary);
router.get('/admin/export', auth, admin, controller.exportAdminRecords);
router.get('/admin', auth, admin, controller.searchAdminRecords);
router.put('/admin/:id', auth, admin, controller.updateAdminRecord);
router.delete('/admin/:id', auth, admin, controller.deleteAdminRecord);

module.exports = router;
