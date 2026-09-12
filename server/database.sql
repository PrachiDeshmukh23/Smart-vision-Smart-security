-- GS Vision MySQL Schema & Sample Data
CREATE DATABASE IF NOT EXISTS gsvision DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gsvision;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
ame VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  
ole ENUM('admin', 'manager') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NULL DEFAULT NULL,
  
ame VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  description TEXT NULL,
  image VARCHAR(255) NULL,
  sort_order INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_cat_slug (slug),
  INDEX idx_cat_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Brands table
CREATE TABLE IF NOT EXISTS rands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
ame VARCHAR(100) NOT NULL,
  slug VARCHAR(110) NOT NULL UNIQUE,
  logo VARCHAR(255) NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  rand_id INT NULL DEFAULT NULL,
  
ame VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  model_number VARCHAR(100) NOT NULL,
  short_description TEXT NULL,
  description LONGTEXT NULL,
  main_image VARCHAR(255) NULL,
  price DECIMAL(10,2) NULL DEFAULT NULL,
  show_price TINYINT(1) DEFAULT 0,
  eatured TINYINT(1) DEFAULT 0,
  is_new TINYINT(1) DEFAULT 0,
  stock_status ENUM('in_stock', 'out_of_stock', 'on_demand') DEFAULT 'in_stock',
  rochure VARCHAR(255) NULL,
  seo_title VARCHAR(255) NULL,
  seo_description TEXT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (rand_id) REFERENCES rands(id) ON DELETE SET NULL,
  INDEX idx_prod_slug (slug),
  INDEX idx_prod_cat (category_id),
  INDEX idx_prod_featured (eatured),
  INDEX idx_prod_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_img_prod (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Product Specifications
CREATE TABLE IF NOT EXISTS product_specifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  specification_name VARCHAR(150) NOT NULL,
  specification_value VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_spec_prod (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Banners table
CREATE TABLE IF NOT EXISTS anners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  	itle VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  desktop_image VARCHAR(255) NULL,
  mobile_image VARCHAR(255) NULL,
  cta_text VARCHAR(100) DEFAULT 'Explore Products',
  cta_url VARCHAR(255) DEFAULT '/products',
  position VARCHAR(50) DEFAULT 'home_hero',
  sort_order INT DEFAULT 0,
  ctive TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Offers table
CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  	itle VARCHAR(255) NOT NULL,
  description TEXT NULL,
  desktop_poster VARCHAR(255) NULL,
  mobile_poster VARCHAR(255) NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  cta_text VARCHAR(100) DEFAULT 'Enquire Now',
  cta_link VARCHAR(255) DEFAULT '/contact',
  
elated_product_id INT NULL DEFAULT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (
elated_product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NULL DEFAULT NULL,
  
ame VARCHAR(150) NOT NULL,
  mobile VARCHAR(30) NOT NULL,
  email VARCHAR(150) NULL,
  city VARCHAR(100) NULL,
  company VARCHAR(150) NULL,
  quantity VARCHAR(50) NULL,
  message TEXT NULL,
  status ENUM('New', 'Contacted', 'Follow-up', 'Completed', 'Cancelled') DEFAULT 'New',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_enq_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Dealer Applications table
CREATE TABLE IF NOT EXISTS dealer_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
ame VARCHAR(150) NOT NULL,
  usiness_name VARCHAR(200) NOT NULL,
  mobile VARCHAR(30) NOT NULL,
  email VARCHAR(150) NULL,
  gst_number VARCHAR(50) NULL,
  ddress TEXT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NULL,
  current_business VARCHAR(200) NULL,
  interested_products TEXT NULL,
  message TEXT NULL,
  status ENUM('Pending', 'Contacted', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_dealer_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  	itle VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NULL,
  pdf_file VARCHAR(255) NOT NULL,
  	humbnail VARCHAR(255) NULL,
  download_count INT DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Gallery table
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  	itle VARCHAR(150) NOT NULL,
  category VARCHAR(100) DEFAULT 'Products',
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Testimonials table
CREATE TABLE IF NOT EXISTS 	estimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(150) NOT NULL,
  company VARCHAR(150) NULL,
  
ating INT DEFAULT 5,
  comment TEXT NOT NULL,
  vatar VARCHAR(255) NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Contact Messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
ame VARCHAR(150) NOT NULL,
  mobile VARCHAR(30) NULL,
  email VARCHAR(150) NOT NULL,
  subject VARCHAR(200) NULL,
  message TEXT NOT NULL,
  status ENUM('Unread', 'Read', 'Replied') DEFAULT 'Unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_msg_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Website Settings table
CREATE TABLE IF NOT EXISTS website_settings (
  id INT PRIMARY KEY DEFAULT 1,
  company_name VARCHAR(150) DEFAULT 'GS Vision',
  	agline VARCHAR(255) DEFAULT 'Smart Vision.. Smart Security',
  phone VARCHAR(50) DEFAULT '+91 98765 43210',
  secondary_phone VARCHAR(50) DEFAULT '+91 98765 43211',
  email VARCHAR(150) DEFAULT 'sales@gsvision.com',
  support_email VARCHAR(150) DEFAULT 'support@gsvision.com',
  whatsapp_number VARCHAR(50) DEFAULT '919876543210',
  ddress TEXT,
  map_embed_url TEXT,
  usiness_hours VARCHAR(255) DEFAULT 'Mon - Sat: 9:30 AM - 7:00 PM',
  acebook_url VARCHAR(255) DEFAULT 'https://facebook.com',
  youtube_url VARCHAR(255) DEFAULT 'https://youtube.com',
  instagram_url VARCHAR(255) DEFAULT 'https://instagram.com',
  linkedin_url VARCHAR(255) DEFAULT 'https://linkedin.com',
  bout_short TEXT,
  bout_full LONGTEXT,
  ision_text TEXT,
  mission_text TEXT,
  quality_commitment TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
