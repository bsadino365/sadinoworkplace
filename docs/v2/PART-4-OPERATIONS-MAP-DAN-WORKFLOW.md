# PART 4 — AI Operations Map dan Workflow Perusahaan

**Status: RENCANA (spesifikasi).** Belum ada kode.

## 1. Ringkasan eksekutif
Peta operasi dan Virtual Office adalah **tampilan dari data**, bukan sumber data. Satu aturan menjaga kejujuran:

> **Status hanya boleh dihitung dari event nyata.** Tidak ada kode antarmuka yang boleh menulis "bekerja". Jika tidak ada bukti (event/heartbeat), tampilkan **Tidak diketahui**.

Peta menjadi bagian Dashboard (bukan aplikasi terpisah). Tampilan ala n8n dibuat sendiri dari event kita; n8n tidak diperlukan untuk itu.

## 2. Penjelasan sederhana
Setiap hal penting yang terjadi di sistem menulis satu "catatan kejadian" (event). Dashboard hanya membaca catatan itu. Karyawan terlihat "bekerja" **karena** ada catatan "sedang menjalankan tugas", bukan karena animasi diatur agar tampak sibuk.

## 3. Node dan hubungan
**Jenis node:** CEO, Director, Setup Assistant, Advisor (Hermes bila aktif), Karyawan (13+), Model, Provider, Tool, Runtime/Lingkungan, Workflow, Task, Integrasi eksternal, Persetujuan, Deliverable.
**Jenis garis (edge):** `memerintah`, `mendelegasikan`, `memakai-model`, `memakai-tool`, `berjalan-di`, `menghasilkan`, `menunggu`, `tergantung-pada`.
**Aturan:** garis hanya muncul bila ada relasi nyata di database/event (mis. karyawan benar-benar dirutekan ke model X). Tidak ada garis dekoratif.

Contoh jalur nyata:
```
CEO → Director → Setup Assistant → Provider Gemini → ARUNA
Director → VEDA → Remotion → FFmpeg → [Hasil Video]
```

## 4. Status dan cara menghitungnya
| Status | Berlaku untuk | Syarat (dari event) |
|---|---|---|
| Connected | Provider, tool, integrasi | Pemeriksaan kesehatan lolos dan belum kedaluwarsa (TTL) |
| Working | Karyawan, Setup Assistant, workflow | Ada `step.started` tanpa `step.finished` dan heartbeat segar |
| Thinking | Agen | Ada panggilan model berjalan (`model.call.started` tanpa selesai) |
| Collaborating | ≥2 agen | Ada handoff/delegasi aktif antar-agen |
| Idle | Agen | Tidak ada langkah berjalan; heartbeat sehat |
| Completed | Task/langkah | `step.finished` sukses; tampil sementara lalu kembali Idle |
| Failed | Task/langkah/integrasi | `step.failed` atau `integration.failed` (alasan terlampir) |
| Blocked | Task | Ketergantungan belum terpenuhi (tool/model/kredensial/kuota) |
| Waiting Approval | Task | `approval.requested` tanpa keputusan |
| **Unknown** (tambahan) | Semua | Heartbeat hilang/kedaluwarsa. Ditambahkan agar tidak pernah menebak |

Pemetaan 10 status tugas v1.2.0: Pending/Planned→Planned; Waiting Approval→Waiting Approval; Approved→Planned; In Progress→Working; Waiting Laptop/External Service→Blocked; Completed→Completed; Failed→Failed; Cancelled→Cancelled (tidak ditampilkan di peta).

## 5. Struktur event
Event bersifat **append-only** (hanya ditambah, tidak diubah).
```json
{
  "id": "evt_01H…",
  "seq": 18452,
  "ts": "2026-11-13T09:15:02.123Z",
  "type": "step.started",
  "actor": { "kind": "employee", "id": "VEDA" },
  "subject": { "kind": "step", "id": "stp_…" },
  "run_id": "run_…",
  "task_id": "tsk_…",
  "severity": "info",
  "cost": { "class": "free", "tokens_in": 0, "tokens_out": 0, "amount": 0 },
  "payload": { "summary": "Render pratinjau 3 detik" },
  "redacted": true
}
```
Aturan: `payload` tidak boleh memuat secret (redaksi dua lapis); `seq` menaik tanpa celah (celah = sinyal masalah); semua event terkait satu perintah berbagi `run_id`.

**Katalog tipe event (awal):**
- Perintah/rencana: `command.received`, `plan.created`, `plan.revised`
- Eksekusi: `step.started`, `step.progress`, `step.finished`, `step.failed`, `step.retry`, `run.completed`, `run.failed`
- Model: `model.call.started`, `model.call.finished`, `model.call.denied` (alasan: biaya/kuota/izin)
- Biaya: `cost.recorded`, `quota.exhausted`, `route.changed`
- Persetujuan: `approval.requested`, `approval.granted`, `approval.denied`, `approval.expired`
- Setup: `capability.checked`, `integration.ready`, `integration.failed`, `env.build.started`, `env.build.finished`, `env.rollback`
- Kolaborasi: `handoff.started`, `handoff.finished`
- Mutu: `qa.check.started`, `qa.check.finished` (hasil objektif terlampir)
- Hasil: `deliverable.created`
- Kesehatan: `heartbeat`, `health.ok`, `health.failed`
- Keamanan: `security.policy_denied`, `security.injection_suspected`, `security.secret_redacted`
- Agen: `agent.proposed`, `agent.validated`, `agent.activated`, `agent.deactivated`

