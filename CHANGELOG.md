# Changelog

## 3.0.0 — Sadino Workplace (Phase 1: UI)
**Baru**
- 4 menu utama: Dashboard, Command, Kinerja, Hasil. Admin Center dari ikon gear (6 halaman + Anggaran + GitHub).
- Kinerja: kantor virtual isometrik 2.5D (SVG+CSS), 15 robot dengan desain berbeda, animasi hidup (napas, kedip, antena), pratinjau 10 status (DEMO), simulasi hidup berjalan/istirahat/recharge/rapat (DEMO), zoom, klik robot membuka profil.
- Profil 15 posisi (AI Director, AI Setup Assistant, 13 specialist).
- Hasil: pencarian, filter, urutan; Command: detail instruksi + area rencana; Dashboard: komponen lengkap (data jujur).
- Admin: AI Setup Center, Agent Management, Technology Registry, profil perusahaan, notifikasi.
**Keamanan/teknis**
- Impor JSON dibersihkan (ID dan tipe divalidasi). Service worker tidak lagi menyamar jadi index.html untuk file non-halaman. CSP ditambahkan. save() memeriksa hasil. Versi satu sumber (version.js). Cek keamanan "skrip pihak ketiga" kini dihitung nyata.
- Nama database IndexedDB `bawaulin-ws` sengaja tidak diganti (data lama aman).
- Kode baru dipisah: version.js, office.js, pages.js. Fitur dan logic.js lama dipertahankan.
**Belum (menunggu backend)**: AI nyata, status operasional nyata, token/kuota, 9Router.

## 2.0.0
Lihat docs/.

## 3.1.0
- Kantor virtual Kinerja diganti: satu gedung lapang (36x42 tile), 12 ruang/zona, dinding kaca, kamera geser/cubit/zoom, chip ruangan, zoom karyawan.
- Baru: frontend/office-layout.js (data tata letak), tests/layout.test.js. Simulasi DEMO berjalan lewat koridor dan pintu.
- Belum: minimap, patroli Director, level-of-detail robot, jeda animasi di luar layar, uji di Android asli.
