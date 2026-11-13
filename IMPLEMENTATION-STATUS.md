# Status Implementasi (v2.0.0 — Blueprint; fungsi aplikasi = v1.2.0)

## 1. Sudah dibuat dan diuji (otomatis)
Tampilan baru: header, tab bawah (HP) + menu "Lainnya", sidebar (laptop), mode gelap/terang/otomatis.
14 modul sesuai spesifikasi:
- **Dashboard**: proyek, tugas, aktif, tertunda, karyawan aktif/belum terhubung, perjalanan BASECAMP→PUNCAK (dari status tugas nyata), anggaran, persetujuan menunggu, status integrasi, aktivitas.
- **CEO Command Center**: kirim instruksi (dicatat, status "Menunggu Direktur"), ubah jadi tugas manual.
- **Organisasi**: CEO, OpenClaw, Hermes, 5 departemen.
- **Karyawan**: 13 profil, pilih model, izin (7 jenis), akses proyek, syarat aktivasi. Tombol aktifkan = belum tersedia.
- **Tugas**: 10 status, filter, penanggung jawab, riwayat.
- **Proyek**: tambah, detail (tim, anggaran, folder 01–08, aktivitas), status.
- **Deliverables**: unggah/unduh/lihat/hapus, cari, filter, versi.
- **Pengetahuan**: 6 jenis memori, cari, edit dengan riwayat versi, keputusan CEO otomatis masuk memori.
- **Model AI**: daftar provider, utama/cadangan, aktif/nonaktif, routing per jenis pekerjaan. Tidak ada kolom API key.
- **GitHub**: status, repo per proyek software (PRIVATE default), ajukan ubah visibilitas (persetujuan nyata). Connect/Branch/Commit/Push = belum tersedia dengan alasan.
- **Persetujuan**: 10 kategori, filter, setujui/tolak (tidak otomatis).
- **Monitoring & Biaya**: anggaran bulanan, batas peringatan, catat pengeluaran (Aktual/Estimasi dipisah), biaya per proyek. Token/biaya per model = "Belum ada data".
- **Keamanan**: pemeriksaan konfigurasi, matriks izin, audit aktivitas, perubahan penting. Input mirip API key/token ditolak.
- **Pengaturan**: tema, ekspor/impor JSON, pasang PWA, hapus data.

Pengujian: `npm test` (logika + render 14 modul) dan `python tests/e2e.py` (Chromium headless: klik tombol, simpan, muat ulang, offline, layar HP 390px dan laptop 1280px).

## 2. Sudah dibuat tetapi belum diuji
Perangkat Android sungguhan (hanya emulasi ukuran layar), instal PWA di HP, unggah/unduh file di HP.

## 3. Belum dibuat
Sinkronisasi, backend, database cloud, RBAC server, Local Worker, eksekusi tugas oleh AI.

## 4. Menunggu koneksi/konfigurasi eksternal
OpenClaw, Hermes, provider model AI, GitHub (OAuth + backend). Semua tampil "Belum Terhubung". Tidak ada karyawan AI yang bekerja.

## 5. v2.0.0 Blueprint
Ditambahkan hanya dokumen (`docs/v2/`) dan kenaikan versi. Semua komponen Part 2–5 berstatus **Rencana**. Temuan audit: aktivasi karyawan tidak terjangkau tanpa backend; data HP/desktop tidak tersinkron. Lihat Part 1.
