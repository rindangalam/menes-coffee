# Menes Coffee & Eatery - Website & Admin Panel

> **Modern coffee shop website with integrated admin dashboard**  
> Complete web presence for Menes Coffee & Eatery, Padang — menu catalog, online reservations, and content management system.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-2.1-FFC517?style=flat-square)](https://pinia.vuejs.org/)

---

## 📋 Overview

**Menes Coffee & Eatery Website** is a comprehensive web application for the popular coffee shop and eatery in Padang, West Sumatra. The platform features a public-facing website for customers and an integrated admin panel for staff to manage content, reservations, and daily operations.

### Business Information
- **Name**: Menes Coffee & Eatery - Padang
- **Address**: Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat, Kota Padang, Sumatera Barat
- **Instagram**: [@menescoffee](https://www.instagram.com/menescoffee/)
- **Hours**: Daily 08:00 - 04:00 (late-night hangout spot)
- **Google Rating**: 4.6/5 from ~550 reviews

### Unique Features
- **Large indoor/outdoor space** for groups and events
- **Open until dawn** (late-night hangout option)
- **Photobox** for customer selfies and documentation
- **Family & pet-friendly** atmosphere
- **Diverse menu**: coffee, signature lattes, local & western cuisine
- **Affordable pricing** with daily promotional discounts

---

## ✨ Features

### 🌐 Public Website

#### 🏠 Homepage
- Hero section with stunning cafe visuals
- Featured menu highlights
- Call-to-action buttons (Menu, Reservations)
- Latest promotions showcase
- Customer testimonials

#### ☕ Menu Page
- Complete menu catalog with categories:
  - Breakfast
  - Starters
  - Main Course
  - Pizza & Pasta
  - Desserts
  - Beverages & Signature Lattes
- High-quality food photography
- Price display (IDR format)
- Item descriptions and ingredients
- "Sold Out" badges for unavailable items
- Category filtering

#### ℹ️ About Us
- Cafe story and background
- Interior/exterior photo gallery
- Unique selling points:
  - Outdoor seating area
  - Photobox feature
  - Late-night operations
  - Family and pet-friendly

#### 📍 Location & Hours
- Google Maps integration (Jl. Kartini No. 24, Padang)
- Operating hours (daily 08:00 - 04:00)
- Contact information
- Directions

#### 📅 Table Reservations
- Online booking form:
  - Name, phone number
  - Date and time selection
  - Number of guests
  - Special requests/notes
- Real-time availability check
- Instant booking confirmation

#### 📧 Contact Form
- Direct message to cafe management
- Name, email, message fields
- Inquiry submission tracking

#### 🖼️ Gallery (Phase 2)
- Photo grid organized by category
- Lazy loading for performance
- Showcasing ambiance and dishes

#### ⭐ Testimonials (Phase 2)
- Customer reviews and feedback
- Admin-approved testimonials only
- Photo testimonials support

#### 🎉 Promotions/Blog (Phase 2)
- Daily/weekly promotional offers
- Special event announcements
- Menu discount alerts (e.g., lunch specials)
- Expiry date handling

### 🛠️ Admin Panel

#### 🔐 Authentication
- Secure login (email/password via Supabase Auth)
- Role-based access control
- Session management

#### 📊 Dashboard
- Today's reservations summary
- Unread messages count
- Popular menu items analytics
- Quick action shortcuts

#### 🍽️ Menu Management (CRUD)
- Add/edit/delete menu items
- Category management
- Photo upload to Supabase Storage
- Price and availability control
- Real-time updates to public site

#### 📆 Reservation Management
- View all reservations
- Filter by date and status
- Status updates (pending/confirmed/cancelled)
- Guest information tracking
- Notes and special requests

#### 💬 Message Management
- Contact form submissions inbox
- Read/unread status tracking
- Message responses (optional)

#### 🖼️ Gallery Management (Phase 2)
- Upload/delete photos
- Category organization
- Sort order control
- Bulk upload support

#### ⭐ Testimonial Management (Phase 2)
- Review submission approval
- Moderation queue
- Publish/unpublish control

#### 🎉 Promotion Management (Phase 2)
- Create promotional posts
- Set validity periods
- Publish/unpublish control
- Rich text editor for content

#### ⚙️ Settings (Phase 2)
- Operating hours configuration
- Contact information
- Social media links
- General site settings

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue.js 3 (Composition API) |
| **State Management** | Pinia 2.1 |
| **Routing** | Vue Router 4.3 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **Styling** | Tailwind CSS 3.4 |
| **Build Tool** | Vite 5.2 |
| **Deployment** | Vercel / Netlify |

---

## 📋 Requirements

- **Node.js** >= 18
- **npm** >= 9
- **Supabase account** and project

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/rindangalam/menes-coffee.git
cd menes-coffee
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Database

Run the database schema:

```bash
# Apply schema from supabase-schema.sql to your Supabase project
# Use Supabase SQL Editor or psql client
```

Or use the provided script:

```bash
node create-admin.mjs
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
menes-coffee/
├── src/
│   ├── components/            # Reusable Vue components
│   ├── views/                 # Page components
│   │   ├── public/            # Public website pages
│   │   │   ├── Home.vue
│   │   │   ├── Menu.vue
│   │   │   ├── About.vue
│   │   │   ├── Location.vue
│   │   │   ├── Reservation.vue
│   │   │   └── Contact.vue
│   │   └── admin/             # Admin panel pages
│   │       ├── Dashboard.vue
│   │       ├── MenuManagement.vue
│   │       ├── Reservations.vue
│   │       └── Messages.vue
│   ├── stores/                # Pinia stores
│   ├── router/                # Vue Router configuration
│   ├── composables/           # Reusable composition functions
│   ├── utils/                 # Helper functions
│   └── main.js                # App entry point
├── supabase/
│   └── supabase-schema.sql    # Database schema
├── scripts/
│   ├── create-admin.mjs       # Create admin user
│   ├── download-assets.mjs    # Download images from Instagram
│   └── apply-settings.js      # Apply initial settings
├── public/                    # Static assets
├── index.html
├── vite.config.js
├── tailwind.config.js
├── PRD-Website-Cafe.md        # Product Requirements Document
├── SPRINT.md                  # Sprint planning
└── package.json
```

---

## 🗄️ Database Schema

### Core Tables
- `menu_items` - Menu catalog with categories
- `menu_categories` - Menu category management
- `reservations` - Table booking records
- `contact_messages` - Customer inquiries
- `gallery_images` - Photo gallery (Phase 2)
- `testimonials` - Customer reviews (Phase 2)
- `promotions` - Promotional posts (Phase 2)
- `settings` - Site configuration (Phase 2)

---

## 🔐 Authentication & Authorization

### User Roles
- **Superadmin** - Full system access, user management
- **Admin** - Content management, reservations, messages
- **Staff** - View-only access (future)

### Row Level Security (RLS)
- All tables protected with Supabase RLS policies
- Public read access for published content only
- Write access restricted to authenticated admins

---

## 🎨 Design Principles

### Public Website
- **Mobile-first**: Optimized for smartphone users
- **Fast loading**: LCP < 3 seconds on 4G
- **Modern aesthetic**: Clean, cafe-style design
- **Visual storytelling**: High-quality food photography

### Admin Panel
- **User-friendly**: Non-technical staff can operate
- **Efficient workflow**: Quick content updates (< 5 minutes)
- **Real-time updates**: Changes reflect immediately on public site
- **No coding required**: Pure UI-based management

---

## 🧪 Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables (Supabase credentials)
4. Deploy

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| **Page Load Time (LCP)** | < 3 seconds on 4G |
| **Content Update Time** | < 5 minutes per menu item |
| **Weekly Online Reservations** | Baseline established within 1 month |
| **Mobile Bounce Rate** | < 40% on menu page |

---

## 🎯 Development Phases

### ✅ Phase 1 (MVP - Complete)
- Public pages: Home, Menu, About, Location, Reservations, Contact
- Admin panel: Login, Menu CRUD, Reservation management, Message inbox
- Table reservation system (no payment)

### 🚧 Phase 2 (In Progress)
- Gallery photo management
- Customer testimonials with approval workflow
- Promotions/blog posts
- Dynamic settings (hours, contact, social media)

### 📋 Phase 3 (Planned)
- Online payment / deposit for reservations
- Pre-order / full online ordering
- Multi-outlet support
- Multi-language (Indonesian/English)
- Email/WhatsApp notifications

---

## 📝 Documentation

- **[PRD](PRD-Website-Cafe.md)** - Product Requirements Document
- **[Sprint Planning](SPRINT.md)** - Development sprint log
- **[Agent Workflow](AGENT-WORKFLOW.md)** - Development guidelines
- **[Instagram Data](INSTAGRAM_DATA.md)** - Content sourcing notes

---

## 🤝 Contributing

This is a commercial project for Menes Coffee & Eatery. For internal development:
1. Follow Vue.js style guide
2. Test on mobile devices
3. Update documentation for major changes

---

## 📄 License

Proprietary - All rights reserved by Menes Coffee & Eatery

---

## 👤 Author

**Rindang Alam Nur Muhammad**  
GitHub: [@rindangalam](https://github.com/rindangalam)

---

## 🙏 Acknowledgments

Built with:
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Pinia](https://pinia.vuejs.org/) - Vue state management

---

## 📧 Contact

**Menes Coffee & Eatery - Padang**
- Address: Jl. Kartini No. 24, Padang Pasir, Kec. Padang Barat
- Instagram: [@menescoffee](https://www.instagram.com/menescoffee/)
- Website: [Coming Soon]

---

*Your favorite late-night hangout spot in Padang, now with online presence.*
