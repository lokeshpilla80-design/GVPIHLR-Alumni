const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const { createCloudinaryUploader, imageFileFilter } = require('../middleware/upload');

const Sponsor = require('../models/Sponsor');
const mongoose = require('mongoose');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const protectRoute = typeof auth === 'function' ? auth : auth.protect || auth.verifyToken || auth;

const upload = createCloudinaryUploader({
  folder: 'gvp/sponsors',
  format: 'auto',
  public_id: (req, file) => `sponsor-${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`,
  limits: { fileSize: 1024 * 1024 * 6 },
  fileFilter: imageFileFilter,
});

// GET /api/sponsors - public list
router.get('/', async (req, res) => {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const sponsors = await Sponsor.find().sort({ order: 1, createdAt: 1 });
    return res.json({ success: true, data: sponsors });
  } catch (err) {
    console.error('DB error fetching sponsors', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/sponsors - upload new sponsor (protected)
router.post('/', protectRoute, requireRole('admin', 'manager', 'super-admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });

    const { url, title } = req.body;
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;

    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const count = await Sponsor.countDocuments().catch(() => 0);
    const sponsor = await Sponsor.create({
      title: title || req.file.originalname,
      filename: req.file.filename,
      imageUrl,
      url: url || '',
      order: count + 1,
    });

    return res.status(201).json({ success: true, data: sponsor });
  } catch (err) {
    console.error('Sponsor upload error', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/sponsors/:id - update sponsor name/url (protected)
router.put('/:id', protectRoute, requireRole('admin', 'manager', 'super-admin'), async (req, res) => {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const { title, url } = req.body;
    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      { ...(title !== undefined && { title }), ...(url !== undefined && { url }) },
      { new: true, runValidators: true }
    );

    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    return res.json({ success: true, data: sponsor });
  } catch (err) {
    console.error('Sponsor update error', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/sponsors/:id - remove sponsor and Cloudinary asset (protected)
router.delete('/:id', protectRoute, requireRole('admin', 'manager', 'super-admin'), async (req, res) => {
  try {
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database unavailable' });
    }

    const sponsor = await Sponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });

    if (sponsor.filename) {
      await cloudinary.uploader.destroy(sponsor.filename).catch(() => {});
    }

    await Sponsor.deleteOne({ _id: req.params.id });
    return res.json({ success: true, data: {} });
  } catch (err) {
    console.error('Sponsor delete error', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

