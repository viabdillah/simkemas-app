# 📦 SIMKEMAS (Sistem Informasi Manajemen Kemasan)

![Status](https://img.shields.io/badge/Status-Active_Development-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)

> **Modern, Fast, & Scalable Point of Sales (POS)** khusus untuk bisnis percetakan dan kemasan. Dibangun dengan arsitektur **Serverless** yang ringan dan antarmuka **Glassmorphism** yang elegan.

---

## 📸 Screenshots

*(Coming Soon)*

---

## 🚀 Fitur Unggulan

Aplikasi ini dirancang untuk efisiensi kasir dan manajemen data yang rapi:

### 🔐 Authentication & Security
- **Firebase Auth Integration:** Login aman dan cepat.
- **Role-Based Access Control (RBAC):** Proteksi rute khusus untuk `SUPER_ADMIN`, `KASIR`, `OPERATOR`, dll.
- **Auto Sync:** Sinkronisasi otomatis user Firebase ke database lokal saat login.

### 👥 Manajemen Pelanggan (CRM)
- **Database Pelanggan:** Simpan data lengkap (Nama, WA, Alamat).
- **Live Search:** Pencarian pelanggan super cepat.
- **Riwayat Produk:** Setiap pelanggan memiliki daftar produk/desain spesifik mereka sendiri.

### 📦 Manajemen Produk Dinamis
- **Dynamic Variant Input:** Input banyak varian (ukuran, rasa, jenis) dalam satu kali klik.
- **Soft Delete:** Data produk yang dihapus tidak hilang permanen, menjaga integritas riwayat transaksi.
- **Detail Spesifik:** Mencatat NIB, PIRT, dan Status Halal.

### 🛒 Point of Sales (Kasir)
- **Smart Cart System:** Keranjang belanja interaktif support banyak item.
- **Auto-Format Rupiah:** Input harga otomatis terformat (e.g., `10000` -> `Rp 10.000`).
- **Order Details:** Penentuan **Deadline Produksi** dan **Metode Pengambilan** (Ambil/Kirim).

---

## 🛠️ Tech Stack

Project ini menggunakan teknologi terkini untuk performa maksimal:

### **Frontend (Client)**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
- **UI Library:** Lucide React (Icons), Framer Motion (Animations).
- **Style:** Glassmorphism Design System.

### **Backend (Serverless API)**
![Cloudflare](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
- **Database:** Cloudflare D1 (Distributed SQLite).
- **Framework:** Hono (Ultra-fast web standard framework).

---

## 📂 Struktur Project

```bash
SIMKEMAS/
├── api/                # Backend (Cloudflare Workers + Hono)
│   ├── src/
│   │   ├── routes/     # Modular Routes (auth, users, customers, orders)
│   │   ├── lib/        # Helper functions
│   │   └── index.ts    # Entry point
│   └── wrangler.toml   # Cloudflare Config
│
├── client/             # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI (GlassCard, Modal, Sidebar)
│   │   ├── pages/      # Halaman (Kasir, Admin, Dashboard)
│   │   ├── context/    # Global State (Toast)
│   │   └── lib/        # API Client & Formatters
│   └── tailwind.config # Styling Config
└── README.md