## 6. Mekanisme anti-palsu
1. **Proyeksi**: status node = fungsi dari event terbaru; tidak ada kolom "status" yang ditulis langsung oleh antarmuka.
2. **Bukti terlihat**: ketuk node → lembar bawah menampilkan 5 event terakhir sebagai bukti.
3. **Animasi terikat status**: sprite/animasi dipilih dari status terhitung; status Unknown/Idle tidak beranimasi sibuk.
4. **Tidak ada mode demo di produksi.** Jika demo dibutuhkan untuk desain, harus berlabel jelas "DEMO" dan terpisah (disarankan tidak dibuat).
5. **Uji kejujuran**: tes otomatis memutar event buatan lalu memastikan tampilan identik dengan hasil proyeksi; tes "tanpa event → semua Idle/Unknown".
6. **Celah urutan** (`seq`) dan heartbeat hilang memunculkan peringatan.

## 7. Transport ke HP
Server-Sent Events (SSE) dari backend; klien mengirim `last_seq` untuk menyambung ulang tanpa kehilangan event. Offline: tampilkan snapshot terakhir berlabel "terakhir diperbarui…". Notifikasi untuk perhatian CEO (persetujuan, gagal, selesai) lewat Web Push; dukungan di iPhone memerlukan aplikasi terpasang di layar utama (verifikasi saat implementasi).

## 8. Desain workflow
Workflow = **rencana berupa data** (graf langkah), bukan kode tersembunyi.
```
langkah: id, pemilik (karyawan), butuh {model, tools}, kelas biaya,
         gerbang {persetujuan?, QA?}, bergantung-pada [..], batas waktu,
         kebijakan retry, keluaran yang diharapkan
```
Aturan eksekusi: checkpoint tiap langkah (bisa dilanjutkan setelah restart); retry terbatas dengan jeda; langkah idempoten bila mungkin; batas waktu per langkah; gerbang persetujuan **menjeda** run pada titik tepat, lalu melanjutkan setelah keputusan; QA berupa pemeriksaan objektif dahulu, penilaian model kedua; laporan akhir menyebut kegagalan apa adanya.

Contoh: "Buatkan tim produksi video" (versi pilot):
```
[S1 ARUNA riset topik] → [S2 KANSA naskah] → [G-QA CAKRA cek naskah]
        → [S3 NARA suara]* → [S4 RUPA grafik]* → [S5 VEDA rakit video]
        → [G-QA CAKRA cek objektif: durasi, resolusi, file ada] → [Deliverable]
* langkah butuh tool/model; jika belum ada → S0 Setup Assistant menyiapkan;
  jika butuh berbayar → GERBANG PERSETUJUAN, run Waiting Approval.
```
Pengelolaan kegagalan: kegagalan langkah → retry sesuai kebijakan → bila tetap gagal, `Failed` + alasan; Director dapat mengusulkan jalur alternatif (CEO diberi tahu); tidak ada langkah yang dilompati diam-diam.

## 9. Skenario penggunaan
| # | Skenario | Perilaku peta |
|---|---|---|
| U1 | CEO: "Riset pasar X" | CEO→Director→ARUNA; ARUNA Thinking saat model dipanggil; hasil jadi deliverable |
| U2 | Butuh Remotion | Setup Assistant Working; node Remotion Connected setelah uji lolos |
| U3 | Butuh model berbayar | Task Waiting Approval; node kuning; notifikasi ke HP |
| U4 | Kuota Gemini habis | Provider Failed/Blocked "kuota"; rute dialihkan jika ada alternatif gratis |
| U5 | Render gagal | VEDA Failed dengan alasan; Director menawarkan opsi |
| U6 | Agen baru diusulkan | Node agen berstatus `Ditinjau`, garis putus-putus, belum aktif |
| U7 | Backend mati | Semua Unknown + banner "tidak terhubung" |
| U8 | CEO offline | Notifikasi menunggu; pekerjaan non-berbayar tetap berjalan; yang perlu persetujuan berhenti |

## 10. Spesifikasi tampilan
- Dashboard hanya dua navigasi utama: **Dashboard** dan **Command**; modul lain di "Lanjutan".
- **Virtual Office**: 2D/isometrik minimalis premium, Light/Dark; satu "meja" per karyawan, status tampak dari pose + label status (teks selalu hadir, tidak hanya animasi).
- **Operations Map**: default hanya jalur yang sedang bergerak; filter lapisan (Organisasi / Infrastruktur / Run); ketuk node = detail; ramah layar 390px.
- Implementasi: tanpa build (SVG/Canvas biasa) atau pustaka grafik; putuskan saat Fase 7 setelah uji kinerja di HP. Jangan memuat pustaka besar bila tidak perlu.
- Hindari kartun kekanak-kanakan; palet netral dengan satu warna aksen per status.

## 11. Peran n8n di sini
Tidak diperlukan untuk peta. Bila kelak dipakai, workflow n8n hanya muncul sebagai node jika ia **melaporkan event** ke Backend kita (webhook). Peta membaca event kita, bukan antarmuka n8n.

## 12. Risiko
Event terlalu banyak (mitigasi: ringkas, retensi, agregasi); kebocoran lewat payload (redaksi + uji); peta terlalu ramai di HP (mitigasi: default jalur aktif); status basi saat koneksi putus (mitigasi: TTL + Unknown); animasi memberi kesan palsu (mitigasi: aturan anti-palsu poin 3–5 di bagian 6).

## 13. Rekomendasi
Bangun **event log dan proyeksi status di Fase 1–2**, daftar "Live Status" sederhana di Fase 2, dan visual penuh (Virtual Office + Map) di Fase 7. Visual tanpa event nyata tidak boleh dikerjakan lebih dulu.

## 14. Pertanyaan untuk CEO
D-13 (alur pilot), D-15 (kanal notifikasi). Lihat `KEPUTUSAN-CEO.md`.
