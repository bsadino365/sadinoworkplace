# PART 5 — Roadmap Implementasi dan Kriteria Keberhasilan

**Status: RENCANA.** Tidak ada tanggal/durasi yang dijanjikan; pekerjaan berjalan bertahap, boleh di background, dan dilanjutkan sampai kriteria lulus. Kompleksitas: **S** kecil, **M** sedang, **L** besar, **XL** sangat besar.

## 1. Ringkasan eksekutif
Urutan fase usulan awal diubah berdasarkan audit:
1. **Cost Guard + LLM Gateway dipindah ke depan** (sebelum AI Director). Tidak boleh ada panggilan model sebelum penjaga biaya ada.
2. **Event log dan status nyata dimulai sejak Fase 1**, visual Virtual Office tetap terakhir.
3. **Karyawan diaktifkan bergelombang** (pilot dulu), bukan 13 sekaligus.
4. **Workflow engine = orkestrator sendiri lebih dulu**; n8n dievaluasi hanya bila alur berulang sudah ada.
5. **Self-evolving paling akhir**, berpagar.

## 2. Peta fase
| Fase | Nama | Isi utama | Kompleksitas | Bergantung pada |
|---|---|---|---|---|
| 0 | Keputusan & Lingkungan | Jawab keputusan CEO, pilih VPS/domain, akun penyedia | S | — |
| 1 | Fondasi Sistem | Backend, Postgres, login, brankas kredensial, event log + proyeksi status, antrean, log, backup, sinkronisasi data HP/desktop | L | 0 |
| 2 | AI Core + Cost Guard | LLM Gateway, Cost Guard, Provider/Model Manager dasar, Director minimal, Command nyata, Live Status sederhana, 1 model gratis end-to-end | XL | 1 |
| 3 | Sandbox & Setup Assistant | Sandbox Docker, Environment Manager, instal/uji/rollback, Setup Assistant (AI), Remotion sebagai uji | XL | 1, 2 |
| 4 | AI Employees (gelombang) | G1 pilot: ARUNA, KANSA, CAKRA (+SMRITI) → G2 media: NARA, RUPA, VEDA → G3 sisanya | L per gelombang | 2, 3 |
| 5 | Workflow Engine | Orkestrator lanjutan (jadwal, retry, jeda persetujuan, komunikasi antar-agen); evaluasi n8n | L | 2, 4 |
| 6 | Self-Evolving | Agen/skill baru berpagar, versi, rollback, evaluasi | XL | 3, 4, 5 |
| 7 | Dashboard & Operations Map | Virtual Office, Map, notifikasi penuh, penyederhanaan 2 navigasi | L | 1 (event), 2–5 |

Urutan asal prompt (Fase 1 Fondasi → 2 AI Core → 3 Setup → 4 Employees → 5 Workflow → 6 Self-evolving → 7 Dashboard) dipertahankan; perubahan hanya: Cost Guard masuk Fase 2, event/status masuk Fase 1, dan Live Status sederhana masuk Fase 2.

## 3. Detail fase

### Fase 0 — Keputusan & Lingkungan
Hasil: semua keputusan prioritas di `KEPUTUSAN-CEO.md` terjawab; VPS & domain tersedia; kunci model gratis dibuat (CEO) dan siap dimasukkan lewat formulir aman nanti.

### Fase 1 — Fondasi Sistem
Isi: audit ulang repo terbaru; backend + Postgres; login (passkey+TOTP); Credential Manager; event log append-only + proyeksi status; antrean & eksekusi pekerjaan dasar; log terstruktur; backup terjadwal + uji pemulihan; migrasi data v1.2.0 (impor JSON) ke server; frontend membaca/menulis lewat API (data satu sumber untuk HP & desktop).
Tidak termasuk: AI apa pun.

### Fase 2 — AI Core + Cost Guard
Isi: LLM Gateway (satu-satunya jalur ke penyedia); Cost Guard + Approval Envelope; katalog model + status gratis bertanggal; Director minimal (menerima instruksi, membuat rencana, memanggil satu agen); Command mengirim ke backend; daftar Live Status dari event; spike Agents SDK vs gelung sederhana (time-boxed) lalu putuskan.

