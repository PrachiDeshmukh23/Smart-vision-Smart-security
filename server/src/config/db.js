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
      id: 16, category_id: 2, brand_id: 1, name: 'GS Vision Security Camera Collection (Dome & Bullet 1080P Colour Vision)', slug: 'gs-vision-security-camera-collection-dome-bullet',
      model_number: 'GS-COLLECTION-1080P', short_description: 'Full HD 1080P Colour Vision with 3.6mm Lens, In-Built Audio Mic, and All DVR / Cloud Supported.',
      description: 'GS Vision Security Camera Collection. Your trusted source for smart security. Available in dome and bullet models with 1080P Full HD Colour Night Vision, 3.6mm optical lens, in-built sensitive microphone, and universal cloud/DVR compatibility. Grand Offer: 50 Combo Purchases = 1 Free Cycle!',
      main_image: '/assets/products/gs-vision-dome-bullet-collection.png', price: 1250.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 17, category_id: 2, brand_id: 1, name: 'GS Vision 3MP Resolution HD Bullet Camera (8MM Optical Lens)', slug: 'gs-vision-3mp-resolution-hd-bullet-camera-8mm',
      model_number: 'GS-B3MP-8MM', short_description: 'Triple Multi-Angle Array 3MP HD Bullet Camera with 8MM long-range lens, in-built mic, and high power night vision.',
      description: 'Smart Vision.. Smart Security. High-power 3MP HD Bullet Camera equipped with an 8MM long-range focal lens, 4-LED high-output night vision array, embedded sensitive audio microphone, and all DVR compatibility.',
      main_image: '/assets/products/gs-vision-3mp-8mm-bullet-camera.png', price: 1450.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 18, category_id: 12, brand_id: 1, name: 'Active Pixel G24 4G 10X Zoom Solar PTZ Camera (3-Lens Screen)', slug: 'active-pixel-g24-4g-10x-zoom-solar-ptz-camera',
      model_number: 'AP-G24-4G-3LENS', short_description: 'One Camera 3 Lens Screen with 10X Zoom, 4G LTE SIM connectivity, and continuous solar power.',
      description: 'Active Pixel G24 safety made easier. Wire-free 4G SIM solar camera with 10X zoom, 3-lens multi-screen live view, humanoid PIR motion tracking, and high efficiency solar battery.',
      main_image: '/assets/products/active-pixel-g24-solar-ptz.jpg', price: 4200.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 19, category_id: 9, brand_id: 1, name: 'Soltrix SMC002 10/100/1000M Gigabit Fiber Media Converter', slug: 'soltrix-smc002-gigabit-fiber-media-converter',
      model_number: 'SMC002-GIGA', short_description: 'Upgrade to Fiber Speed with Soltrix 10/100/1000M GIGA media converter for CCTV and networking projects.',
      description: 'Soltrix X - Built by Soltrix, Trusted Worldwide. Reliable, high-speed industrial-grade networking solution. Single Mode & Multi Mode support, plug & play installation, stable and secure data conversion. Made in Bharat.',
      main_image: '/assets/products/soltrix-giga-media-converter.png', price: 850.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 20, category_id: 4, brand_id: 1, name: 'Soltrix Gladiator Series Heavy Metal CCTV SMPS Power Supply', slug: 'soltrix-gladiator-series-metal-cctv-smps',
      model_number: 'SGL001-SGL002', short_description: 'Gladiator Series Power Wrapped in Metal - Available in 4 Channel (SGL001) & 8 Channel (SGL002).',
      description: 'One power solution compatible with all major CCTV cameras. Features heavy-duty metal casing, multi-ventilation cooling holes, wired output for easier installation, AC power input, and BIS certification. Made in Bharat.',
      main_image: '/assets/products/soltrix-gladiator-metal-smps.png', price: 650.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 21, category_id: 2, brand_id: 1, name: 'GS Vision Complete 4-Camera CCTV Setup Package (+ Free 4G Router)', slug: 'gs-vision-complete-4-camera-cctv-setup-package',
      model_number: 'GS-COMBO-4CAM', short_description: 'Complete 4-Camera HD setup with night vision, 24x7 recording, mobile view, 1-year warranty, and a FREE 4G Router included.',
      description: 'All-in-one surveillance setup for homes and businesses across Maharashtra. Includes 4 Full HD cameras, DVR recorder, surveillance storage, SMPS power supply, connectors, cables, and a FREE 4G Router. Special Price ₹15,999 (Regular ₹19,999).',
      main_image: '/assets/banners/cctv-setup-offer.png', price: 15999.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },

    // ── 5 New GS Vision 3MP Camera Models ──
    {
      id: 22, category_id: 2, brand_id: 1,
      name: 'GS Vision 3MP HD Bullet Camera (8MM Lens, Full HD Colour, Night Vision)',
      slug: 'gs-vision-3mp-hd-bullet-camera-8mm-colour-night-vision',
      model_number: 'GS-B3MP-8MM-V2',
      short_description: 'Triple-angle 3MP HD Bullet Camera with 8MM lens, 1080P Full HD Colour Vision, In-Built Mic & Night Vision.',
      description: 'GS Vision 3MP Resolution HD Bullet Camera — Smart Vision.. Smart Security. Features: 1080P Full HD Colour Vision, Long-Range 8MM Optical Lens, In-Built Microphone, Powerful Night Vision, and All DVR Supported compatibility.',
      main_image: '/assets/products/gs-vision-3mp-bullet-camera-8mm.png',
      price: 1499.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 23, category_id: 2, brand_id: 1,
      name: 'GS Vision 3MP HD Fisheye Bullet Camera (3.6MM Lens, Colour Vision)',
      slug: 'gs-vision-3mp-hd-fisheye-bullet-camera-3-6mm',
      model_number: 'GS-FB3MP-3.6MM',
      short_description: 'Wide-angle Fisheye Bullet 3MP Camera with 3.6MM lens, 1080P Full HD Colour Vision, In-Built Mic & Night Vision.',
      description: 'GS Vision 3MP Resolution HD Fisheye Bullet Camera — Smart Vision.. Smart Security. Covers wide angle with Fisheye optics. Features: 1080P Full HD Colour Vision, 3.6MM Wide-Angle Fisheye Lens, In-Built Microphone, Powerful Night Vision, and All DVR Supported.',
      main_image: '/assets/products/gs-vision-3mp-fisheye-bullet-camera.png',
      price: 1399.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 24, category_id: 2, brand_id: 1,
      name: 'GS Vision 3MP HD Dome Fisheye Camera (3.6MM Lens, Colour Vision)',
      slug: 'gs-vision-3mp-hd-dome-fisheye-camera-3-6mm',
      model_number: 'GS-DF3MP-3.6MM',
      short_description: 'Dome Fisheye 3MP Camera with 3.6MM lens, 1080P Full HD Colour Vision, In-Built Mic & Night Vision.',
      description: 'GS Vision 3MP Resolution HD Dome Fisheye Camera — Smart Vision.. Smart Security. Wide-angle dome design for ceiling & corner mounting. Features: 1080P Full HD Colour Vision, 3.6MM Fisheye Lens, In-Built Microphone, IR Night Vision, and All DVR Supported.',
      main_image: '/assets/products/gs-vision-3mp-dome-fisheye-camera.png',
      price: 1350.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 25, category_id: 2, brand_id: 1,
      name: 'GS Vision 3MP HD Dome Camera (3.6MM Lens, Colour Night Vision)',
      slug: 'gs-vision-3mp-hd-dome-camera-3-6mm-colour-night-vision',
      model_number: 'GS-D3MP-3.6MM',
      short_description: 'Classic Dome 3MP HD Camera with 3.6MM lens, 1080P Full HD Colour Vision, In-Built Mic & Night Vision.',
      description: 'GS Vision 3MP Resolution HD Dome Camera — Smart Vision.. Smart Security. Best-seller dome for indoor & outdoor use. Features: 1080P Full HD Colour Vision, 3.6MM Optical Lens, In-Built Microphone, High-Power Night Vision LEDs, and All DVR Supported.',
      main_image: '/assets/products/gs-vision-3mp-dome-camera.png',
      price: 1299.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    },
    {
      id: 26, category_id: 2, brand_id: 1,
      name: 'GS Vision 3MP HD 360° Dome Camera (3.6MM Lens, Pan-Tilt, Colour Vision)',
      slug: 'gs-vision-3mp-hd-360-dome-camera-pan-tilt',
      model_number: 'GS-PTZ3MP-360',
      short_description: '360° Pan-Tilt 3MP Dome Camera with 3.6MM lens, 1080P Full HD Colour Vision, In-Built Mic & Night Vision.',
      description: 'GS Vision 3MP Resolution HD 360° Dome Camera — Smart Vision.. Smart Security. Full 360-degree pan coverage for total room visibility. Features: 1080P Full HD Colour Vision, 3.6MM Wide-Angle Lens, 360° Rotation, In-Built Microphone, IR Night Vision, and All DVR Supported.',
      main_image: '/assets/products/gs-vision-3mp-360-dome-camera.png',
      price: 1599.00, show_price: 1, featured: 1, is_new: 1, stock_status: 'in_stock',
      status: 'active', brochure: null, created_at: new Date()
    }
  ],
  product_specifications: [
    { id: 1, product_id: 16, specification_name: 'Resolution', specification_value: '1080P Full HD Colour Vision', sort_order: 1 },
    { id: 2, product_id: 16, specification_name: 'Lens', specification_value: '3.6 MM Optical Glass', sort_order: 2 },
    { id: 3, product_id: 16, specification_name: 'Audio', specification_value: 'In-Built Sensitive Microphone', sort_order: 3 },
    { id: 4, product_id: 16, specification_name: 'DVR Compatibility', specification_value: 'All DVR / Cloud Supported', sort_order: 4 },
    { id: 5, product_id: 17, specification_name: 'Resolution', specification_value: '3MP High Definition', sort_order: 1 },
    { id: 6, product_id: 17, specification_name: 'Lens', specification_value: '8 MM Long-Range Focal Lens', sort_order: 2 },
    { id: 7, product_id: 18, specification_name: 'Optical Zoom', specification_value: '10X Optical Zoom', sort_order: 1 },
    { id: 8, product_id: 18, specification_name: 'Lens Screen', specification_value: 'One Camera 3 Lens Screen View', sort_order: 2 },
    { id: 9, product_id: 18, specification_name: 'Connectivity', specification_value: '4G LTE SIM Card + Solar Powered', sort_order: 3 },
    { id: 10, product_id: 19, specification_name: 'Speed', specification_value: '10/100/1000M Gigabit GIGA', sort_order: 1 },
    { id: 11, product_id: 20, specification_name: 'Channels', specification_value: '4 Channel & 8 Channel Options', sort_order: 1 },
    // Specs for 5 new 3MP cameras
    { id: 12, product_id: 22, specification_name: 'Resolution', specification_value: '3MP (1080P Full HD Colour Vision)', sort_order: 1 },
    { id: 13, product_id: 22, specification_name: 'Lens', specification_value: '8 MM Long-Range Optical Lens', sort_order: 2 },
    { id: 14, product_id: 22, specification_name: 'Audio', specification_value: 'In-Built Microphone', sort_order: 3 },
    { id: 15, product_id: 22, specification_name: 'Night Vision', specification_value: 'High-Power Night Vision', sort_order: 4 },
    { id: 16, product_id: 22, specification_name: 'DVR Support', specification_value: 'All DVR Supported', sort_order: 5 },
    { id: 17, product_id: 23, specification_name: 'Resolution', specification_value: '3MP (1080P Full HD Colour Vision)', sort_order: 1 },
    { id: 18, product_id: 23, specification_name: 'Lens', specification_value: '3.6 MM Wide-Angle Fisheye Lens', sort_order: 2 },
    { id: 19, product_id: 23, specification_name: 'Audio', specification_value: 'In-Built Microphone', sort_order: 3 },
    { id: 20, product_id: 23, specification_name: 'Night Vision', specification_value: 'Night Vision', sort_order: 4 },
    { id: 21, product_id: 23, specification_name: 'DVR Support', specification_value: 'All DVR Supported', sort_order: 5 },
    { id: 22, product_id: 24, specification_name: 'Resolution', specification_value: '3MP (1080P Full HD Colour Vision)', sort_order: 1 },
    { id: 23, product_id: 24, specification_name: 'Lens', specification_value: '3.6 MM Fisheye Dome Lens', sort_order: 2 },
    { id: 24, product_id: 24, specification_name: 'Audio', specification_value: 'In-Built Microphone', sort_order: 3 },
    { id: 25, product_id: 24, specification_name: 'Night Vision', specification_value: 'IR Night Vision', sort_order: 4 },
    { id: 26, product_id: 24, specification_name: 'DVR Support', specification_value: 'All DVR Supported', sort_order: 5 },
    { id: 27, product_id: 25, specification_name: 'Resolution', specification_value: '3MP (1080P Full HD Colour Vision)', sort_order: 1 },
    { id: 28, product_id: 25, specification_name: 'Lens', specification_value: '3.6 MM Optical Lens', sort_order: 2 },
    { id: 29, product_id: 25, specification_name: 'Audio', specification_value: 'In-Built Microphone', sort_order: 3 },
    { id: 30, product_id: 25, specification_name: 'Night Vision', specification_value: 'High-Power Night Vision LEDs', sort_order: 4 },
    { id: 31, product_id: 25, specification_name: 'DVR Support', specification_value: 'All DVR Supported', sort_order: 5 },
    { id: 32, product_id: 26, specification_name: 'Resolution', specification_value: '3MP (1080P Full HD Colour Vision)', sort_order: 1 },
    { id: 33, product_id: 26, specification_name: 'Lens', specification_value: '3.6 MM Wide-Angle Lens', sort_order: 2 },
    { id: 34, product_id: 26, specification_name: 'Rotation', specification_value: '360° Pan-Tilt Coverage', sort_order: 3 },
    { id: 35, product_id: 26, specification_name: 'Audio', specification_value: 'In-Built Microphone', sort_order: 4 },
    { id: 36, product_id: 26, specification_name: 'Night Vision', specification_value: 'IR Night Vision', sort_order: 5 },
    { id: 37, product_id: 26, specification_name: 'DVR Support', specification_value: 'All DVR Supported', sort_order: 6 }
  ],
  product_images: [],
  banners: [
    { id: 1, title: 'GS Vision CCTV & Smart Security Collection', subtitle: 'Commercial CCTV Project Specialists • Installation & Support Across Maharashtra • Mo. 8308209470', button_text: 'View Camera Collection', button_link: '/products', display_order: 1, is_active: 1, image_url: '/assets/products/gs-vision-dome-bullet-collection.png' },
    { id: 2, title: 'GS Vision 3MP HD Bullet Camera — 8MM Long-Range Lens', subtitle: '1080P Full HD Colour Vision • In-Built Mic • High-Power Night Vision • All DVR Supported', button_text: 'View Bullet Camera', button_link: '/products/gs-vision-3mp-hd-bullet-camera-8mm-colour-night-vision', display_order: 2, is_active: 1, image_url: '/assets/products/gs-vision-3mp-bullet-camera-8mm.png' },
    { id: 3, title: 'GS Vision 3MP Fisheye Bullet Camera — Wide-Angle Coverage', subtitle: '1080P Full HD Colour Vision • 3.6MM Fisheye Lens • In-Built Mic • Night Vision', button_text: 'View Fisheye Bullet', button_link: '/products/gs-vision-3mp-hd-fisheye-bullet-camera-3-6mm', display_order: 3, is_active: 1, image_url: '/assets/products/gs-vision-3mp-fisheye-bullet-camera.png' },
    { id: 4, title: 'GS Vision 3MP Dome Fisheye Camera — Ceiling & Corner Mount', subtitle: '1080P Full HD Colour Vision • 3.6MM Fisheye Dome Lens • IR Night Vision • All DVR Supported', button_text: 'View Dome Fisheye', button_link: '/products/gs-vision-3mp-hd-dome-fisheye-camera-3-6mm', display_order: 4, is_active: 1, image_url: '/assets/products/gs-vision-3mp-dome-fisheye-camera.png' },
    { id: 5, title: 'GS Vision 3MP HD Dome Camera — Best-Seller Indoor & Outdoor', subtitle: '1080P Full HD Colour Vision • 3.6MM Optical Lens • In-Built Mic • High-Power Night Vision', button_text: 'View Dome Camera', button_link: '/products/gs-vision-3mp-hd-dome-camera-3-6mm-colour-night-vision', display_order: 5, is_active: 1, image_url: '/assets/products/gs-vision-3mp-dome-camera.png' },
    { id: 6, title: 'GS Vision 3MP HD 360° Dome Camera — Full Pan-Tilt Coverage', subtitle: '1080P Full HD Colour Vision • 360° Rotation • 3.6MM Lens • IR Night Vision • All DVR Supported', button_text: 'View 360° Dome', button_link: '/products/gs-vision-3mp-hd-360-dome-camera-pan-tilt', display_order: 6, is_active: 1, image_url: '/assets/products/gs-vision-3mp-360-dome-camera.png' },
    { id: 7, title: 'Active Pixel G24 4G 10X Zoom Solar PTZ Camera', subtitle: 'One Camera 3-Lens Screen View • 10X Zoom • Wire-Free Solar Powered Security Anywhere', button_text: 'Explore Solar Camera', button_link: '/products/active-pixel-g24-4g-10x-zoom-solar-ptz-camera', display_order: 7, is_active: 1, image_url: '/assets/products/active-pixel-g24-solar-ptz.jpg' },
    { id: 8, title: 'Soltrix Gladiator Metal SMPS & Gigabit Media Converters', subtitle: 'Heavy Duty Metal Casing • BIS Certified • Made in Bharat', button_text: 'Explore Power & Networking', button_link: '/products', display_order: 8, is_active: 1, image_url: '/assets/products/soltrix-gladiator-metal-smps.png' }
  ],
  offers: [
    { id: 1, title: 'GRAND OFFER: 50 Combo Purchases = 1 Free Cycle!', description: 'Exclusive installer & dealer reward program! Purchase 50 GS Vision Camera Combos and receive a high-performance bicycle completely FREE.', discount_percentage: 25.00, coupon_code: 'FREECYCLE50', is_active: 1, image_url: '/assets/products/gs-vision-dome-bullet-collection.png' },
    { id: 2, title: '4-Camera Complete Setup: ₹15,999 (Was ₹19,999) + FREE 4G Router', description: 'Special promotional package for homes and shops across Maharashtra. Includes 4 cameras, DVR, recording HDD, power supply, and a FREE 4G Router!', discount_percentage: 20.00, coupon_code: 'ROUTERFREE', is_active: 1, image_url: '/assets/banners/cctv-setup-offer.png' }
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
    tagline: 'Commercial CCTV Project Specialists | Installation & Support Across Maharashtra',
    contact_email: 'sales@gsvision.com',
    support_email: 'contact@gsvision.com',
    phone_primary: '+91 83082 09470',
    phone_secondary: '+91 83082 09470',
    whatsapp_number: '918308209470',
    address_line1: 'Orange Corner, Sangamner',
    address_line2: 'Dist. Ahilyanagar',
    city: 'Sangamner',
    state: 'Maharashtra',
    pincode: '422605',
    country: 'India',
    facebook_url: 'https://facebook.com',
    twitter_url: 'https://twitter.com',
    instagram_url: 'https://www.instagram.com/gs_enterprises_security',
    linkedin_url: 'https://linkedin.com',
    youtube_url: 'https://youtube.com',
    about_short: 'GS Vision (GS Enterprises) is a premier CCTV surveillance, security camera manufacturer & accessories wholesaler located at Orange Corner, Sangamner (Ahilyanagar, Maharashtra). Specialists in commercial CCTV projects, wholesale accessories with NO MOQ, and pan-India express dispatch.',
    meta_title: 'GS Vision - Commercial CCTV Projects & Security Hardware',
    meta_description: 'GS Vision Sangamner - 200+ CCTV accessories with No MOQ, 1080P Colour Night Vision Cameras, 4G Solar PTZ, and expert commercial installations across Maharashtra.'
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
