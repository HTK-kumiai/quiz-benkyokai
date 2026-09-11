# Deploy ke Ubuntu dengan Docker + Cloudflared

Panduan ini cocok untuk struktur proyek saat ini per 3 September 2026.

## 1. Prasyarat di Server Ubuntu

Install Docker dan Compose plugin:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Logout lalu login lagi supaya grup `docker` aktif.

## 2. Upload Project ke Server

Pilih salah satu:

```bash
git clone <repo-kamu>
cd souzai-kako
```

atau kirim folder proyek ini via `scp` / `rsync`.

## 3. Siapkan Environment

Copy contoh env:

```bash
cp .env.example .env
```

Isi `TUNNEL_TOKEN` di `.env`.

## 4. Ambil Token Cloudflared

Kalau kamu sudah pernah pakai Cloudflare Tunnel, cara paling cepat:

1. Login ke Cloudflare Zero Trust Dashboard
2. Buka **Networks** → **Tunnels**
3. Buat tunnel baru atau pakai tunnel yang sudah ada
4. Tambahkan public hostname, misalnya `quiz.domainkamu.com`
5. Arahkan service ke:

```text
http://souzai-kako-app:3000
```

6. Ambil token tunnel
7. Simpan ke `.env`:

```bash
TUNNEL_TOKEN=eyJh...
```

## 5. Jalankan Container

```bash
docker compose up -d --build
```

Cek:

```bash
docker compose ps
docker compose logs -f souzai-kako-app
docker compose logs -f cloudflared
```

## 6. Update Aplikasi

Kalau ada perubahan kode:

```bash
git pull
docker compose up -d --build
```

## 7. Data dan Login

Server Docker hanya menyajikan folder `public/`. API JSON lama sudah dinonaktifkan.
Login dan skor memakai Supabase; isi `public/config/supabase.config.js` dan jalankan
`sql/supabase-schema.sql` sesuai [panduan Supabase](setup-supabase.md) sebelum deploy.
Backup data dilakukan pada project Supabase, bukan folder `data/` lokal.

## 8. Troubleshooting

Kalau app tidak bisa diakses:

```bash
docker compose logs --tail=100 souzai-kako-app
docker compose logs --tail=100 cloudflared
```

Kalau port lokal bentrok, ubah ini di `compose.yaml`:

```yaml
ports:
  - "3001:3000"
```

Kalau hanya mau akses lewat cloudflared dan tidak perlu akses publik ke port server, kamu bisa hapus mapping port ini:

```yaml
ports:
  - "3000:3000"
```

Lalu biarkan hanya `cloudflared` yang mengakses service internal Docker.
