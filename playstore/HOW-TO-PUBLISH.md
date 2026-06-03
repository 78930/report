# PublicReport — Play Store Publishing Guide

Everything below is ready. You only need to run 3 commands.

---

## What's already done (by the assistant)

| File | What it does |
|---|---|
| `mobile/app.json` | Cleaned permissions, correct package name `in.publicreport.app` |
| `mobile/eas.json` | Production build profile → AAB format |
| `privacy-policy.html` | Required by Play Store — host this online |
| `playstore/store-listing.txt` | Copy-paste text for Play Console |

---

## One-time setup (do this once)

### 1. Create accounts

| Account | Link | Cost |
|---|---|---|
| Expo account | expo.dev/signup | Free |
| Google Play Console | play.google.com/console | **$25 one-time** |

### 2. Install EAS CLI

```bash
npm install -g eas-cli
```

### 3. Login to Expo

```bash
eas login
# enter your expo.dev email + password
```

### 4. Host the privacy policy

Upload `privacy-policy.html` to any free host:

- **Netlify Drop** (easiest): drag the file to netlify.com/drop → get a URL
- **GitHub Pages**: push to a repo → enable Pages
- **Any web host**: upload to `publicreport.in/privacy-policy`

---

## Build & Publish (3 commands)

Open terminal, go to the mobile folder:

```bash
cd civic-report/mobile
```

**Step 1 — Build the AAB (cloud build, ~15 min):**
```bash
eas build --platform android --profile production
```
- First time: it will ask to generate a keystore → press **Y** (EAS manages it safely)
- When done: you get a download link for the `.aab` file

**Step 2 — Download the AAB** from the link EAS gives you, OR submit directly:

```bash
eas submit --platform android
# It will ask which build to submit → pick the latest production build
```

---

## In Google Play Console

1. Go to **play.google.com/console** → **Create app**
2. Fill in app name: `PublicReport`, language: English, type: App, free
3. Go to **Testing → Internal testing** → Create release → Upload the `.aab`
4. Test it on your own phone via the internal track link
5. Complete the **store listing** (copy from `playstore/store-listing.txt`)
6. Complete **Data safety** form (answers in `store-listing.txt`)
7. Complete **Content rating** questionnaire
8. Move to **Production** → Start rollout → **Submit for review**

> Google reviews new apps in **3–7 days**.

---

## Future updates

Every time you change the app:

1. Bump `versionCode` in `app.json` (1 → 2 → 3 ...)
2. Bump `version` string (1.0.0 → 1.0.1 ...)
3. Run:

```bash
eas build --platform android --profile production
eas submit --platform android
```

---

## Keystore backup (IMPORTANT)

EAS stores your keystore securely in the cloud. To download a backup:

```bash
eas credentials
# Select Android → production → Download keystore
```

**Never lose the keystore** — without it you cannot update your app on Play Store.
