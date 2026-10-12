# 🚗 Backend - Dafatih Transport API

Dokumentasi ini berisi informasi mengenai arsitektur, dependensi, dan panduan pengembangan untuk sisi Backend dari aplikasi **Dafatih Transport**. Backend ini dibangun menggunakan tumpukan Node.js dan Express.js, dengan Prisma ORM untuk manajemen database.

## 🛠️ Tech Stack & Ekosistem Utama
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **ORM:** Prisma (`schema.prisma`)
*   **Database:** PostgreSQL / MySQL (Tergantung konfigurasi Prisma)
*   **Keamanan:** JWT (JSON Web Tokens), Bcrypt, Express Rate Limit

## 📦 Daftar Paket (Dependencies)
Berikut adalah gambaran paket (package) yang digunakan di sisi server:

### Dependencies Utama (`dependencies`)
| Package | Deskripsi |
| :--- | :--- |
| `express` | Web framework utama untuk routing dan server. |
| `@prisma/client` | Auto-generated query builder untuk berinteraksi dengan database. |
| `cors` | Middleware untuk menangani Cross-Origin Resource Sharing (CORS). |
| `dotenv` | Memuat variabel lingkungan (environment variables) dari file `.env`. |
| `jsonwebtoken` | (JWT) Untuk pembuatan dan verifikasi token autentikasi. |
| `bcryptjs` | Library hashing untuk mengamankan password pengguna. |
| `multer` | Middleware penanganan `multipart/form-data` untuk upload gambar. |
| `express-rate-limit`| Mencegah spam/DDoS dengan membatasi jumlah request. |
| `joi` / `zod` | Untuk validasi skema input data dari klien. |

### Development Dependencies (`devDependencies`)
| Package | Deskripsi |
| :--- | :--- |
| `nodemon` | Auto-restart server saat ada perubahan file dalam masa development. |
| `prisma` | CLI Prisma untuk migrasi database dan sinkronisasi skema. |

## 📂 Struktur Direktori

```text
backend/
├── prisma/                 # Konfigurasi ORM
│   ├── schema.prisma       # Definisi model database (tabel)
│   └── migrations/         # Riwayat migrasi database
├── src/                    # Source code utama
│   ├── controllers/        # Logika bisnis aplikasi
│   │   ├── authController.js       # Autentikasi Admin
│   │   ├── authClientController.js # Autentikasi Klien/Customer
│   │   ├── bookingController.js    # Logika pemesanan transportasi
│   │   ├── vehicleController.js    # Manajemen data armada
│   │   ├── routeController.js      # Manajemen rute perjalanan
│   │   ├── blogController.js       # Manajemen artikel/blog
│   │   └── galleryController.js    # Manajemen galeri media
│   ├── middlewares/        # Penengah request
│   │   ├── auth.js         # Verifikasi token JWT
│   │   ├── rateLimiter.js  # Pembatas request
│   │   ├── validate.js     # Validasi input body/params
│   │   └── upload.js       # Konfigurasi multer untuk gambar
│   ├── routes/             # Definisi endpoint (API Routes)
│   │   └── apiRoutes.js    # Kumpulan seluruh routing API
│   ├── utils/              # Fungsi utilitas (format tanggal, error handler)
│   └── server.js           # Titik masuk aplikasi (Entry Point)
├── uploads/                # Direktori penyimpanan file lokal (gambar, dsb)
├── .env                    # Environment variables (JANGAN DI-COMMIT)
├── prisma.config.ts        # Ekstra konfigurasi Prisma
└── package.json            # Konfigurasi project dan dependencies Node.js
```

## 🚀 Panduan Memulai (Getting Started)

1. **Instalasi Paket:**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment:**
   Buat file `.env` dan sesuaikan dengan konfigurasi database Anda.
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/dafatih_transport?schema=public"
   JWT_SECRET="rahasia-super-kuat-anda-disini"
   ```

3. **Migrasi Database:**
   Sinkronkan skema Prisma dengan database.
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Menjalankan Server:**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```