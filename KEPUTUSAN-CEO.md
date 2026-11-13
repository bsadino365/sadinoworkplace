# Keputusan yang Menunggu CEO

Format: pertanyaan → pilihan → **rekomendasi** → Part terkait. Jawab cukup dengan "D-xx: setuju rekomendasi" atau pilihan lain.

| ID | Pertanyaan | Pilihan | Rekomendasi | Part |
|---|---|---|---|---|
| D-01 | Nama produk final: Sadino Workplace atau Bawaulin AI Workspace? Repo mana yang kanonik? | A) Sadino B) Bawaulin C) nama baru | Pilih satu, samakan di repo, UI, dokumen | 1 |
| D-02 | Bisa kirim zip/file terbaru dari `bsadino365/sadinoworkplace`? Audit ini memakai zip v1.2.0. | Kirim / tidak | Kirim agar Part 1 diperbarui | 1 |
| D-03 | Setuju memakai server kecil (VPS) berbiaya tetap bulanan + domain? | A) VPS B) laptop sendiri (terbatas) C) tunda | A, mulai paket terkecil | 2, 5 |
| D-04 | Ganti OpenClaw sebagai Direktur menjadi Director buatan sendiri? | A) ganti B) tetap OpenClaw | A (alasan keamanan, Part 2 §6.2) | 2 |
| D-05 | Boleh data proyek dikirim ke tier gratis yang dapat dipakai penyedia untuk perbaikan produk? | A) hanya non-rahasia B) semua C) tidak pernah | A | 3 |
| D-06 | Instal software: otonom di sandbox, persetujuan bila di server/host? | A) ya B) semua otonom C) semua persetujuan | A | 3 |
| D-07 | Aktivasi agen baru setelah lolos uji: perlu persetujuan CEO? | A) ya (awalnya) B) otomatis | A, dilonggarkan setelah terbukti | 3 |
| D-08 | Pakai "Approval Envelope" (setuju sekali dengan batas biaya & masa berlaku)? | A) ya B) per panggilan | A | 3 |
| D-09 | Bahasa backend | A) Python B) TypeScript | A | 2 |
| D-10 | Sajikan aplikasi dari VPS (bukan GitHub Pages) dan jadikan repo privat? | A) ya B) tetap Pages | A setelah backend ada | 2 |
| D-11 | Login CEO | A) passkey + TOTP cadangan B) kata sandi | A | 2 |
| D-12 | Batas anggaran bulanan keras (model + server) dan ambang peringatan | Isi angka | Mulai rendah; naikkan bertahap | 3, 5 |
| D-13 | Alur pilot pertama | A) riset→naskah→QA B) produksi video C) lainnya | A (paling murah & mudah diuji), lalu B | 4, 5 |
| D-14 | n8n | A) tunda sampai ada ≥3 alur berulang B) pakai sekarang | A | 2, 5 |
| D-15 | Kanal notifikasi | A) Web Push B) + email/Telegram | A dulu | 4 |
| D-16 | Lokasi backup di luar server | Pilih penyedia (bisa berbiaya) | Tentukan di Fase 1 | 5 |
| D-17 | Setujui mulai implementasi Fase 0–1 saja? | Ya / revisi dulu | Ya | 5 |

## Urutan penting
- **Sebelum Fase 1:** D-01, D-02, D-03, D-09, D-10, D-11, D-17.
- **Sebelum Fase 2:** D-04, D-05, D-08, D-12.
- **Sebelum Fase 3:** D-06. **Sebelum Fase 4:** D-13. **Sebelum Fase 6:** D-07.

## Keputusan produk yang dipertahankan (tidak diubah)
CEO memberi tujuan, AI mengerjakan · GRATIS = otonom, BERBAYAR = persetujuan CEO · tidak ada alih diam-diam ke model berbayar · aturan biaya ditegakkan backend · status berasal dari event nyata · kegagalan dilaporkan jujur · 13 karyawan awal bukan batas.
