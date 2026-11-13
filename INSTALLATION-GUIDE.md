# Panduan Instalasi (HP Android)
**LANGKAH 1** Unduh `bawaulin-ai-workspace.zip`.
**LANGKAH 2** Ekstrak ZIP (aplikasi File/Files by Google > ketuk ZIP > Ekstrak).
**LANGKAH 3** Buka github.com dan masuk.
**LANGKAH 4** Buat repository baru (tombol +, New repository). Public agar GitHub Pages gratis.
**LANGKAH 5** Add file > Upload files, pilih seluruh isi hasil ekstrak (termasuk folder `frontend`, `docs`, `tests`, dan file `.gitignore` bila terlihat), lalu Commit. Jika folder kosong tidak ikut terunggah, itu normal.
**LANGKAH 6** Periksa repository: ada `frontend/index.html`, `frontend/app.js`, `frontend/sw.js`, `README.md`.

## Membuka aplikasi
Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save. Tunggu 1-2 menit, buka `https://NAMAANDA.github.io/NAMA-REPO/frontend/` di Chrome. Menu titik tiga > Tambahkan ke layar utama.

## Di laptop
Buka alamat yang sama di browser, atau jalankan `node tests/logic.test.js` bila Node.js terpasang (opsional).

## Penting
Mengunggah ke GitHub **tidak** menjalankan backend, Local Worker, atau AI. Itu perlu hosting server (VPS) dan konfigurasi tersendiri, belum dibuat (lihat ROADMAP). Data aplikasi hanya tersimpan di browser perangkat Anda.