### Fase 3 — Sandbox & Setup Assistant
Isi: image sandbox dasar; Environment Manager (image bertag, manifes, rollback); kebijakan jaringan allow-list; Setup Assistant (AI) di atas kebijakan T0–T4; uji S-01…S-15 (Part 3).

### Fase 4 — AI Employees
G1 pilot (alur riset→naskah→QA) dulu untuk membuktikan seluruh rantai; lalu G2 (produksi media); lalu G3 (SAGARA, LARAS, NALAR, AKSARA, RAKSA, DHARA). Tiap karyawan: model, tools, izin minimal, skill, set uji, laporan hasil. Aktivasi memakai syarat yang sama (model terhubung & lolos uji, izin, akses proyek) — kini bisa terpenuhi karena ada backend.

### Fase 5 — Workflow Engine
Isi: jadwal (cron), retry/recovery lanjutan, komunikasi antar-agen terstruktur, templat workflow. **Evaluasi n8n** bila ada ≥3 alur berulang yang banyak memakai konektor SaaS; bila dipakai: self-host, di balik adaptor, tanpa menyimpan kredensial ganda, melapor event ke Backend.

### Fase 6 — Self-Evolving Capability
Isi: usulan agen/skill baru oleh Director → siklus Draft→Sandbox→Diuji→Ditinjau→(Persetujuan)→Aktif; versi + rollback; evaluasi regresi. Dikerjakan hanya setelah Fase 3–5 stabil. Aturan: agen tidak boleh mengubah kode penjaga atau kebijakan sendiri.

### Fase 7 — Dashboard & AI Operations Map
Isi: Virtual Office, Operations Map, notifikasi penuh, dua navigasi utama (modul lain jadi Lanjutan), light/dark, uji kinerja di HP nyata.

## 4. Infrastruktur dibutuhkan
| Item | Keterangan | Biaya (perlu persetujuan) |
|---|---|---|
| VPS | Mulai kecil; naikkan setelah ukur beban render | Berulang; estimasi beberapa–belasan USD/bln (verifikasi) |
| Domain + HTTPS | HTTPS lewat sertifikat gratis | Domain berbayar tahunan |
| Docker + Postgres | Perangkat lunak gratis | Tanpa lisensi |
| Backup di luar server | Lokasi berbeda dari VPS | Bisa gratis/berbayar tergantung penyedia |
| Kunci model gratis | Dibuat CEO | Gratis (tier gratis); data non-rahasia saja |
| Model berbayar | Hanya lewat Approval Envelope | Sesuai batas CEO |
Tidak ada biaya yang boleh dikeluarkan tanpa persetujuan CEO.

## 5. Risiko dan mitigasi
| Risiko | Mitigasi |
|---|---|
| Lingkup terlalu besar | Fase kecil, setiap fase menghasilkan kemampuan nyata + uji |
| Cost Guard bisa dilewati | Gateway satu-satunya jalur; sandbox tanpa kunci; uji S-02, S-15 |
| Kebocoran secret | Brankas, redaksi, uji S-07 |
| Agen disusupi | Sandbox, allow-list, tanpa secret, kebijakan T0–T4 |
| Kuota gratis berubah | Daftar model terverifikasi bertanggal; verifikasi berkala |
| Server mati tanpa disadari | Pemeriksaan kesehatan + notifikasi + runbook |
| CEO non-teknis kesulitan memelihara | Runbook bahasa awam; skrip pemeliharaan; dokumentasi oleh SMRITI |
| Kualitas hasil AI rendah | QA objektif + persetujuan CEO untuk deliverable penting |
| Kehilangan data | Backup + uji restore tiap fase |
| Teknologi cepat berubah | Adaptor, versi dipin, evaluasi berkala |

## 6. Kriteria keberhasilan (acceptance)
Keberhasilan = uji nyata lulus, **bukan** tampilan. Setiap uji punya **bukti** (log/event) dan hasil lulus/gagal.

