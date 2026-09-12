# GS Vision - Smart Vision.. Smart Security
### Full-Stack Security Camera & Surveillance Products Management Web Application

A complete, production-ready full-stack enterprise web application and product catalogue system for **GS Vision**, an advanced CCTV, IP cameras, NVR/DVR surveillance systems, networking, and security solutions company.

---

## ?? Key Features

### ?? Public Website & Customer Experience
- **Hero Slider & Dynamic Banners**: Admin-controllable hero banner slider with interactive call-to-actions.
- **Product Catalogue with Dynamic Filters**:
  - Filter by category (IP Cameras, HD CCTV, NVR, DVR, PTZ, WiFi Smart Cameras, Accessories, Networking).
  - Filter by manufacturer brand (Hikvision, Dahua, CP Plus, GS Vision, Uniview, Honeywell).
  - Search by product title, model number, keywords, and sort by price/newest.
- **Rich Product Detail View**:
  - Multiple high-resolution product images gallery with thumbnail preview.
  - Key technical specifications matrix (Resolution, Sensor, Lens, IR Distance, PoE, Onvif, Weatherproof IP67 rating, etc.).
  - Downloadable spec sheets and brochures.
  - Direct 1-Click WhatsApp inquiry with pre-filled product details.
  - Lead generation modal popup for instant quotation requests.
- **Security Solutions by Industry**: Customized CCTV solutions tailored for Residential, Retail, Corporate Offices, Warehouses, Banking & Government, and Education.
- **Promotions & Offers Center**: Active deals, package discounts, and coupon codes.
- **Dealer & Channel Partner Application System**: Comprehensive distributor/dealer application form with business details, GSTIN, years of operation, and turnover.
- **Download Center**: Centralized repository for product brochures, spec sheets, user manuals, PC software (CMS/VMS), and firmware updates with live download counters.
- **Installation Photo Gallery**: Showcase of commercial, industrial, and residential surveillance deployments with full-screen interactive lightbox.
- **Floating WhatsApp Widget**: Persistent, one-click WhatsApp chat button across the site with custom preset greeting.
- **Testimonials & Social Proof**: Verified customer reviews, satisfaction metrics, and brand partner showcase.

### ??? Admin Management Portal
- **Secure JWT Authentication**: Role-based administrative login protected with bcrypt password hashing.
- **Metrics Dashboard**: Live counts of products, categories, active offers, monthly lead inquiries, pending dealer applications, and total downloads.
- **Full CRUD Management**:
  - **Products**: Add/edit/delete products, multiple image upload, dynamic key-value technical specs, category & brand assignment, featured and active toggles.
  - **Categories & Brands**: Full taxonomy management with logo and banner image uploads.
  - **Homepage Banners**: Manage hero slider slides, titles, button text, links, and display order.
  - **Promotions & Deals**: Manage promotional discounts, coupon codes, and validity date ranges.
  - **Product Enquiries**: Filter inquiries by status (`pending`, `contacted`, `closed`), view customer contact info, product requested, and record internal admin notes.
  - **Dealer Applications**: Review distributor requests, inspect company details, add verification notes, and toggle status (`pending`, `under_review`, `approved`, `rejected`).
  - **Downloads Center**: Upload PDFs and software tools with automatic download counter tracking.
  - **Photo Gallery**: Upload and categorize project installation photos with captions.
  - **Testimonials**: Manage client ratings and featured reviews.
  - **Contact Messages**: Read and manage public contact submissions.
  - **Business Settings**: Update company address, primary/secondary phone numbers, WhatsApp contact, support emails, social media links, and SEO metadata.
  - **User & Admin Management**: Create staff/admin accounts and assign roles.

---

## ??? Tech Stack

### Frontend (`/client`)
- **React.js** (Vite bundler)
- **Tailwind CSS** (Dark security-tech themed UI)
- **React Router v6** (Public layout, Protected Admin layout, subroutes)
- **Axios** (With JWT Bearer interceptor & API handling)
- **Lucide React** (High-quality modern security & tech icons)

### Backend (`/server`)
- **Node.js** & **Express.js** (RESTful API architecture)
- **MySQL** (`mysql2/promise` connection pooling with auto-schema creation and seeding)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (Authentication & security)
- **Multer** (Disk storage for product images, logos, banners, and documents)
- **Helmet, CORS, Express Rate Limit** (Enterprise security middleware)

---

## ?? Project Directory Structure

