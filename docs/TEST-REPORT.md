# Laporan Pengujian v1.2.0
Lingkungan pembuatan: Node.js 22 dan Chromium headless (Playwright). Bukan HP Android sungguhan.
- `npm test`: logika bisnis (tugas, persetujuan, memori & versi, provider, aktivasi karyawan, anggaran, deteksi secret, kompatibilitas data lama) lolos; render 14 modul + 4 panel, teks pengguna di-escape.
- `python tests/e2e.py`: 37/37 lolos — dashboard, tab bawah, buat proyek/tugas, ubah status, approval, keputusan masuk Knowledge, tombol "belum tersedia", API key ditolak, panel Lainnya, 14 modul terbuka, detail karyawan, data bertahan setelah muat ulang (IndexedDB), peringatan anggaran, mode offline, sidebar laptop, tanpa scroll horizontal, tanpa error JS.
- Belum diuji: Android sungguhan, instal PWA, unggah/unduh file di HP.
