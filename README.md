# Financial Tracker PWA

Aplikasi Financial Tracker yang bisa di-install di HP kamu.

## Cara Deploy & Install di HP

### Opsi 1: GitHub Pages (GRATIS & Paling Gampang)

1. **Buat akun GitHub** di [github.com](https://github.com) (kalau belum punya)
2. **Buat repository baru** → nama: `financial-tracker` → centang **Public**
3. **Upload semua file** dari folder `FinancialTracker/` ke repository
4. **Aktifkan GitHub Pages:**
   - Buka repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** → folder: **/ (root)**
   - Klik **Save**
5. **Tunggu 1-2 menit**, app kamu live di:
   ```
   https://USERNAME.github.io/financial-tracker/
   ```

### Opsi 2: Netlify (GRATIS, Drag & Drop)

1. Buka [app.netlify.com](https://app.netlify.com)
2. **Drag & drop** folder `FinancialTracker/` ke halaman Netlify
3. Selesai! Langsung dapat link `.netlify.app`

---

## Cara Install di HP

Setelah app online, buka linknya di browser HP:

### Android (Chrome):
1. Buka link app di **Chrome**
2. Tunggu beberapa detik, akan muncul banner **"Add to Home Screen"**
3. Atau tekan **⋮ menu** → **"Install app"** / **"Add to Home Screen"**
4. App muncul di home screen dengan ikon sendiri ✨

### iPhone (Safari):
1. Buka link app di **Safari**
2. Tekan tombol **Share** (kotak dengan panah ke atas)
3. Scroll ke bawah, pilih **"Add to Home Screen"**
4. Ketik nama → **Add**
5. App muncul di home screen ✨

---

## Struktur File

```
FinancialTracker/
├── index.html        ← Halaman utama
├── style.css         ← Styling
├── app.js            ← Logic aplikasi
├── manifest.json     ← PWA manifest (nama, ikon, dll)
├── sw.js             ← Service Worker (offline support)
└── icons/
    ├── icon-192.png  ← Ikon 192x192
    └── icon-512.png  ← Ikon 512x512
```
