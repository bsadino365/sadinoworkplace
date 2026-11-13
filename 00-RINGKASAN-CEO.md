# Blueprint v2.0.0 — Autonomous AI Company

**Status dokumen:** RENCANA. Tidak ada kode baru, tidak ada dependensi baru, tidak ada integrasi AI yang aktif.
Versi 2.0.0 adalah *Blueprint Release*: kemampuan aplikasi sama dengan v1.2.0, ditambah dokumen Part 1–5.

## Cara membaca
Satu Part = satu file. Isi tidak dicampur antar-Part (sesuai aturan kerja).

| File | Isi |
|---|---|
| `PART-1-AUDIT-DAN-VALIDASI-VISI.md` | Audit nyata isi repository + kelayakan visi |
| `PART-2-ARSITEKTUR-TARGET.md` | Komponen, diagram, alur instruksi, evaluasi teknologi, struktur repo |
| `PART-3-AI-SETUP-ASSISTANT.md` | Spesifikasi, aturan biaya, keamanan, skenario uji |
| `PART-4-OPERATIONS-MAP-DAN-WORKFLOW.md` | Peta operasi, workflow, struktur event/status |
| `PART-5-ROADMAP-DAN-KRITERIA.md` | Fase, risiko, kriteria keberhasilan, daftar kerja |
| `KEPUTUSAN-CEO.md` | Semua keputusan yang menunggu Anda, dengan rekomendasi |

## Ringkasan 10 kalimat
1. Aplikasi saat ini (v1.2.0) adalah **PWA statis**: 14 modul, data hanya di browser, **nol panggilan jaringan**.
2. Yang benar-benar berfungsi: pencatatan lokal (tugas, persetujuan, pengetahuan, anggaran) dan aturan bisnis yang teruji.
3. Yang **belum ada sama sekali**: backend, AI Director, eksekusi tugas, koneksi model, status karyawan nyata.
4. Temuan penting: syarat aktivasi karyawan mensyaratkan provider berstatus "Terhubung", tetapi **tidak ada kode yang bisa mengubah status itu**, jadi karyawan mustahil aktif saat ini.
5. Data HP dan laptop **tidak tersinkron** (masing-masing browser punya data sendiri); ini bertentangan dengan visi "HP + desktop".
6. Visi **layak**, tetapi hanya jika dibangun bertahap di atas backend sungguhan (server kecil/VPS), bukan GitHub Pages.
7. Aturan biaya "GRATIS = otonom, BERBAYAR = persetujuan" harus dipaksa oleh kode (gerbang panggilan model), bukan oleh instruksi ke AI.
8. "Gratis" ≠ "aman": layanan gratis tertentu memakai data Anda untuk perbaikan produk mereka; perangkat lunak gratis bisa berbahaya. Perlu aturan tambahan (Part 3).
9. Rekomendasi teknologi: pengendali buatan sendiri di atas database; OpenAI Agents SDK sebagai kandidat; Hermes opsional sebagai penasihat; n8n ditunda; OpenClaw tidak dijadikan inti.
10. Urutan kerja diubah dari usulan awal: **Cost Guard dan sistem event dibangun sebelum AI Director**.

## Yang sudah ada vs rencana
| Status | Arti |
|---|---|
| ✅ Ada & teruji | Sudah ada di v1.2.0 dan lolos `npm test` |
| 🔧 Perlu dikembangkan | Ada kerangka/tampilan, belum berfungsi nyata |
| 📝 Rencana | Hanya ada di dokumen ini |

## Catatan nama
Prompt Anda menyebut **Sadino Workplace**; berkas yang diunggah bernama **Bawaulin AI Workspace**. Keduanya diperlakukan sebagai proyek yang sama. Nama final: lihat `KEPUTUSAN-CEO.md` D-01.

## Batasan audit
Repository GitHub `bsadino365/sadinoworkplace` **tidak dapat diakses** dari lingkungan kerja ini. Audit dilakukan pada `bawaulin-ai-workspace_v1_2_0.zip`. Jika repo terbaru berbeda, kirim zip/file terbaru agar Part 1 diperbarui (D-02).
