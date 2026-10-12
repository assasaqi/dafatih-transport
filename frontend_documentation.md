# 💻 Frontend - Dafatih Transport Client

Dokumentasi ini memuat informasi mengenai antarmuka pengguna (Client-Side) dari **Dafatih Transport**. Aplikasi frontend ini dibangun dengan React, di-styling secara khusus menggunakan Tailwind CSS beserta PostCSS untuk pemrosesan utilitas gaya.

## 🛠️ Tech Stack & Ekosistem Utama
*   **Framework:** React (Vite / Create React App)
*   **Styling:** Tailwind CSS & PostCSS
*   **Routing:** React Router DOM
*   **HTTP Client:** Axios atau Fetch API
*   **State Management:** React Context API / Zustand / Redux (Sesuai kebutuhan skala)

## 📦 Daftar Paket (Dependencies)
Berikut adalah daftar package yang umumnya membangun ekosistem frontend ini:

### Dependencies Utama (`dependencies`)
| Package | Deskripsi |
| :--- | :--- |
| `react` & `react-dom` | Library inti React untuk membangun antarmuka UI. |
| `react-router-dom` | Menangani navigasi antar halaman (SPA routing). |
| `axios` | HTTP client untuk melakukan request ke backend API. |
| `lucide-react` / `react-icons`| Kumpulan ikon untuk UI. |
| `date-fns` / `dayjs` | Utilitas memformat tanggal pemesanan armada. |

### Development Dependencies (`devDependencies`)
| Package | Deskripsi |
| :--- | :--- |
| `vite` | Build tool yang sangat cepat (rekomendasi standar modern). |
| `tailwindcss` | Framework CSS utility-first. |
| `postcss` | Alat untuk mentransformasi CSS (diwajibkan oleh Tailwind). |
| `autoprefixer` | Plugin PostCSS untuk menambah prefix vendor otomatis. |

## 📂 Struktur Direktori

```text
frontend/
├── public/                 # Aset statis yang tidak diproses webpack/vite
│   ├── index.html          # File HTML utama
│   └── favicon.ico         # Ikon situs
├── src/                    # Source code utama React
│   ├── assets/             # Aset internal (gambar default, logo)
│   ├── components/         # Komponen UI Reusable (Tombol, Navbar, Footer)
│   │   ├── ui/             # Komponen elemen dasar
│   │   └── forms/          # Komponen input dan validasi formulir
│   ├── pages/              # Komponen setingkat Halaman (Views)
│   │   ├── Home/           # Landing page utama
│   │   ├── Vehicles/       # Katalog armada transportasi
│   │   ├── Booking/        # Alur pemesanan klien
│   │   ├── Blog/           # Halaman baca artikel
│   │   ├── Gallery/        # Galeri dokumentasi layanan
│   │   └── Auth/           # Halaman Login/Register Klien
│   ├── services/           # Logika pemanggilan API (Axios instance)
│   │   └── api.js          # Konfigurasi endpoint ke backend
│   ├── context/            # React Context (Auth State, Cart State)
│   ├── hooks/              # Custom React Hooks
│   ├── App.jsx             # Komponen root yang memuat router
│   └── main.jsx            # Titik masuk React (merender App ke root DOM)
├── .env                    # Environment variables frontend (misal: VITE_API_URL)
├── postcss.config.js       # Konfigurasi PostCSS untuk Tailwind
├── tailwind.config.js      # Kustomisasi tema, warna, dan utilitas Tailwind
└── package.json            # Konfigurasi project dan dependencies
```

## 🚀 Panduan Memulai (Getting Started)

1. **Instalasi Paket:**
   Masuk ke direktori `frontend` dan jalankan:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment:**
   Buat file `.env` untuk mendaftarkan URL backend. Jika menggunakan Vite, gunakan prefix `VITE_`.
   ```env
   VITE_API_BASE_URL="http://localhost:5000/api"
   ```

3. **Menjalankan Aplikasi Frontend:**
   ```bash
   # Development Server (Hot Module Replacement)
   npm run dev
   ```

4. **Build untuk Production:**
   Ketika aplikasi siap di-deploy, jalankan skrip build.
   ```bash
   npm run build
   ```
   *File hasil build akan berada di dalam folder `dist/` atau `build/`.*