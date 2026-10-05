# 🚖 Dafatih Transport - Website Sewa Mobil & Transportasi Lombok

Aplikasi web *Fullstack* (MERN Stack dengan MySQL) untuk layanan transportasi, sewa mobil lepas kunci / dengan *driver*, serta antar-jemput rute wisata di Lombok. Dilengkapi dengan antarmuka publik yang responsif, integrasi reservasi via WhatsApp, serta Panel Admin terproteksi untuk pengelolaan data dinamis.

---

## 🛠️ Ringkasan Teknologi (*Tech Stack*)

### **Frontend**
* **Framework**: React.js (Vite)
* **Router**: React Router DOM (v6)
* **HTTP Client**: Axios
* **Styling**: Inline CSS Dinamis & Modular CSS Component

### **Backend**
* **Runtime**: Node.js[cite: 3]
* **Framework**: Express.js[cite: 3]
* **Database Driver**: MySQL2 (Promise-based)[cite: 3]
* **File Processing**: Multer (Manajemen pengunggahan gambar ke folder lokal `/uploads`)[cite: 3]
* **Environment**: Dotenv[cite: 3]

### **Database**
* **DBMS**: MySQL[cite: 3]

---

## 📂 Struktur Direktori Proyek

```text
dafatih-transport/
├── backend/
│   ├── config/
│   │   └── db.js                 # Konfigurasi Koneksi Pool MySQL
│   ├── controllers/
│   │   ├── authController.js     # Logika Login, Register, & Profil Admin
│   │   ├── blogController.js     # Logika CRUD Artikel Blog
│   │   ├── bookingController.js  # Logika Reservasi & Status Pesanan
│   │   ├── galleryController.js  # Logika CRUD Foto Galeri
│   │   ├── routeController.js    # Logika CRUD Rute & Tarif
│   │   └── vehicleController.js  # Logika CRUD Armada Mobil
│   ├── middleware/
│   │   └── upload.js             # Middleware Multer & Pembersihan File (fs.unlink)
│   ├── routes/
│   │   └── apiRoutes.js          # Pendaftaran Endpoint REST API Central
│   ├── uploads/                  # Folder Penyimpanan File Fisik Gambar
│   ├── .env                      # Variabel Lingkungan Server & DB
│   ├── server.js                 # Entry Point Aplikasi Express Backend
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminNavbar.jsx   # Navigasi Panel Admin Responsif
    │   │   ├── Navbar.jsx        # Header Navigasi Publik Desktop
    │   │   ├── MobileBottomNav.jsx # Navigasi Bawah Seluler
    │   │   └── ProtectedRoute.jsx# Proteksi Sesi Login Admin
    │   ├── pages/
    │   │   ├── Home.jsx          # Beranda Utama
    │   │   ├── Mobil.jsx         # Katalog Armada Mobil
    │   │   ├── Tariffs.jsx       # Daftar Rute & Tarif Transfer
    │   │   ├── Booking.jsx       # Formulir Reservasi Pelanggan
    │   │   ├── Gallery.jsx       # Dokumentasi Galeri Publik
    │   │   ├── Blog.jsx          # Daftar Artikel & Panduan Wisata
    │   │   └── admin/
    │   │       ├── Login.jsx     # Halaman Autentikasi Admin
    │   │       ├── Dashboard.jsx # Ringkasan Statistik & Menu Navigasi Admin
    │   │       ├── AdminRoutes.jsx# Manajemen Rute & Tarif Transfer
    │   │       ├── AdminBookings.jsx # Pemantauan & Status Pemesanan
    │   │       ├── AdminGallery.jsx# Manajemen Galeri Foto
    │   │       ├── AdminBlog.jsx # Manajemen Artikel Blog
    │   │       └── AdminProfile.jsx# Pengaturan Profil & Password Admin
    │   ├── routes/
    │   │   └── AppRouter.jsx     # Konfigurasi Routing Frontend
    │   ├── services/
    │   │   └── api.js            # Service Axios Client Terpusat
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
