# PART 2 — Arsitektur Target Autonomous AI Company

**Status: RENCANA.** Belum ada kode. Semua komponen di bawah bertanda 📝 kecuali Frontend (✅/🔧).

## 1. Ringkasan eksekutif
Pisahkan sistem menjadi **dua zona**:
- **Zona Kendali** (dipercaya): backend, database, gerbang model (LLM Gateway), Cost Guard, brankas kredensial, antrean, log/event. Hanya zona ini yang memegang secret dan uang.
- **Zona Eksekusi** (tidak dipercaya): sandbox/container tempat agen menjalankan tools. **Tanpa secret**, tanpa akses ke database produksi, jaringan dibatasi.

Aplikasi CEO tetap dua layar (Dashboard, Command). Kerumitan ada di belakang. Satu server kecil (VPS) dengan satu backend dan satu database cukup untuk memulai; jangan memecah jadi banyak layanan sebelum terbukti perlu.

## 2. Penjelasan sederhana (analogi)
Bayangkan kantor: **Resepsionis** = backend (menerima perintah, mencatat semua). **Brankas + Bendahara** = Credential Manager + Cost Guard (hanya mereka memegang kunci dan uang). **Ruang kerja berkunci** = sandbox (karyawan bekerja di sana tanpa membawa kunci brankas). **Papan kegiatan** = event log (apa yang dilihat CEO di Dashboard berasal dari sini, bukan dari karangan).

## 3. Diagram

