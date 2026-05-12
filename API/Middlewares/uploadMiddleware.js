const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = 'uploads/props';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Formato de imagem não suportado. Use JPEG, PNG, WEBP ou SVG.'));
};

module.exports = multer({ storage, fileFilter });