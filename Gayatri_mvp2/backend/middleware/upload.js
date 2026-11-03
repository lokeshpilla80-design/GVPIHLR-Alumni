const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif).'));
};

const imageVideoFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-matroska',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error('Only image and video files are allowed.'));
};

const createCloudinaryUploader = ({
  folder,
  allowed_formats,
  format = 'auto',
  transformation = [{ quality: 'auto' }],
  public_id,
  fileFilter = imageFileFilter,
  limits = { fileSize: 20 * 1024 * 1024 },
}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: (() => {
      const p = { folder, allowed_formats, transformation, public_id };
      // Cloudinary expects `fetch_format` for automatic format selection.
      // `format: 'auto'` is invalid as a file extension, so translate it.
      if (format && format !== 'auto') p.format = format;
      if (format === 'auto') p.fetch_format = 'auto';
      return p;
    })(),
  });

  return multer({ storage, fileFilter, limits });
};

module.exports = { createCloudinaryUploader, imageFileFilter, imageVideoFileFilter };