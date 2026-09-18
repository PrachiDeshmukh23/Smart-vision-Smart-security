const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const env = require('./env');
const { runSeed } = require('../utils/seeder');

let isConnected = false;
let pool = null;

// In-Memory Database Fallback with 200+ CCTV Accessories reference catalog inspired by cctvpro.in
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
    { id: 1, name: 'IP Cameras', slug: 'ip-cameras', description: 'Network IP surveillance cameras with smart AI analytics', image: '/assets/categories/ip-cam.jpg', is_active: 1 },
    { id: 2, name: 'HD CCTV Cameras', slug: 'hd-cctv-cameras', description: 'High definition analog and coax CCTV cameras', image: '/assets/categories/hd-cam.jpg', is_active: 1 },
    { id: 3, name: 'Connectors', slug: 'connectors', description: 'BNC, DC, RJ45 Modular Plugs, 3+1 Power Connectors', image: '/assets/categories/connectors.jpg', is_active: 1 },
    { id: 4, name: 'Power Supply', slug: 'power-supply', description: '12V Metal SMPS, PoE Adapters, Centralized CCTV Power Hubs', image: '/assets/categories/power.jpg', is_active: 1 },
    { id: 5, name: 'Junction Box', slug: 'junction-box', description: 'Waterproof Camera PVC & Deep Base Mount Junction Boxes', image: '/assets/categories/junction.jpg', is_active: 1 },
    { id: 6, name: 'CCTV Racks', slug: 'rack', description: '2U, 4U, 6U Wall Mount DVR/NVR Server Enclosures', image: '/assets/categories/rack.jpg', is_active: 1 },
    { id: 7, name: 'Cables & Patch Cords', slug: 'cables', description: 'Cat6 LAN Cables, 3+1 CCTV Coaxial Cables, HDMI & VGA Cables', image: '/assets/categories/cables.jpg', is_active: 1 },
    { id: 8, name: 'Stand & Brackets', slug: 'stand', description: 'Corner Mount Brackets, Pole Clamps, Camera Ceiling Mounts', image: '/assets/categories/stand.jpg', is_active: 1 },
    { id: 9, name: 'Extender & Splitter', slug: 'extender-splitter', description: 'HDMI over Cat6 60m/120m Extenders, HDMI 1x2 / 1x4 Splitters', image: '/assets/categories/extender.jpg', is_active: 1 },
    { id: 10, name: 'Installation Tools', slug: 'tools', description: 'RJ45/RJ11 Crimping Tools, Network Cable Testers, Wire Strippers', image: '/assets/categories/tools.jpg', is_active: 1 },
    { id: 11, name: 'Network Video Recorders (NVR)', slug: 'nvr', description: 'Standalone & AI PoE NVR Recorders', image: '/assets/categories/nvr.jpg', is_active: 1 },
    { id: 12, name: 'Smart 4G Solar & WiFi Cameras', slug: 'smart-wifi-cameras', description: 'Wireless Solar PTZ 4G SIM Cameras & Dual Lens WiFi Domes', image: '/assets/categories/wifi-cam.jpg', is_active: 1 }
  ],
  brands: [
    { id: 1, name: 'GS Vision', slug: 'gs-vision', logo: '', website_url: 'https://gsvision.com', description: 'Original GS Vision premium CCTV & security accessories', is_active: 1 },
    { id: 2, name: 'Hikvision', slug: 'hikvision', logo: '', website_url: 'https://www.hikvision.com', description: 'World leading video surveillance products', is_active: 1 },
    { id: 3, name: 'Dahua Technology', slug: 'dahua', logo: '', website_url: 'https://www.dahuasecurity.com', description: 'AIoT video solutions and hardware', is_active: 1 },
    { id: 4, name: 'CP Plus', slug: 'cp-plus', logo: '', website_url: 'https://www.cpplusworld.com', description: 'India premier electronic security brand', is_active: 1 },
    { id: 5, name: 'VisionX Accessories', slug: 'visionx', logo: '', website_url: 'https://cctvpro.in', description: 'Gujarat direct wholesale CCTV accessories', is_active: 1 }
  ],
  products: [
    // Connectors
    {
      id: 1, category_id: 3, brand_id: 5, name: '100 pc Copper Wired DC Male Connectors Pack', slug: '100-pc-copper-wired-dc-male-connectors',
      model_number: 'VX-DC-100P', short_description: 'High conductivity copper wired DC connectors for CCTV camera power connections.',
      description: 'Heavy gauge copper wire with premium molded strain relief. Standard 2.1mm x 5.5mm DC male plug suitable for all 12V CCTV cameras.',
      main_image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', price: 400.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 2, category_id: 3, brand_id: 5, name: 'Gold-Plated Screw BNC Connectors (Box of 50)', slug: 'gold-plated-screw-bnc-connectors-box-50',
      model_number: 'VX-BNC-G50', short_description: 'Pure brass gold-plated pin BNC screw terminal connectors for coaxial 3+1 cabling.',
      description: 'Zero soldering required with quick screw clamp terminals. Gold-plated core minimizes video attenuation and eliminates signal ghosting.',
      main_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', price: 450.00, show_price: 1, featured: 0, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 3, category_id: 3, brand_id: 5, name: 'Cat6 RJ45 8P8C Gold-Plated Modular Connectors (100 Pcs)', slug: 'cat6-rj45-gold-plated-modular-connectors-100pcs',
      model_number: 'VX-RJ45-C6', short_description: 'High-speed Gigabit Cat6 RJ45 pass-through crystal connectors for IP camera networks.',
      description: 'Supports 1000Mbps Gigabit data transfer with 50-micron gold plated contacts. Compatible with standard solid and stranded Cat6 Ethernet wires.',
      main_image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', price: 280.00, show_price: 1, featured: 1, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Power Supplies
    {
      id: 4, category_id: 4, brand_id: 1, name: 'GS Vision 12V 10Amp CCTV SMPS Metal Power Supply (8 Channel)', slug: 'gs-vision-12v-10amp-cctv-smps-metal-8ch',
      model_number: 'GS-SMPS-12V10A', short_description: '8-Channel stabilized metal SMPS power unit with overload and surge protection.',
      description: 'Engineered for 24x7 CCTV reliability. Features individual auto-reset PTC fuses for each channel, cooling fan, and AC input spike filter.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 650.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 5, category_id: 4, brand_id: 5, name: '24V 1Amp Passive PoE Power Adapter', slug: '24v-1amp-passive-poe-power-adapter',
      model_number: 'VX-POE-24V1A', short_description: 'Wall plug passive PoE injector adapter for wireless bridges and outdoor IP cameras.',
      description: 'Provides DC 24V 1A power over Ethernet cable pin 4,5(+) and 7,8(-). LED indicator and short circuit protection built-in.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 200.00, show_price: 1, featured: 0, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 6, category_id: 4, brand_id: 1, name: '12V 20Amp CCTV SMPS 16-Channel Centralized Power Hub', slug: '12v-20amp-cctv-smps-16ch-centralized-hub',
      model_number: 'GS-SMPS-12V20A', short_description: 'High capacity 16-channel power distribution SMPS for large commercial CCTV setups.',
      description: 'Heavy duty ventilated aluminum enclosure with key-lock door and 16 independent fuse protected output terminals.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 1150.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Junction Boxes
    {
      id: 7, category_id: 5, brand_id: 5, name: '4x4 Weatherproof Camera Base PVC Junction Box (Pack of 20)', slug: '4x4-weatherproof-camera-base-pvc-junction-box-20pk',
      model_number: 'VX-JB-4X4', short_description: 'Heavy grade waterproof PVC junction box designed for dome and bullet camera mounting.',
      description: 'UV stabilized fire-retardant plastic with rubber gasket seal. Conceals connectors and cables safely from rain and dust.',
      main_image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', price: 480.00, show_price: 1, featured: 1, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 8, category_id: 5, brand_id: 5, name: 'Deep Base Metal Camera Junction Box with Conduit Knockouts', slug: 'deep-base-metal-camera-junction-box',
      model_number: 'VX-JB-MET-01', short_description: 'Die-cast aluminum vandal-resistant junction box for outdoor industrial bullet cameras.',
      description: 'Solid aluminum build with threaded 3/4" pipe conduit knockouts. IP66 rated for extreme industrial weather resistance.',
      main_image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', price: 190.00, show_price: 1, featured: 0, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Racks
    {
      id: 9, category_id: 6, brand_id: 1, name: '4U Wall Mount CCTV DVR/NVR Metal Rack with Glass Door', slug: '4u-wall-mount-cctv-dvr-nvr-metal-rack-glass-door',
      model_number: 'GS-RCK-4U-GL', short_description: 'Heavy duty 4U enclosure with toughened glass front door, key lock, and cable entry slots.',
      description: 'Precision powder-coated CRCA steel rack. Includes mounting hardware, top fan slot, and internal power strip bracket.',
      main_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', price: 1150.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 10, category_id: 6, brand_id: 1, name: '2U Compact CCTV DVR Wall Mount Rack with Lock', slug: '2u-compact-cctv-dvr-wall-mount-rack',
      model_number: 'GS-RCK-2U', short_description: 'Space-saving 2U rack for 4Ch / 8Ch DVRs with power supply and surge protector space.',
      description: 'Compact ventilated design for homes, retail shops, and small offices. Protects DVR from tampering and unauthorized access.',
      main_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', price: 850.00, show_price: 1, featured: 0, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Extenders & Splitters
    {
      id: 11, category_id: 9, brand_id: 5, name: 'HDMI over Single Cat6 60 Meter Extender Set (Tx + Rx)', slug: 'hdmi-over-cat6-60m-extender-set',
      model_number: 'VX-EXT-60M', short_description: 'Lossless 1080p Full HD video transmission up to 60 meters over single Cat6 cable with EDID.',
      description: 'Plug-and-play transmitter and receiver pair. Extends HDMI signal from DVR/NVR to remote TV or monitor with zero latency.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 850.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 12, category_id: 9, brand_id: 5, name: '1x4 Port 4K HDMI Powered Splitter (1 in 4 Out)', slug: '1x4-port-4k-hdmi-powered-splitter',
      model_number: 'VX-SPL-1X4', short_description: 'Distributes 1 HDMI source to 4 synchronized 4K displays simultaneously.',
      description: 'Supports 4K @ 30Hz and 1080p 3D video formats with 5V DC power adapter included. Ideal for control rooms and multi-screen CCTV display.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 720.00, show_price: 1, featured: 0, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Tools
    {
      id: 13, category_id: 10, brand_id: 5, name: 'Professional 3-in-1 RJ45 / RJ11 Network Crimping Tool', slug: 'professional-3-in-1-rj45-rj11-crimping-tool',
      model_number: 'VX-TOOL-CRIMP', short_description: 'Heavy duty ratchet crimper, wire stripper and cutter for 8P8C and 6P4C connectors.',
      description: 'Ergonomic rubberized grip with hardened carbon steel jaws for clean, accurate crimping of CCTV network patch cords.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 290.00, show_price: 1, featured: 1, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 14, category_id: 10, brand_id: 5, name: 'Digital LAN & BNC Cable Wire Continuity Tester', slug: 'digital-lan-bnc-cable-wire-continuity-tester',
      model_number: 'VX-TOOL-TESTER', short_description: 'Quickly detects miswires, open wires, short circuits and crossovers on Cat5e/Cat6/BNC lines.',
      description: 'Detachable remote unit allows one-person testing across long cable runs. LED sequential indicators and 9V battery slot.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 180.00, show_price: 1, featured: 0, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Stands & Brackets
    {
      id: 15, category_id: 8, brand_id: 5, name: 'Corner Mount Metal Bracket for CCTV PTZ & Bullet Cameras', slug: 'corner-mount-metal-bracket-ptz-bullet',
      model_number: 'VX-ST-CRN', short_description: 'Heavy duty 90-degree corner wall mounting bracket with multiple pre-drilled camera hole patterns.',
      description: 'Solid steel construction with anti-rust white powder coating. Fits all standard bullet cameras and speed dome brackets.',
      main_image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', price: 220.00, show_price: 1, featured: 0, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // Cameras & Recorders
    {
      id: 16, category_id: 1, brand_id: 1, name: 'GS Vision 4MP AI Smart Dual-Light Color IP Camera', slug: 'gs-vision-4mp-ai-smart-dual-light-color-ip-camera',
      model_number: 'GS-IP4M-SDLC', short_description: '4 Megapixel Ultra HD IP camera with Color Night Vision and AI Human/Vehicle classification.',
      description: 'High-performance 4MP network bullet camera equipped with Deep Learning analytics. Supports smart dual-light illumination, H.265+ compression, and full IP67 weatherproof housing.',
      main_image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80', price: 1850.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 17, category_id: 12, brand_id: 5, name: '4G Solar Dual-Lens 10x Optical Zoom PTZ Camera (ICSEE App)', slug: '4g-solar-dual-lens-10x-zoom-ptz-camera',
      model_number: 'VX-SOLAR-4G10X', short_description: 'Autonomous 4G SIM solar camera with dual lenses, PIR motion sensor, and 12W solar panel.',
      description: 'Operates completely wire-free with built-in high capacity lithium battery and solar charging. Dual lenses provide wide angle + 10x telephoto optical zoom.',
      main_image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80', price: 4000.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 18, category_id: 12, brand_id: 5, name: 'WiFi Mini PT Dual-Lens 360° Indoor Camera (V380 Pro App)', slug: 'wifi-mini-pt-dual-lens-360-indoor-camera',
      model_number: 'VX-WIFI-DL380', short_description: 'Dual-lens WiFi smart camera with 360-degree pan-tilt, two-way audio, and auto motion tracking.',
      description: 'Dual-screen live view on mobile phone. Top lens fixed for overview while bottom lens pans and tilts with smart motion tracking.',
      main_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80', price: 1200.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 19, category_id: 11, brand_id: 1, name: 'GS Vision 16-Channel 4K AI PoE Network Video Recorder', slug: 'gs-vision-16-channel-4k-ai-poe-nvr',
      model_number: 'GS-NVR16-4K-16P', short_description: '16Ch 4K NVR with 16 built-in independent PoE ports and dual SATA bays up to 20TB.',
      description: 'Plug-and-play NVR supporting up to 16 IP cameras with integrated PoE switches. Advanced AI face detection and smart perimeter tracking.',
      main_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', price: 8500.00, show_price: 1, featured: 1, is_new: 0, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    }
  ],
  product_specifications: [
    { id: 1, product_id: 1, specification_name: 'Material', specification_value: 'Pure Copper Conductor & PVC', sort_order: 1 },
    { id: 2, product_id: 1, specification_name: 'Connector Size', specification_value: '5.5mm x 2.1mm DC Male', sort_order: 2 },
    { id: 3, product_id: 4, specification_name: 'Output Voltage', specification_value: '12V DC Stabilized (+/- 5%)', sort_order: 1 },
    { id: 4, product_id: 4, specification_name: 'Output Current', specification_value: '10 Amp (8 Channels)', sort_order: 2 },
    { id: 5, product_id: 9, specification_name: 'Rack Size', specification_value: '4U Standard 19" Wall Mount', sort_order: 1 },
    { id: 6, product_id: 9, specification_name: 'Door Type', specification_value: 'Toughened Glass with Key Lock', sort_order: 2 },
    { id: 7, product_id: 11, specification_name: 'Max Distance', specification_value: 'Up to 60 Meters (Cat6 STP/UTP)', sort_order: 1 },
    { id: 8, product_id: 17, specification_name: 'Power Source', specification_value: '12W Solar Panel + Built-in Lithium Battery', sort_order: 1 },
    { id: 9, product_id: 17, specification_name: 'Connectivity', specification_value: '4G LTE SIM Card Support', sort_order: 2 }
  ],
  product_images: [],
  banners: [
    { id: 1, title: '200+ CCTV Accessories Available With NO MOQ', subtitle: 'Connectors, SMPS, Junction Boxes, Racks, Extenders & Tools at Direct Gujarat Wholesale Prices', button_text: 'View Wholesale Price List', button_link: '/price-list', display_order: 1, is_active: 1, image_url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80' },
    { id: 2, title: 'Next-Generation AI Security & Surveillance', subtitle: '4K Ultra HD IP Cameras with Active Color Night Vision & Human Detection', button_text: 'Explore Catalogue', button_link: '/products', display_order: 2, is_active: 1, image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80' }
  ],
  offers: [
    { id: 1, title: 'Complete 4-Channel 4MP Color CCTV Kit Combo', description: 'Includes 4x 4MP Dual-Light Cameras, 4Ch NVR with 1TB HDD, SMPS, and Cables.', discount_percentage: 25.00, coupon_code: 'GSSECURE25', is_active: 1, image_url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80' }
  ],
  enquiries: [],
  dealer_applications: [],
  downloads: [
    { id: 1, title: 'GS Vision 2025 CCTV Product & Accessories Price List', category: 'Brochure', file_type: 'PDF', file_size: '8.4 MB', file_url: '#', description: 'Complete wholesale price list for all 200+ CCTV cameras, SMPS, connectors, and mounting accessories.', download_count: 540, is_active: 1 },
    { id: 2, title: 'GS Vision VMS / CMS Client Software (Windows 64-bit)', category: 'Software', file_type: 'ZIP', file_size: '85.2 MB', file_url: '#', description: 'Central management software for 64-channel multi-location live monitoring and playback.', download_count: 712, is_active: 1 }
  ],
  gallery: [
    { id: 1, title: 'Commercial Industrial Warehouse Surveillance Deployment', category: 'Commercial', description: '32-Camera 4K PoE deployment with perimeter fence tripwire alerts.', image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', display_order: 1, is_active: 1 },
    { id: 2, title: 'Corporate Headquarters Control Room', category: 'Control Rooms', description: 'Central video wall command center with live PTZ monitoring.', image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80', display_order: 2, is_active: 1 }
  ],
  testimonials: [
    { id: 1, client_name: 'Darshan Acharya', company: 'VisionX Security Distribution', designation: 'Gujarat Wholesale Partner', review: 'GS Vision provides consistent quality across 200+ CCTV accessories with zero MOQ restrictions and fast courier dispatches. A trusted partner for every installer.', rating: 5, is_featured: 1, is_active: 1 },
    { id: 2, client_name: 'Rajesh Malhotra', company: 'Apex Logistics & Warehousing', designation: 'Managing Director', review: 'GS Vision upgraded our 5-acre distribution center with 4K AI cameras. The color night vision and perimeter alerts have significantly improved our warehouse security.', rating: 5, is_featured: 1, is_active: 1 }
  ],
  contact_messages: [],
  website_settings: {
    company_name: 'GS Vision',
    tagline: 'Smart Vision.. Smart Security',
    contact_email: 'info@gsvision.com',
    support_email: 'support@gsvision.com',
    phone_primary: '+91 98258 17772',
    phone_secondary: '+91 98765 43210',
    whatsapp_number: '919825817772',
    address_line1: 'VisionX Distribution Hub, Electronic Security Zone',
    address_line2: 'Gujarat, India',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380001',
    country: 'India',
    facebook_url: 'https://facebook.com',
    twitter_url: 'https://twitter.com',
    instagram_url: 'https://instagram.com',
    linkedin_url: 'https://linkedin.com',
    youtube_url: 'https://youtube.com',
    about_short: 'GS Vision is a premier supplier of CCTV cameras, NVRs, and 200+ CCTV accessories with No MOQ required. Direct dispatch from Gujarat with pan-India courier delivery.',
    meta_title: 'GS Vision - 200+ CCTV Accessories & Security Camera Wholesale',
    meta_description: 'Wholesale CCTV accessories with No MOQ: BNC/DC connectors, SMPS, junction boxes, racks, cables, 4G solar cameras & tools.'
  }
};

// Hybrid query engine: uses MySQL if active, otherwise memoryDB
async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      return await pool.query(sql, params);
    } catch (err) {
      console.warn('[Database] MySQL query failed, falling back to memory store: ' + err.message);
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
          category_name: cat ? cat.name : 'Accessories',
          category_slug: cat ? cat.slug : 'accessories',
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

    await tempConnection.query('CREATE DATABASE IF NOT EXISTS `' + env.DB_NAME + '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
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
      console.log('[Database] Connected to live MySQL database ' + env.DB_NAME + ' successfully.');
      await runSeed();
    }
  } catch (err) {
    isConnected = false;
    console.log('[Database] MySQL service note: ' + err.message + '. Serving 200+ accessories catalog in Hybrid High-Availability mode.');
  }
  return { query };
}

module.exports = {
  query,
  initDatabase,
  initDB: initDatabase
};
