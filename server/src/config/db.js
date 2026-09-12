const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const env = require('./env');
const { runSeed } = require('../utils/seeder');

let isConnected = false;
let pool = null;

// In-Memory Database Fallback if MySQL server is offline
const memoryDB = {
  users: [
    {
      id: 1,
      name: 'Super Admin',
      email: 'admin@gsvision.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      created_at: new Date()
    }
  ],
  categories: [
    { id: 1, name: 'IP Cameras', slug: 'ip-cameras', description: 'Network IP surveillance cameras with smart analytics', image: '/assets/categories/ip-cam.jpg', is_active: 1 },
    { id: 2, name: 'HD CCTV Cameras', slug: 'hd-cctv-cameras', description: 'High definition analog and coax CCTV cameras', image: '/assets/categories/hd-cam.jpg', is_active: 1 },
    { id: 3, name: 'Network Video Recorders (NVR)', slug: 'nvr', description: 'Standalone and enterprise IP NVR recorders', image: '/assets/categories/nvr.jpg', is_active: 1 },
    { id: 4, name: 'Digital Video Recorders (DVR)', slug: 'dvr', description: 'Multi-channel HD analog video recording systems', image: '/assets/categories/dvr.jpg', is_active: 1 },
    { id: 5, name: 'PTZ Speed Dome Cameras', slug: 'ptz-cameras', description: 'Pan-Tilt-Zoom optical zoom high speed domes', image: '/assets/categories/ptz.jpg', is_active: 1 },
    { id: 6, name: 'Smart WiFi Cameras', slug: 'smart-wifi-cameras', description: 'Wireless home and retail cloud security cameras', image: '/assets/categories/wifi-cam.jpg', is_active: 1 },
    { id: 7, name: 'Power Supplies & PoE Switches', slug: 'accessories', description: 'CCTV SMPS power supplies, PoE injectors and switches', image: '/assets/categories/power.jpg', is_active: 1 },
    { id: 8, name: 'Storage & Hard Drives', slug: 'storage', description: 'Surveillance-grade 24x7 HDDs and memory cards', image: '/assets/categories/hdd.jpg', is_active: 1 }
  ],
  brands: [
    { id: 1, name: 'Hikvision', slug: 'hikvision', logo: '', website_url: 'https://www.hikvision.com', description: 'World leading video surveillance products', is_active: 1 },
    { id: 2, name: 'Dahua Technology', slug: 'dahua', logo: '', website_url: 'https://www.dahuasecurity.com', description: 'AIoT video solutions and hardware', is_active: 1 },
    { id: 3, name: 'CP Plus', slug: 'cp-plus', logo: '', website_url: 'https://www.cpplusworld.com', description: 'India premier electronic security brand', is_active: 1 },
    { id: 4, name: 'GS Vision', slug: 'gs-vision', logo: '', website_url: 'https://gsvision.com', description: 'Original GS Vision premium security line', is_active: 1 },
    { id: 5, name: 'Uniview', slug: 'uniview', logo: '', website_url: 'https://www.uniview.com', description: 'Pioneer of IP video surveillance', is_active: 1 },
    { id: 6, name: 'Honeywell', slug: 'honeywell', logo: '', website_url: 'https://www.honeywell.com', description: 'Commercial enterprise security solutions', is_active: 1 }
  ],
  products: [
    {
      id: 1, category_id: 1, brand_id: 4, name: 'GS Vision 4MP AI Smart Dual-Light Color IP Camera', slug: 'gs-vision-4mp-ai-smart-dual-light-color-ip-camera',
      model_number: 'GS-IP4M-SDLC', short_description: '4 Megapixel Ultra HD IP camera with Color Night Vision and AI Human/Vehicle classification.',
      description: 'The GS-IP4M-SDLC is a high-performance 4MP network bullet camera equipped with cutting-edge Deep Learning analytics. Supports smart dual-light illumination, H.265+ compression, and full IP67 weatherproof housing.',
      main_image: '/assets/products/ip_cam_1.png', price: 4499.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 2, category_id: 1, brand_id: 1, name: 'Hikvision 4K AcuSense Fixed Bullet IP Camera', slug: 'hikvision-4k-acusense-fixed-bullet-ip-camera',
      model_number: 'DS-2CD2083G2-I', short_description: '8MP 4K Ultra HD bullet camera powered by AcuSense technology with false-alarm reduction.',
      description: 'Delivers crystal clear 4K imaging with 120dB true WDR. Ideal for perimeter protection, enterprise warehouses, and critical commercial facilities.',
      main_image: '/assets/products/ip_cam_2.png', price: 8999.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 3, category_id: 3, brand_id: 4, name: 'GS Vision 16-Channel 4K AI PoE Network Video Recorder', slug: 'gs-vision-16-channel-4k-ai-poe-nvr',
      model_number: 'GS-NVR16-4K-16P', short_description: '16Ch 4K NVR with 16 built-in independent PoE ports and dual SATA bays up to 20TB.',
      description: 'Plug-and-play NVR supporting up to 16 IP cameras with integrated PoE switches. Advanced AI face detection and smart perimeter tracking.',
      main_image: '/assets/products/nvr_1.png', price: 15499.00, show_price: 1, featured: 1, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 4, category_id: 5, brand_id: 2, name: 'Dahua 4MP 25x Starlight IR PTZ Network Dome Camera', slug: 'dahua-4mp-25x-starlight-ir-ptz-network-dome-camera',
      model_number: 'SD49425XB-HNR', short_description: '4MP Starlight technology with 25x powerful optical zoom and 100m night vision distance.',
      description: 'Features powerful 25x optical zoom and Starlight low-light sensor for long-range 360-degree monitoring in open yards and industrial estates.',
      main_image: '/assets/products/ptz_1.png', price: 28500.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    }
  ],
  product_specifications: [
    { id: 1, product_id: 1, specification_name: 'Image Sensor', specification_value: '1/2.8" Progressive Scan CMOS', sort_order: 1 },
    { id: 2, product_id: 1, specification_name: 'Resolution', specification_value: '4MP (2560 x 1440) @ 30fps', sort_order: 2 },
    { id: 3, product_id: 1, specification_name: 'Night Vision Range', specification_value: '30 Meters Smart Dual-Light Warm & IR', sort_order: 3 },
    { id: 4, product_id: 1, specification_name: 'Weatherproof Rating', specification_value: 'IP67 Water and Dust Resistant', sort_order: 4 },
    { id: 5, product_id: 2, specification_name: 'Resolution', specification_value: '8MP 4K Ultra HD (3840 x 2160)', sort_order: 1 },
    { id: 6, product_id: 2, specification_name: 'Lens', specification_value: '2.8mm / 4mm Fixed Lens', sort_order: 2 },
    { id: 7, product_id: 3, specification_name: 'PoE Ports', specification_value: '16x 10/100Mbps PoE (IEEE 802.3af/at)', sort_order: 1 },
    { id: 8, product_id: 3, specification_name: 'Decoding Capability', specification_value: '16-ch @ 1080p / 4-ch @ 4K', sort_order: 2 }
  ],
  product_images: [],
  banners: [
    { id: 1, title: 'Next-Generation AI Security & Surveillance', subtitle: '4K Ultra HD IP Cameras with Active Color Night Vision & Human Detection', button_text: 'Explore Catalogue', button_link: '/products', display_order: 1, is_active: 1, image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80' },
    { id: 2, title: 'Smart CCTV Solutions For Commercial & Home', subtitle: 'Complete 360° Protection with Intelligent Multi-Channel NVRs and Remote Access', button_text: 'View Solutions', button_link: '/solutions', display_order: 2, is_active: 1, image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80' }
  ],
  offers: [
    { id: 1, title: 'Complete 4-Channel 4MP Color CCTV Kit Combo', description: 'Includes 4x 4MP Dual-Light Cameras, 4Ch NVR with 1TB HDD, SMPS, and Cables.', discount_percentage: 25.00, coupon_code: 'GSSECURE25', is_active: 1, image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80' }
  ],
  enquiries: [],
  dealer_applications: [],
  downloads: [
    { id: 1, title: 'GS Vision 2025 CCTV Product Catalogue & Solutions', category: 'Brochure', file_type: 'PDF', file_size: '12.4 MB', file_url: '#', description: 'Complete product catalog featuring full camera specs, NVRs, and security accessories.', download_count: 342, is_active: 1 },
    { id: 2, title: 'GS Vision VMS / CMS Client Software (Windows 64-bit)', category: 'Software', file_type: 'ZIP', file_size: '85.2 MB', file_url: '#', description: 'Central management software for 64-channel multi-location live monitoring and playback.', download_count: 521, is_active: 1 }
  ],
  gallery: [
    { id: 1, title: 'Commercial Industrial Warehouse Surveillance Deployment', category: 'Commercial', description: '32-Camera 4K PoE deployment with perimeter fence tripwire alerts.', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', display_order: 1, is_active: 1 },
    { id: 2, title: 'Corporate Headquarters Control Room', category: 'Control Rooms', description: 'Central video wall command center with live PTZ monitoring.', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', display_order: 2, is_active: 1 }
  ],
  testimonials: [
    { id: 1, client_name: 'Rajesh Malhotra', company: 'Apex Logistics & Warehousing', designation: 'Managing Director', review: 'GS Vision upgraded our 5-acre distribution center with 4K AI cameras. The color night vision and perimeter alerts have significantly improved our warehouse security.', rating: 5, is_featured: 1, is_active: 1 },
    { id: 2, client_name: 'Anjali Deshmukh', company: 'Nexus Retail Chains', designation: 'Head of Loss Prevention', review: 'The video clarity and ease of remote mobile monitoring is phenomenal. We have deployed GS Vision cameras across 12 store locations seamlessly.', rating: 5, is_featured: 1, is_active: 1 }
  ],
  contact_messages: [],
  website_settings: {
    company_name: 'GS Vision',
    tagline: 'Smart Vision.. Smart Security',
    contact_email: 'info@gsvision.com',
    support_email: 'support@gsvision.com',
    phone_primary: '+91 98765 43210',
    phone_secondary: '+91 98765 43211',
    whatsapp_number: '919876543210',
    address_line1: 'Plot 42, Electronic City Security Hub, Phase 2',
    address_line2: 'Industrial Area',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110020',
    country: 'India',
    facebook_url: 'https://facebook.com',
    twitter_url: 'https://twitter.com',
    instagram_url: 'https://instagram.com',
    linkedin_url: 'https://linkedin.com',
    youtube_url: 'https://youtube.com',
    about_short: 'GS Vision is a premier surveillance and security camera technology provider offering state-of-the-art IP cameras, NVRs, HD CCTV systems, and customized industrial security solutions.',
    meta_title: 'GS Vision - Smart Security & CCTV Camera Solutions',
    meta_description: 'High-definition 4K IP cameras, NVR/DVR systems, PTZ cameras, and commercial surveillance solutions by GS Vision.'
  }
};

// Hybrid query engine: uses MySQL if active, otherwise memoryDB
async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      return await pool.query(sql, params);
    } catch (err) {
      console.warn(`[Database] MySQL query failed, falling back to memory store: ${err.message}`);
    }
  }

  const s = sql.trim();
  const lower = s.toLowerCase();

  // 1. SELECT queries
  if (lower.startsWith('select')) {
    if (lower.includes('from users')) {
      if (params && params.length > 0) {
        const emailOrId = params[0];
        const filtered = memoryDB.users.filter(u => u.email === emailOrId || u.id === emailOrId);
        return [filtered, []];
      }
      return [memoryDB.users, []];
    }
    if (lower.includes('from categories')) {
      return [memoryDB.categories, []];
    }
    if (lower.includes('from brands')) {
      return [memoryDB.brands, []];
    }
    if (lower.includes('from banners')) {
      return [memoryDB.banners, []];
    }
    if (lower.includes('from offers')) {
      return [memoryDB.offers, []];
    }
    if (lower.includes('from product_specifications')) {
      if (params && params.length > 0) {
        const pid = params[0];
        const filtered = memoryDB.product_specifications.filter(sp => sp.product_id === pid);
        return [filtered, []];
      }
      return [memoryDB.product_specifications, []];
    }
    if (lower.includes('from product_images')) {
      if (params && params.length > 0) {
        const pid = params[0];
        const filtered = memoryDB.product_images.filter(im => im.product_id === pid);
        return [filtered, []];
      }
      return [memoryDB.product_images, []];
    }
    if (lower.includes('from products')) {
      let prods = memoryDB.products.map(p => {
        const cat = memoryDB.categories.find(c => c.id === p.category_id);
        const br = memoryDB.brands.find(b => b.id === p.brand_id);
        return {
          ...p,
          category_name: cat ? cat.name : 'CCTV',
          category_slug: cat ? cat.slug : 'cctv',
          brand_name: br ? br.name : 'GS Vision'
        };
      });
      if (params && params.length > 0 && typeof params[0] === 'string' && !params[0].startsWith('%')) {
        const slug = params[0];
        const match = prods.filter(p => p.slug === slug || String(p.id) === String(slug));
        if (match.length > 0) {
          return [match, []];
        }
      }
      return [prods, []];
    }
    if (lower.includes('from downloads')) {
      return [memoryDB.downloads, []];
    }
    if (lower.includes('from gallery')) {
      return [memoryDB.gallery, []];
    }
    if (lower.includes('from testimonials')) {
      return [memoryDB.testimonials, []];
    }
    if (lower.includes('from enquiries')) {
      return [memoryDB.enquiries, []];
    }
    if (lower.includes('from dealer_applications')) {
      return [memoryDB.dealer_applications, []];
    }
    if (lower.includes('from contact_messages')) {
      return [memoryDB.contact_messages, []];
    }
    if (lower.includes('from website_settings')) {
      return [[memoryDB.website_settings], []];
    }
  }

  // 2. INSERT queries
  if (lower.startsWith('insert into')) {
    const id = Date.now();
    if (lower.includes('into enquiries')) {
      memoryDB.enquiries.unshift({ id, name: params[0], email: params[1], phone: params[2], company: params[3], city: params[4], product_name: params[5], quantity: params[6], message: params[7], status: 'pending', created_at: new Date() });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into dealer_applications')) {
      memoryDB.dealer_applications.unshift({ id, company_name: params[0], applicant_name: params[1], email: params[2], phone: params[3], city: params[4], state: params[5], pincode: params[6], business_address: params[7], gst_number: params[8], years_in_business: params[9], annual_turnover: params[10], existing_brands: params[11], message: params[12], status: 'pending', created_at: new Date() });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into contact_messages')) {
      memoryDB.contact_messages.unshift({ id, name: params[0], email: params[1], phone: params[2], subject: params[3], message: params[4], status: 'unread', created_at: new Date() });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into products')) {
      memoryDB.products.unshift({ id, name: params[2], slug: params[3], model_number: params[4], category_id: params[0], brand_id: params[1], short_description: params[5], description: params[6], main_image: params[7], price: params[8], show_price: params[9], featured: params[10], is_new: params[11], stock_status: params[12], brochure: params[13], status: params[16], created_at: new Date() });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into categories')) {
      memoryDB.categories.push({ id, name: params[0], slug: params[1], description: params[2], is_active: params[4] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into brands')) {
      memoryDB.brands.push({ id, name: params[0], slug: params[1], logo: params[2], website_url: params[3], description: params[4], is_active: params[5] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into banners')) {
      memoryDB.banners.push({ id, title: params[0], subtitle: params[1], button_text: params[2], button_link: params[3], image_url: params[4], display_order: params[5], is_active: params[6] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into offers')) {
      memoryDB.offers.push({ id, title: params[0], description: params[1], discount_percentage: params[2], coupon_code: params[3], valid_from: params[4], valid_until: params[5], image_url: params[6], is_active: params[7] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into downloads')) {
      memoryDB.downloads.push({ id, title: params[0], category: params[1], file_type: params[2], file_size: params[3], file_url: params[4], description: params[5], download_count: 0, is_active: params[6] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into gallery')) {
      memoryDB.gallery.push({ id, title: params[0], category: params[1], image_url: params[2], description: params[3], display_order: params[4], is_active: params[5] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into testimonials')) {
      memoryDB.testimonials.push({ id, client_name: params[0], company: params[1], designation: params[2], review: params[3], rating: params[4], avatar_url: params[5], is_featured: params[6], is_active: params[7] });
      return [{ insertId: id }, []];
    }
    if (lower.includes('into users')) {
      memoryDB.users.push({ id, name: params[0], email: params[1], password: params[2], role: params[3], created_at: new Date() });
      return [{ insertId: id }, []];
    }
    return [{ insertId: id }, []];
  }

  // 3. UPDATE queries
  if (lower.startsWith('update')) {
    if (lower.includes('website_settings')) {
      if (params && params.length >= 18) {
        memoryDB.website_settings = {
          company_name: params[0], tagline: params[1], contact_email: params[2], support_email: params[3],
          phone_primary: params[4], phone_secondary: params[5], whatsapp_number: params[6], address_line1: params[7],
          address_line2: params[8], city: params[9], state: params[10], pincode: params[11], country: params[12],
          facebook_url: params[13], twitter_url: params[14], instagram_url: params[15], linkedin_url: params[16],
          youtube_url: params[17], about_short: params[18]
        };
      }
      return [{ affectedRows: 1 }, []];
    }
    if (lower.includes('enquiries set status')) {
      const e = memoryDB.enquiries.find(x => String(x.id) === String(params[2]));
      if (e) { e.status = params[0]; e.notes = params[1]; }
      return [{ affectedRows: 1 }, []];
    }
    if (lower.includes('dealer_applications set status')) {
      const d = memoryDB.dealer_applications.find(x => String(x.id) === String(params[2]));
      if (d) { d.status = params[0]; d.notes = params[1]; }
      return [{ affectedRows: 1 }, []];
    }
    if (lower.includes('contact_messages set status')) {
      const m = memoryDB.contact_messages.find(x => String(x.id) === String(params[1]));
      if (m) { m.status = params[0]; }
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 1 }, []];
  }

  // 4. DELETE queries
  if (lower.startsWith('delete from')) {
    const id = params && params[0];
    if (lower.includes('products') && id) memoryDB.products = memoryDB.products.filter(p => String(p.id) !== String(id));
    if (lower.includes('categories') && id) memoryDB.categories = memoryDB.categories.filter(c => String(c.id) !== String(id));
    if (lower.includes('brands') && id) memoryDB.brands = memoryDB.brands.filter(b => String(b.id) !== String(id));
    if (lower.includes('banners') && id) memoryDB.banners = memoryDB.banners.filter(b => String(b.id) !== String(id));
    if (lower.includes('offers') && id) memoryDB.offers = memoryDB.offers.filter(o => String(o.id) !== String(id));
    if (lower.includes('downloads') && id) memoryDB.downloads = memoryDB.downloads.filter(d => String(d.id) !== String(id));
    if (lower.includes('gallery') && id) memoryDB.gallery = memoryDB.gallery.filter(g => String(g.id) !== String(id));
    if (lower.includes('testimonials') && id) memoryDB.testimonials = memoryDB.testimonials.filter(t => String(t.id) !== String(id));
    if (lower.includes('enquiries') && id) memoryDB.enquiries = memoryDB.enquiries.filter(e => String(e.id) !== String(id));
    if (lower.includes('dealer_applications') && id) memoryDB.dealer_applications = memoryDB.dealer_applications.filter(d => String(d.id) !== String(id));
    if (lower.includes('contact_messages') && id) memoryDB.contact_messages = memoryDB.contact_messages.filter(m => String(m.id) !== String(id));
    if (lower.includes('users') && id) memoryDB.users = memoryDB.users.filter(u => String(u.id) !== String(id));
    return [{ affectedRows: 1 }, []];
  }

  return [[], []];
}

async function initDatabase() {
  try {
    const tempConnection = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.end();

    pool = mysql.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    const [test] = await pool.query('SELECT 1');
    if (test) {
      isConnected = true;
      console.log(`[Database] Connected to live MySQL database '${env.DB_NAME}' successfully.`);
      await runSeed();
    }
  } catch (err) {
    isConnected = false;
    console.log(`[Database] MySQL service offline at ${env.DB_HOST}:${env.DB_PORT}. Active in High-Availability Hybrid In-Memory Mode with full seed datasets.`);
  }
  return { query };
}

module.exports = {
  query,
  initDatabase,
  initDB: initDatabase
};