### 6.1 Enam uji dari prompt (diformalkan)
| Uji | Langkah | Lulus jika |
|---|---|---|
| T1 Integrasi Model | CEO: "hubungkan Gemini gratis". Kunci dimasukkan via formulir | Akses diperiksa, koneksi teruji, model diuji kemampuannya, dihubungkan ke agen yang tepat, event lengkap, **biaya 0** |
| T2 Instal Tool | VEDA butuh Remotion | Image baru dibangun, render contoh lolos (ffprobe sesuai), manifes tercatat, tool terhubung ke VEDA |
| T3 Proteksi Biaya | Tugas butuh model berbayar tanpa amplop | Panggilan dihentikan **sebelum** keluar; bukti nol tagihan; persetujuan diminta; setelah ditolak tidak ada panggilan |
| T4 Workflow Otonom | Satu instruksi proyek (pilot) | Rencana, pembagian, setup, eksekusi, QA objektif, laporan; kegagalan (bila ada) dilaporkan apa adanya |
| T5 Ekspansi Agen | Director menemukan kebutuhan spesialis | Agen dirancang, diuji, ditinjau; **tidak aktif** sebelum validasi/persetujuan |
| T6 Pemulihan | Instalasi/workflow digagalkan sengaja | Terdeteksi, perbaikan aman terbatas, rollback, laporan jujur |

### 6.2 Uji tambahan (wajib)
| Uji | Lulus jika |
|---|---|
| T7 Kejujuran Status | Tanpa event → semua Idle/Unknown; event palsu di uji → tampilan sama dengan proyeksi; tidak ada animasi sibuk tanpa langkah berjalan |
| T8 Kebocoran Secret | Pencarian pola + nilai persis di log, event, chat, sandbox → nol temuan |
| T9 Backend Restart | Pekerjaan dilanjutkan atau ditandai gagal jelas; tidak ada "menggantung" |
| T10 Sinkron HP–Desktop | Data sama di dua perangkat; edit di satu tampak di yang lain |
| T11 Pemulihan Cadangan | Restore ke server bersih berhasil dan data utuh |
| T12 Injeksi Prompt | Konten berbahaya di web/README tidak dipatuhi; tercatat |

### 6.3 Kriteria per fase
F1: T8, T9, T10, T11 lulus. F2: T1, T3 (inti), S-02/S-03/S-10/S-15 lulus. F3: T2, T6, S-04…S-09 lulus. F4: pilot (G1) lulus T4 dengan alur nyata; tiap gelombang punya set uji. F5: jadwal & retry teruji; keputusan n8n terdokumentasi. F6: T5, S-12, S-13. F7: T7 + uji layar HP 390px + Light/Dark.

## 7. Pekerjaan yang dapat langsung dikerjakan
Setelah CEO menyetujui mulai implementasi (belum dikerjakan sekarang):
- W-01 Audit ulang repo terbaru (butuh kiriman dari CEO, D-02).
- W-02 Tetapkan nama & konvensi (D-01).
- W-03 Tulis skema event/status di `shared/` (dari Part 4).
- W-04 Tulis model ancaman (threat model) 1 halaman.
- W-05 Rancang skema database (tabel: users, events, tasks, runs, steps, approvals, providers, models, routes, credentials, envs, agents).
- W-06 Kerangka backend lokal (tanpa penyedia model) + uji.
- W-07 Rancang formulir kredensial + alur impor data v1.2.0.
- W-08 Tulis runbook pemeliharaan awam.
- W-09 Daftar uji penolakan (S-02, S-07, S-15) sebagai kerangka tes yang gagal dulu.
Pekerjaan berbiaya (VPS, domain, model berbayar) **menunggu persetujuan**.

## 8. Keputusan yang butuh persetujuan CEO
Lihat `KEPUTUSAN-CEO.md`. Prioritas sebelum Fase 1: D-01, D-02, D-03, D-09, D-10, D-11, D-17. Prioritas sebelum Fase 2: D-04, D-05, D-08, D-12. Sebelum Fase 3: D-06. Sebelum Fase 4: D-13. Sebelum Fase 6: D-07.

## 9. Rekomendasi
Setujui Fase 0–1 saja lebih dulu. Tidak ada janji waktu, tetapi hasil Fase 1 bisa diperiksa objektif (T8–T11) sebelum lanjut ke AI.
