# Daily Routine PWA

Aplikasi rutinitas harian pribadi yang dibuat dengan HTML, CSS, dan JavaScript.

## Fitur

- Tampilan aktivitas sekarang dan selanjutnya
- Timeline harian
- Ringkasan mingguan
- Editor lengkap per hari
- Tambah, hapus, dan urutkan aktivitas
- Edit jam dan nama aktivitas
- Edit workout per hari
- Salin jadwal dari hari lain
- Reset satu hari atau seluruh data
- Autosave ke `localStorage`
- Export/import backup JSON
- Persistent storage request
- Offline support dan installable PWA
- Link cepat ke workout Notion

## Menjalankan secara lokal

Karena project memakai JavaScript module dan service worker, jalankan melalui local server.

```bash
python -m http.server 8080
```

Lalu buka:

```text
http://localhost:8080
```

## Deployment Cloudflare Pages

- Build command: kosongkan
- Build output directory: `/`
- Root directory: repository utama

## Penyimpanan

Data pengguna tersimpan di `localStorage` dengan key:

```text
daily-routine-data-v1
```

Update project tidak menimpa jadwal yang sudah tersimpan selama domain tetap sama.
