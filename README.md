# Bawaulin AI Workspace (Sadino Workplace)
Satu aplikasi, satu perusahaan virtual, banyak karyawan AI. Anda adalah CEO.

**Versi 2.0.0 = Blueprint Release.** Aplikasi (frontend PWA, data di IndexedDB) berfungsi sama seperti v1.2.0. Yang baru adalah rancangan lengkap Autonomous AI Company di `docs/v2/` (mulai dari `00-RINGKASAN-CEO.md`). Backend, AI Director, Setup Assistant, Local Worker, dan koneksi model/GitHub **belum dibuat**; semuanya tampil "Belum Terhubung".

## Menjalankan
Buka folder `frontend/` lewat server statis (mis. GitHub Pages). Service worker butuh HTTPS atau localhost.
Uji: `npm test`. Uji browser (opsional, butuh Python + Playwright): `python tests/e2e.py`.

## Dokumen
`docs/v2/KEPUTUSAN-CEO.md` berisi keputusan yang menunggu Anda. Status nyata: `docs/IMPLEMENTATION-STATUS.md`.
