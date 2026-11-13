# Bawaulin AI Workspace
Satu aplikasi, satu perusahaan virtual, banyak karyawan AI. Anda adalah CEO.

**Versi 1.2.0 = Fase 2 (14 modul, UI baru), frontend PWA** (offline, data di IndexedDB). Backend, Local Worker, dan koneksi nyata ke GitHub, model AI, OpenClaw/Hermes **belum dibuat**; semuanya tampil "Belum Terhubung". Lihat `docs/IMPLEMENTATION-STATUS.md`.

## Menjalankan
Buka folder `frontend/` lewat server statis (mis. GitHub Pages). Service worker butuh HTTPS atau localhost.
Uji: `npm test`. Uji browser (opsional, butuh Python + Playwright): `python tests/e2e.py`.
