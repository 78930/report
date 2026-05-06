# 🛡️ CivicReport — Full-Stack Issue Reporting App

A production-ready MERN + React Native app for reporting public infrastructure issues (potholes, water leaks, power outages, etc.) with OTP login, geolocation, image upload, ward/department routing, and an admin panel.

---

## 📁 Project Structure

```
civic-report/
├── backend/          ← Node.js + Express + MongoDB API
├── mobile/           ← React Native + Expo mobile app
└── admin-panel/      ← React.js Admin Dashboard
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Twilio account (optional — dev uses console OTP)
- Cloudinary account (optional — can skip for dev)
- Expo CLI: `npm install -g expo-cli eas-cli`

---

## 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
npm run seed    # Seeds admin, departments, sample issues
npm run dev     # Starts on http://localhost:5000
```

### Required `.env` values for dev:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/civic-report
JWT_SECRET=any-long-random-string
NODE_ENV=development
# Leave Twilio blank for dev — OTP prints to console
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/send-otp | Send OTP to phone |
| POST | /api/auth/verify-otp | Verify OTP + login/register |
| POST | /api/auth/admin-login | Admin email/password login |
| GET | /api/issues | Public issue feed |
| POST | /api/issues | Create issue (auth required) |
| GET | /api/issues/:id | Issue detail |
| GET | /api/issues/ticket/:id | Track by ticket ID |
| POST | /api/issues/:id/upvote | Upvote issue |
| GET | /api/issues/metrics | Dashboard metrics |
| GET | /api/admin/dashboard | Admin overview |
| GET | /api/admin/issues | All issues (admin) |
| PUT | /api/admin/issues/:id/status | Update status |
| GET | /api/admin/users | All users |
| POST | /api/admin/users/officer | Create officer |
| GET | /api/admin/departments | Departments list |

---

## 2️⃣ Mobile App Setup (Expo)

```bash
cd mobile
npm install

# Create .env file
echo 'EXPO_PUBLIC_API_URL=http://192.168.1.x:5000/api' > .env
# Replace with your local machine's IP (not localhost)

npx expo start         # Start dev server
npx expo start --android   # Open in Android emulator
npx expo start --ios       # Open in iOS simulator
```

### Test OTP Login (Dev Mode)
In development, the OTP is printed to the backend console AND returned in the API response for easy testing. Enter any phone number and use the printed OTP.

---

## 3️⃣ Admin Panel Setup

```bash
cd admin-panel
npm install

# Create .env
echo 'REACT_APP_API_URL=http://localhost:5000/api' > .env

npm start     # Opens at http://localhost:3000
```

**Default Admin Credentials:**
- Email: `admin@civicreport.in`
- Password: `Admin@123`

---

## ☁️ Production Deployment

### Backend — Deploy to Railway / Render / VPS

#### Option A: Railway (Recommended — free tier)
```bash
npm install -g railway
railway login
railway new
railway add mongodb   # Adds MongoDB plugin
railway up
```

#### Option B: Render
1. Push backend to GitHub
2. Create new Web Service on render.com
3. Set environment variables
4. Deploy

#### Option C: VPS (Ubuntu)
```bash
# Install Node, PM2, Nginx
sudo apt install nodejs npm nginx
npm install -g pm2

# Clone and setup
git clone <your-repo>
cd civic-report/backend
npm install
cp .env.example .env && nano .env  # Fill values

# Start with PM2
pm2 start server.js --name "civic-api"
pm2 startup && pm2 save

# Nginx reverse proxy
sudo nano /etc/nginx/sites-available/civic-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/civic-api /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.yourdomain.com  # SSL
sudo systemctl restart nginx
```

### Admin Panel — Deploy to Vercel / Netlify

```bash
cd admin-panel

# Vercel
npm install -g vercel
REACT_APP_API_URL=https://api.yourdomain.com/api
vercel --prod

# Or Netlify
npm run build
# Drag-and-drop build/ folder to netlify.com
```

---

## 📱 Build & Deploy Mobile App to Play Store

### Step 1: Setup EAS
```bash
cd mobile
npm install -g eas-cli
eas login                    # Login with Expo account
eas build:configure          # Links project to EAS
```

### Step 2: Update API URL for Production
In `app.json` → `extra.API_BASE_URL`:
```json
"API_BASE_URL": "https://api.yourdomain.com"
```

In `src/services/api.js`, use:
```js
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.yourdomain.com/api';
```

### Step 3: Build for Android
```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

EAS will:
- Build in the cloud (no local Android SDK needed)
- Generate a signed `.aab` file
- Provide a download link

### Step 4: Submit to Google Play Store

#### Manual submission:
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app → "CivicReport"
3. Fill: App description, screenshots, category (Tools / Social)
4. Upload the `.aab` file to Internal Testing
5. Add test users → promote to Production

#### Automated submission (after getting service account key):
```bash
# Download google-play-service-account.json from Play Console
# IAM & Admin → Service Accounts → Create → Download JSON
eas submit --platform android
```

### Step 5: Required Assets for Play Store
```
mobile/src/assets/
├── icon.png              (1024×1024 PNG)
├── splash.png            (1284×2778 PNG)
├── adaptive-icon.png     (1024×1024 PNG, no padding)
└── screenshots/
    ├── phone_1.png       (screenshots of key screens)
    └── phone_2.png
```

**App Store Listing Checklist:**
- [ ] App icon (1024×1024)
- [ ] Feature graphic (1024×500)
- [ ] 2-8 phone screenshots (1080×1920 recommended)
- [ ] Short description (80 chars): "Report civic issues and track resolution in real-time"
- [ ] Full description (4000 chars)
- [ ] Content rating questionnaire
- [ ] Privacy policy URL
- [ ] Category: Tools or Government/Public Services

---

## 🔧 Configuration Reference

### MongoDB Schema Collections
- `users` — Citizens, officers, admins
- `issues` — All reported complaints
- `departments` — PWD, BESCOM, BBMP, etc.
- `otps` — OTP records (auto-expire in 10 min)

### Auto-features
- **Ticket ID generation**: `CR-ROA-00001` format per category
- **Department auto-routing**: Category → Department code mapping
- **Escalation**: Issues with 50+ upvotes auto-escalate
- **OTP expiry**: 10 minutes, 5 max attempts, 3 OTPs per 10 min
- **Geospatial indexing**: 2dsphere on issue location for nearby queries

### Environment Variables Summary (Backend)
| Variable | Required | Description |
|----------|----------|-------------|
| MONGO_URI | ✅ | MongoDB connection string |
| JWT_SECRET | ✅ | Random 32+ char string |
| NODE_ENV | ✅ | development / production |
| TWILIO_* | ⚠️ | Required for real SMS OTP |
| CLOUDINARY_* | ⚠️ | Required for image upload |
| EMAIL_* | Optional | For email notifications |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo SDK 50 |
| State | React Context + SecureStore |
| Navigation | React Navigation v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + OTP (Twilio) |
| Images | Cloudinary |
| Maps | Expo Location + react-native-maps |
| Admin UI | React.js + Recharts |
| Deployment | Railway/Render + EAS Build |

---

## 📝 License

MIT License — Free to use, modify, and deploy for civic purposes.

Built for Indian municipal systems but adaptable for any city.
# report
