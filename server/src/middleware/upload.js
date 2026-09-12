const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsBaseDir = path.join(__dirname, '../../uploads');
const productsDir = path.join(uploadsBaseDir, 'products');
const brandsDir = path.join(uploadsBaseDir, 'brands');
const bannersDir = path.join(uploadsBaseDir, 'banners');
const categoriesDir = path.join(uploadsBaseDir, 'categories');
const galleryDir = path.join(uploadsBaseDir, 'gallery');
const downloadsDir = path.join(uploadsBaseDir, 'downloads');
const testimonialsDir = path.join(uploadsBaseDir, 'testimonials');

[uploadsBaseDir, productsDir, brandsDir, bannersDir, categoriesDir, galleryDir, downloadsDir, testimonialsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = uploadsBaseDir;
    if (file.fieldname === 'logo') dest = brandsDir;
    else if (file.fieldname === 'banner_image' || file.fieldname === 'image' && req.baseUrl.includes('banner')) dest = bannersDir;
    else if (file.fieldname === 'category_image') dest = categoriesDir;
    else if (file.fieldname === 'main_image' || file.fieldname === 'gallery_images' || file.fieldname === 'image' && req.baseUrl.includes('product')) dest = productsDir;
    else if (file.fieldname === 'gallery_image' || req.baseUrl.includes('gallery')) dest = galleryDir;
    else if (file.fieldname === 'file' || file.fieldname === 'brochure' || req.baseUrl.includes('download')) dest = downloadsDir;
    else if (file.fieldname === 'avatar' || req.baseUrl.includes('testimonial')) dest = testimonialsDir;
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

module.exports = upload;