### 3.1 Gambaran besar
```
 HP / Desktop (PWA: Dashboard + Command)
        │  HTTPS + login (passkey/TOTP)           ▲ status langsung (SSE)
        ▼                                          │
┌────────────────────────── ZONA KENDALI (VPS) ─────────────────────────┐
│  API Backend ──► Auth & Izin ──► Event Log (append-only) ─────────────┼─► Notifikasi
│      │                                  ▲                              │
│      ▼                                  │ semua langkah dicatat        │
│  AI Director ──► Orchestrator (state machine, antrean pekerjaan)       │
│      │                │                 │                              │
│      │                ▼                 ▼                              │
│      │        Setup Assistant     Agent Runtime (13+ karyawan)         │
│      │                │                 │                              │
│      ▼                ▼                 ▼                              │
│  ┌──────────── LLM GATEWAY + COST GUARD ────────────┐  ◄─ Credential   │
│  │ cek anggaran • cek gratis/berbayar • catat token │     Manager      │
│  └───────────────────┬──────────────────────────────┘   (terenkripsi)  │
│                      │                                                 │
│  Database (Postgres)  │  File Storage  │  Backup  │  Log & Monitor     │
└──────────────────────┼─────────────────────────────────────────────────┘
                       ▼  (hanya lewat Gateway)
        Penyedia model: Gemini · OpenAI · Claude · lainnya
 ═════════════════════ batas keamanan ════════════════════════════════════
┌────────────────────────── ZONA EKSEKUSI ───────────────────────────────┐
│  Sandbox per tugas/karyawan (container): Node, Python, FFmpeg, Remotion │
│  • tanpa secret  • batas CPU/RAM/waktu  • jaringan allow-list           │
│  • versi lingkungan tersimpan (bisa rollback)                           │
│  Opsional: Hermes (penasihat) berjalan di container terpisah            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Hubungan komponen (siapa memanggil siapa)
```
CEO → Frontend → API → Director → Orchestrator → { Agent Runtime | Setup Assistant | Advisor }
Agent Runtime / Director / Setup Assistant → LLM Gateway → (Cost Guard) → Penyedia model
Agent Runtime / Setup Assistant → Sandbox (perintah, file) → hasil → Storage
Semua → Event Log → { Dashboard (SSE), Notifikasi, Operations Map }
```
Aturan: **tidak ada komponen yang memanggil penyedia model langsung**; semuanya lewat Gateway.

## 4. Komponen
| # | Komponen | Fungsi (bahasa sederhana) | Rencana |
|---|---|---|---|
| 1 | Frontend | Layar di HP/desktop | Pertahankan PWA; sambungkan ke API (🔧) |
| 2 | Backend/API | Pintu masuk tunggal, validasi, otorisasi | Satu layanan; bahasa lihat 6.3 |
| 3 | AI Director | Memahami instruksi, membuat rencana, membagi kerja, menilai hasil | Agen + prompt + aturan; bukan pengendali infrastruktur |
| 4 | AI Setup Assistant | Menyiapkan model/tools/lingkungan | Part 3 |
| 5 | Strategic Advisor | Riset teknis & saran arsitektur | Opsional (Hermes); hanya memberi saran/riset |
| 6 | AI Employees | Agen spesialis (13 awal, bisa bertambah) | Konfigurasi data + prompt + tools + model |
| 7 | Orchestration Engine | Mesin status: langkah, retry, jeda persetujuan, lanjut | Dibuat sendiri di atas database |
| 8 | Workflow Engine | Alur otomatis berulang/terjadwal | Mulai dari orchestrator; n8n ditunda |
| 9 | Model Manager | Katalog model, kemampuan, harga, status gratis, hasil uji | Part 3 |
| 10 | Provider Manager | Status koneksi penyedia, kuota, kesehatan | Part 3 |
| 11 | Tools & Environment Manager | Versi lingkungan sandbox, instal, uji, rollback | Part 3 |
| 12 | Agent/Skills Manager | Registri agen & skill, versi, status validasi | Fase 4–6 |
| 13 | Credential Manager | Simpan kunci terenkripsi, hanya Gateway yang bisa memakai | Fase 1 |
| 14 | Task Queue & Scheduler | Antrean + jadwal | Tabel Postgres (tanpa Redis dulu) |
| 15 | Database | Data perusahaan, event, antrean | Postgres (SQLite hanya untuk pengembangan) |
| 16 | File/Object Storage | Deliverables, artefak | Disk volume dulu; S3-kompatibel nanti |
| 17 | Logging & Monitoring | Log teknis + kesehatan sistem | Log terstruktur + pemeriksaan kesehatan |
| 18 | Security & Permission Manager | Izin per karyawan/tool, kebijakan | Penegak kebijakan di kode |
| 19 | Backup & Recovery | Cadangan database + file, uji pemulihan | Terjadwal, salinan di luar server |
| 20 | Notification System | Beri tahu CEO: persetujuan, gagal, selesai | Web Push (PWA); verifikasi dukungan perangkat |

## 5. Perjalanan satu instruksi CEO
Contoh: "Buatkan tim produksi video untuk proyek saya."
1. **Frontend**: CEO mengetik di Command → `POST /commands` (HTTPS, sudah login). Event `command.received`.
2. **Backend**: validasi, simpan, balas langsung "diterima" (bukan "selesai").
3. **Director**: membaca instruksi + konteks (Pengetahuan/SMRITI) lewat Gateway → menghasilkan **rencana** (daftar langkah, karyawan, kebutuhan model/tools, perkiraan biaya). Event `plan.created`.
4. **Pemeriksaan kemampuan**: Orchestrator membandingkan kebutuhan dengan registri (model ada? tools ada? lolos uji?). Event `capability.checked`.
5. **Setup**: kebutuhan yang kurang → tugas ke Setup Assistant (instal Remotion di sandbox, uji, simpan versi). Jika perlu biaya → **berhenti**, event `approval.requested`, notifikasi ke HP.
6. **Eksekusi**: langkah-langkah dijalankan oleh Agent Runtime (tiap panggilan model lewat Gateway; tiap perintah di sandbox). Setiap langkah punya checkpoint, batas waktu, retry terbatas.
7. **Pemantauan**: Dashboard menerima event lewat SSE; status karyawan dihitung dari event, bukan dikarang.
8. **QA**: CAKRA memeriksa dengan **uji objektif** (file ada, durasi video sesuai, tes lolos) plus penilaian model.
9. **Hasil**: file disimpan di storage, dicatat sebagai deliverable + versi.
10. **Laporan**: Director merangkum jujur (apa selesai, apa gagal, berapa biaya). Notifikasi ke CEO.
11. **Pengetahuan**: SMRITI mencatat keputusan & pelajaran.
12. Jika gagal di langkah mana pun: status `Failed`/`Blocked` + alasan nyata; tidak ada "berhasil" palsu.

## 6. Evaluasi teknologi

> Catatan metode: informasi diambil dari pencarian web per 13 Nov 2026. Sebagian berasal dari situs sekunder (blog/agregator) dan belum diuji langsung di sini. Verifikasi di sumber resmi sebelum memutuskan.

### 6.1 Ringkasan keputusan
| Teknologi | Peran | Putusan |
|---|---|---|
| Orchestrator buatan sendiri (Postgres + state machine) | Pusat kendali | **Utama** |
| OpenAI Agents SDK | Pustaka "gelung agen" di Agent Runtime | **Kandidat utama** (uji spike dulu) |
| Hermes Agent | Strategic Advisor/riset | **Opsional** (kontainer terpisah) |
| n8n (self-hosted) | Konektor layanan/jadwal | **Opsional, ditunda** |
| OpenClaw | — | **Tidak dijadikan inti**; hanya opsional terisolasi di masa depan |
| Docker sandbox | Eksekusi tools | **Utama** |
| Gemini / OpenAI / Claude | Penyedia model | Lewat Gateway; lihat 6.5 |
| LangGraph, Temporal, CrewAI, AutoGen/AG2 | — | Tidak dipilih sekarang (evaluasi ringan, belum diuji) |

### 6.2 Perbandingan
| | Kelebihan | Kekurangan | Biaya | Risiko keamanan |
|---|---|---|---|---|
| **OpenAI Agents SDK** | Ide sedikit: agen, handoff, guardrail, sesi, tracing; ada Python dan JS/TS; bisa memakai penyedia lain lewat adaptor (mis. LiteLLM) | Bawaannya condong ke OpenAI; **tracing default mengirim ke dasbor OpenAI** (harus dimatikan/diganti); proses panjang butuh mesin durabel di luar SDK (mis. Temporal/DBOS) | Gratis (lisensi bebas); biaya hanya pemanggilan model | Rendah bila lewat Gateway kita |
| **Hermes Agent** (Nous Research) | Sumber terbuka (MIT), model-agnostik, skill yang bisa dipelajari/disempurnakan sendiri, subagen, MCP, penjadwal, memori lintas sesi | Lebih ke asisten pribadi; punya memori/skill sendiri (terpisah dari SMRITI); fitur "skill otomatis" bertentangan dengan aturan validasi kita kecuali dikunci; kematangan & tanggal rilis berbeda antar sumber | Gratis; butuh server & model | Sedang: agen dengan eksekusi; wajib sandbox |
| **n8n** | Visual, banyak konektor, jadwal/webhook, self-host gratis | Lisensi *source-available* (Sustainable Use), **bukan open source**; boleh untuk bisnis sendiri, tidak boleh dijual/ditanam sebagai layanan; **tidak ada paket cloud gratis** (cloud berbayar mulai ±€20/bulan); menyimpan kredensial sendiri (brankas kedua); bukan tempat yang tepat untuk Cost Guard/persetujuan | Self-host: server saja | Sedang: kredensial ganda |
| **OpenClaw** | Agen otonom yang terhubung ke pesan/browser/shell, ekosistem besar | Model keamanan untuk **satu operator tepercaya**; laporan eksternal menyebut celah gateway (CVE-2026-32025), skill berbahaya, akses host luas tanpa sandbox bawaan; risiko prompt injection | Gratis; biaya pengamanan tinggi | **Tinggi** |
| **Orchestrator sendiri** | Cocok persis dengan aturan kita (biaya, persetujuan, status nyata); satu sumber kebenaran | Perlu dibangun & dipelihara | Waktu rekayasa | Terkendali |

### 6.3 Bahasa backend (keputusan teknis, perlu persetujuan)
Rekomendasi: **Python** untuk backend + runtime agen (ekosistem agen/SDK paling lengkap; Hermes juga Python). Node/Remotion tetap jalan sebagai *tool* di sandbox, jadi tidak perlu dua bahasa di backend. Alternatif: TypeScript penuh (satu bahasa dengan frontend). Pilih salah satu dan jangan campur (D-09).

### 6.4 Eksekusi lokal vs cloud
| Opsi | Kelebihan | Kekurangan | Rekomendasi |
|---|---|---|---|
| VPS + Docker | Selalu menyala, bisa diakses HP, terisolasi dari data pribadi | Biaya tetap; perlu pengamanan & pemeliharaan | **Utama** |
| Laptop CEO (Local Worker) | Tanpa biaya server; GPU/CPU lokal | Tidak selalu menyala; risiko ke berkas pribadi | Ditunda; opsional untuk render berat |
| Cloud terkelola (serverless/PaaS) | Sedikit pemeliharaan | Biaya variabel sulit diprediksi; batas eksekusi | Tidak untuk fase awal |
Catatan: rendering video (Remotion/FFmpeg) memakan CPU/RAM; VPS terkecil bisa lambat. Ukur dulu sebelum menaikkan paket (butuh persetujuan biaya).

### 6.5 Penyedia model (fakta yang perlu diketahui CEO)
- **Gemini API**: ada *free tier* (tanpa tagihan, dibatasi laju), hanya untuk model tertentu (model gambar/video tertentu **tidak** gratis). Batas per-model kini tidak dipublikasikan di dokumen, hanya terlihat di konsol AI Studio per proyek. **Konten tier gratis dapat dipakai Google untuk memperbaiki produknya** (kecuali di wilayah tertentu). Implikasi: jangan kirim data rahasia ke tier gratis.
- **OpenAI dan Claude (API)**: umumnya berbayar per token (verifikasi). **Langganan chat (mis. ChatGPT Plus, Claude Pro) bukan kredit API.** Keduanya terpisah.
- **Model terbuka/agregator** (mis. model ber-label gratis di agregator): kuota berubah-ubah, ada yang melarang menjual ulang akses; perlakukan sebagai tidak stabil.
- Prinsip: Gateway mengklasifikasi tiap kunci/model sebagai `gratis-terverifikasi`, `berbayar`, atau `tidak diketahui` (diperlakukan **berbayar**).

## 7. Arsitektur repository
**Putusan: tetap satu monorepo.** Alasan: satu pemilik, satu aplikasi; sudah ada struktur `frontend/ backend/ local-worker/ shared/`; memecah menambah pekerjaan tanpa manfaat. Pertimbangkan memisah hanya bila: (a) tim bertambah, (b) kebutuhan izin akses berbeda, atau (c) ada situs publik.

Usulan struktur (tanpa membuat folder baru sebelum Fase 1 disetujui):
```
frontend/      Aplikasi CEO (PWA)
backend/       API, orkestrator, gateway, cost guard, kredensial   (zona kendali)
runtime/       Definisi image sandbox, kebijakan jaringan, skrip uji (zona eksekusi)
local-worker/  (ditunda; opsional laptop)
shared/        Skema event/status, tipe data bersama
docs/          Dokumen; docs/v2 = blueprint ini
tests/         Uji logika, API, e2e, uji penolakan biaya/keamanan
```
Website publik: **tidak dibuat** (bukan kebutuhan).
Hosting frontend: setelah backend ada, sajikan dari VPS yang sama (satu alamat, tanpa CORS, bisa privat) dan hentikan GitHub Pages; ini juga menghindari kebutuhan paket berbayar untuk Pages privat (D-10).

## 8. Keputusan arsitektur (ADR ringkas)
| ID | Keputusan | Alasan |
|---|---|---|
| A1 | Dua zona (kendali/eksekusi) | Batasi dampak bila agen disusupi |
| A2 | Semua panggilan model lewat LLM Gateway | Satu titik penegakan biaya & redaksi secret |
| A3 | Status = proyeksi dari event | Mustahil memalsukan status |
| A4 | Postgres untuk data + event + antrean | Satu sistem, tanpa Redis awal |
| A5 | Orchestrator buatan sendiri | Biaya/persetujuan/status harus sesuai aturan kita |
| A6 | SSE (bukan WebSocket) untuk status | Lebih sederhana, cocok di HP |
| A7 | Agen tidak pernah memegang secret | Secret hanya di Gateway |
| A8 | Lingkungan sandbox versi tak berubah (image bertag) | Rollback = kembali ke tag lama |
| A9 | Tiap komponen eksternal di balik adaptor | Hindari terkunci pada satu kerangka |
| A10 | Login satu CEO: passkey + cadangan TOTP | Sederhana dan kuat; verifikasi dukungan perangkat |

## 9. Risiko
Kompleksitas berlebih sejak awal (mitigasi: Fase kecil, satu layanan); ketergantungan penyedia (adaptor); kebocoran lewat sandbox (tanpa secret, jaringan allow-list); biaya server tak terduga (persetujuan CEO); informasi teknologi cepat usang (uji spike, kunci versi).

## 10. Rekomendasi
Mulai dengan: VPS kecil, satu backend, Postgres, Docker sandbox, Gateway + Cost Guard, event log. Uji **spike** terbatas: Agents SDK vs gelung sederhana buatan sendiri sebelum memilih. Tunda n8n dan Hermes sampai ada alur nyata yang membutuhkannya.

## 11. Pertanyaan untuk CEO
D-03, D-04, D-09, D-10, D-11, D-14. Lihat `KEPUTUSAN-CEO.md`.
