# Arsitektur
Target: frontend PWA, backend (API + SQLite lalu PostgreSQL), Local Worker (laptop, sandbox, antrean), adapter (AI Provider, Director/OpenClaw, Advisor/Hermes, GitHub), file storage. Dipisah karena GitHub Pages hanya hosting statis.
Saat ini hanya `frontend/` berisi kode: `logic.js` (aturan bisnis, teruji), `app.js` (UI + IndexedDB: store `kv` untuk data, store `files` untuk isi file), `sw.js` (cache offline, VERSI di baris 1).
Data v1.0.0 tetap terbaca (DB naik ke versi 2 tanpa menghapus store lama).
