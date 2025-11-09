# 🎯 Vize Dostu - Vize Başvuru Yardım Uygulaması

Türkiye'den yurt dışına vize başvurusu yapacak kişilere **yapay zeka destekli** yardımcı mobil uygulama.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)

## 📱 Özellikler

- ✅ **AI Chatbot** - GPT-4 destekli Türkçe vize danışmanı
- ✅ **Vize Başvuru Takibi** - Adım adım progress görüntüleme
- ✅ **Belge Yönetimi** - Belge yükleme ve organize etme
- ✅ **Pasaport Yenileme** - Otomatik süre dolum uyarıları
- ✅ **5 Ana Ekran** - Modern ve kullanıcı dostu arayüz

## 🏗️ Teknoloji Stack

### Backend (NestJS)
- **Framework:** NestJS 10.x + TypeScript
- **Database:** PostgreSQL 15 + Prisma ORM
- **Cache:** Redis 7
- **AI:** OpenAI GPT-4 API
- **Auth:** JWT

### Mobile (React Native + Expo)
- **Framework:** Expo SDK 54 + React Native 0.81
- **State:** Redux Toolkit
- **Navigation:** React Navigation 7
- **UI:** React Native Paper

## 🚀 Hızlı Başlangıç

### ☁️ Production (Render.com)

**Backend:** https://vizedostu-backend.onrender.com
**Swagger API Docs:** https://vizedostu-backend.onrender.com/api/docs

### 💻 Local Development

#### 1️⃣ Docker Başlat
```powershell
docker-compose up -d postgres redis
```

#### 2️⃣ Backend Başlat
```powershell
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

✅ Backend: http://localhost:3000
✅ Swagger: http://localhost:3000/api/docs

#### 3️⃣ Mobile Başlat
```powershell
cd mobile
npm install
npx expo start
```

iPhone'da Expo Go ile QR tarayın.

## 🧪 Admin Hesabı
```
👑 Admin: gundogdukadir53@gmail.com
🔑 Şifre: webrek2024
📱 Tel: +905538546853
```

**Not:** İlk deploy sonrası Render'da seed çalışacak ve admin hesabı otomatik oluşacak.

## 📱 Ekranlar

1. **🏠 Ana Sayfa** - Hoş geldin, Aktif başvurular, Quick actions
2. **📄 Belgelerim** - Pasaport bilgileri, Ülkelere göre belgeler
3. **🤖 AI Asistan** - GPT-4 destekli vize danışmanı
4. **📊 Başvuru Takip** - Adım adım progress (Evrak→Randevu→Konsolosluk→Sonuç)
5. **🛂 Pasaport** - Pasaport yenileme modülü
6. **👤 Profil** - Hesap bilgileri

## 📖 API Dokümantasyonu

Swagger UI: http://localhost:3000/api/docs

### Ana Endpoint'ler:
- `POST /auth/register` - Kayıt
- `POST /auth/login` - Giriş
- `GET /applications` - Başvuruları listele
- `POST /documents/upload` - Belge yükle
- `POST /ai-assistant/chat` - AI ile sohbet
- `GET /passports` - Pasaport bilgileri

## 🔧 Konfigürasyon

### Backend .env
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vizedostu
REDIS_URL=redis://localhost:6379
JWT_SECRET=VizeDostuSuperSecretKey2024!
OPENAI_API_KEY=sk-proj-...
```

### Mobile .env
```env
# Production (Render)
API_URL=https://vizedostu-backend.onrender.com/api/v1

# Local Development
# API_URL=http://192.168.111.5:3000/api/v1
```

**Not:** Production için Render URL kullanılıyor. Local development için PC IP'sini kullanın.

## 🐳 Docker Komutları

```powershell
# Başlat
docker-compose up -d postgres redis

# Durdur
docker-compose down

# Logları gör
docker-compose logs -f postgres
```

## 🔍 Sorun Giderme

### Backend çalışmıyor
```powershell
# Docker kontrol
docker ps

# Port kontrol
netstat -ano | findstr :3000
```

### Mobile bağlanamıyor
- Backend çalışıyor mu? → http://localhost:3000/health
- IP adresi doğru mu? → `ipconfig` ile kontrol et
- iPhone ve PC aynı WiFi'de mi?

### Expo hatası
```powershell
cd mobile
npx expo start --clear  # Cache temizle
```

## 📞 İletişim

- Email: info@vizedostu.com
- Backend API: http://localhost:3000/api/docs

---

⭐ **Proje çalışır durumda! SDK 54 ile iOS uyumlu!**