```
D:\gs-vision\
+-- client/                     # Frontend React + Vite Application
¦   +-- public/                 # Static assets & favicon
¦   +-- src/
¦   ¦   +-- api/                # Axios instance with interceptors
¦   ¦   +-- components/
¦   ¦   ¦   +-- admin/          # Admin Layout, Sidebar, Topbar, StatCard
¦   ¦   ¦   +-- common/         # Navbar, Footer, Floating WhatsApp, Modals, Lightbox, Cards
¦   ¦   +-- context/            # AuthContext & SettingsContext
¦   ¦   +-- pages/
¦   ¦   ¦   +-- admin/          # Admin CRUD Views (Dashboard, Products, Enquiries, Dealers, etc.)
¦   ¦   ¦   +-- public/         # Public Website Views (Home, Products, Detail, Solutions, etc.)
¦   ¦   +-- App.jsx             # Route definitions & global modals
¦   ¦   +-- index.css           # Tailwind directives & theme styles
¦   ¦   +-- main.jsx            # React root entrypoint
¦   +-- package.json
¦   +-- tailwind.config.js
¦   +-- vite.config.js
¦
+-- server/                     # Backend Node.js + Express + MySQL REST API
¦   +-- database.sql            # Complete SQL Schema & Seeding data
¦   +-- uploads/                # User-uploaded images & documents directory
¦   +-- src/
¦   ¦   +-- config/             # Environment & MySQL Connection Pool
¦   ¦   +-- controllers/        # REST API Business Logic controllers
¦   ¦   +-- middleware/         # Auth, Multer upload & Error Handler
¦   ¦   +-- routes/             # Express API route handlers
¦   ¦   +-- utils/              # Seeder, Token generator & Slugifier
¦   ¦   +-- server.js           # Express App bootstrapping
¦   +-- .env                    # Environment configuration
¦   +-- .env.example
¦   +-- package.json
¦
+-- README.md                   # Project Documentation
```

---

## ?? Installation & Setup Guide

### 1. Database Setup (MySQL)
Make sure **MySQL Server** is running on your computer (e.g. via XAMPP, WAMP, MySQL Workbench, or Windows Service).

1. Open your MySQL client or terminal:
   ```bash
   mysql -u root -p
   ```
2. You can import the database directly using `database.sql`:
   ```bash
   mysql -u root -p < D:\gs-vision\server\database.sql
   ```
   *(Note: The server also automatically executes `CREATE DATABASE IF NOT EXISTS gsvision` and runs the schema and seeders upon first launch!)*

3. Configure your MySQL credentials in `D:\gs-vision\server\.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gsvision
   JWT_SECRET=gsvision_super_secret_jwt_key_2025
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

---

### 2. Start the Backend Server
1. Open a terminal and navigate to `/server`:
   ```bash
   cd D:\gs-vision\server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend API will start at: `http://localhost:5000`

---

### 3. Start the Frontend Client
1. Open a second terminal and navigate to `/client`:
   ```bash
   cd D:\gs-vision\client
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to: `http://localhost:5173`

---

## ?? Default Administrator Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@gsvision.com` | `admin123` |

Admin Login URL: **`http://localhost:5173/admin/login`**

---

## ?? Key API Endpoints

- **Auth**: `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/users`
- **Dashboard**: `GET /api/dashboard/stats`
- **Products**: `GET /api/products`, `GET /api/products/:slug`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- **Categories**: `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`
- **Brands**: `GET /api/brands`, `POST /api/brands`, `PUT /api/brands/:id`
- **Banners**: `GET /api/banners`, `POST /api/banners`, `PUT /api/banners/:id`
- **Offers**: `GET /api/offers`, `POST /api/offers`, `PUT /api/offers/:id`
- **Enquiries**: `POST /api/enquiries`, `GET /api/enquiries`, `PATCH /api/enquiries/:id/status`
- **Dealers**: `POST /api/dealers`, `GET /api/dealers`, `PATCH /api/dealers/:id/status`
- **Downloads**: `GET /api/downloads`, `POST /api/downloads`, `GET /api/downloads/:id/file`
- **Gallery**: `GET /api/gallery`, `POST /api/gallery`, `DELETE /api/gallery/:id`
- **Testimonials**: `GET /api/testimonials`, `POST /api/testimonials`
- **Contact**: `POST /api/contact`, `GET /api/contact`, `PATCH /api/contact/:id/status`
- **Settings**: `GET /api/settings`, `PUT /api/settings`

---

## ?? Production Deployment Notes
- **Frontend Build**: `npm run build` generates static optimized HTML/CSS/JS in `client/dist`.
- **Static Assets**: Uploaded media in `server/uploads` is served statically under `/uploads`.
- **Environment**: Set `NODE_ENV=production` and update `CLIENT_URL` and `DB_*` in production `.env`.
