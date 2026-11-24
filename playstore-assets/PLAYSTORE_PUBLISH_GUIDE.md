# 🚀 Google Play Store Publishing Guide — Adilabad App

This folder and project contains everything required to publish **Adilabad App** to the **Google Play Store**.

---

## 📱 App Package Details
* **App Name**: Adilabad App
* **Package Name (Application ID)**: `in.digitalcrowdtech.adilabad`
* **Target Website**: `https://adilabad.digitalcrowdtech.in/`
* **Version Code**: `1`
* **Version Name**: `1.0.0`
* **Category**: Shopping / Lifestyle / Local

---

## 📦 Generated Release Files (Ready to Use)

### ⚡ Capacitor Native Android Build (Recommended):
* **Play Store Release Bundle (.aab)**:
  - `playstore-assets/AdilabadApp-Capacitor-v1.0.0.aab` (`3.06 MB`) — **Upload this to Google Play Console**
* **Direct Install APK (.apk)**:
  - `playstore-assets/AdilabadApp-Capacitor-v1.0.0.apk` (`3.21 MB`) — **Install directly on any Android phone**

---

### 🌐 TWA Native Android Build:
* **Play Store Release Bundle (.aab)**:
  - `playstore-assets/AdilabadApp-v1.0.0.aab` (`4.08 MB`)
* **Direct Install APK (.apk)**:
  - `playstore-assets/AdilabadApp-v1.0.0.apk` (`4.69 MB`)

---

## 🔐 Release Signing Keystore
A production release keystore has already been generated in the root directory:
* **File Path**: `adilabad-release-key.jks`
* **Key Alias**: `adilabad`
* **Keystore Password**: `AdilabadApp@2026`
* **Key Password**: `AdilabadApp@2026`
* **SHA-256 Certificate Fingerprint**:
  ```
  82:E7:28:9A:41:3F:77:F4:CD:A4:76:C9:67:FE:94:E7:99:91:D0:F4:27:A0:1D:8F:68:71:33:C0:75:62:91:69
  ```
* **Digital Asset Links**:
  Already generated and live at:
  `https://adilabad.digitalcrowdtech.in/.well-known/assetlinks.json`
  *(This removes the browser address bar so the app opens as 100% fullscreen native app).*

---

## 🎨 Store Listing Assets Ready
In `playstore-assets/`:
1. **App Icon (512x512 PNG)**: `google-play-icon-512x512.png` (Full RGB, no alpha transparency, ready for Google Play).
2. **Feature Graphic (1024x500 PNG)**: `google-play-feature-graphic-1024x500.png` (Ready for Google Play store header).
3. **Phone Screenshots**: You can upload the screenshots from mobile testing.

---

## 📝 Store Listing Text (Copy & Paste)

### App Title (Max 30 characters):
```
Adilabad App: Local Discover
```

### Short Description (Max 80 characters):
```
Adilabad's central marketplace for ads, rentals, local businesses & services.
```

### Full Description (Up to 4000 characters):
```
Welcome to Adilabad App — the official hyperlocal discovery marketplace and super app designed specifically for Adilabad district, Telangana.

🌟 KEY FEATURES:
• Verified Advertisements: Explore commercial deals, promotions, and bargains across Adilabad Town, Collectorate, Cinema Road, and all mandals.
• Rental Equipment & Vehicles: Rent tractors, agricultural machinery, cameras, construction tools, and wedding supplies directly from local owners.
• Commercial Business Directory: Find verified phone numbers, locations, and timings of local merchants, clinics, stores, and professionals.
• Buy & Sell Marketplace: Buy and sell used vehicles, handloom sarees, properties, electronics, and household goods safely.
• Local Services & Jobs: Connect with trusted technicians, electricians, plumbers, drivers, and explore local job vacancies.
• Adilabad Life: Discover food & dining spots, tourism guides, upcoming district events, and community updates.

Designed with offline support, multi-language accessibility (English, Telugu, Hindi, Urdu), and rapid loading.
```

---

## 🛠️ How to Generate the `.aab` (Android App Bundle)

### Method 1: Using Android Studio (Already Installed on your PC!)
1. Open **Android Studio** (`C:\Program Files\Android\Android Studio\bin\studio64.exe`).
2. Click **Open** and select the `android` folder in this project:
   `G:\Usama\Usama\ADILABAD\android`
3. Wait for Gradle sync to complete.
4. From the top menu, go to **Build** > **Generate Signed Bundle / APK...**
5. Select **Android App Bundle (.aab)** and click **Next**.
6. Select your existing keystore:
   - Keystore path: Browse and select `adilabad-release-key.jks`
   - Keystore password: `AdilabadApp@2026`
   - Key alias: `adilabad`
   - Key password: `AdilabadApp@2026`
7. Choose destination folder and build variant **release**, then click **Create**.
8. Android Studio will generate `app-release.aab`!

### Method 2: Instant 1-Click via PWABuilder (Fastest Online)
1. Visit **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Enter your live website: `https://adilabad.digitalcrowdtech.in/`.
3. Click **Package for Android**.
4. In Package Options:
   - Package ID: `in.digitalcrowdtech.adilabad`
   - App Name: `Adilabad App`
   - Select "Upload existing keystore" and choose `adilabad-release-key.jks` (Password: `AdilabadApp@2026`).
5. Click **Generate** — your `.aab` download starts immediately!

---

## 🚀 Uploading to Google Play Console
1. Go to **[Google Play Console](https://play.google.com/console)**.
2. Click **Create app**:
   - App name: `Adilabad App`
   - Default language: `English (India)`
   - App or game: `App`
   - Free or paid: `Free`
3. In **Dashboard** > **Set up your store listing**:
   - Paste Title, Short Description, and Full Description from above.
   - Upload `playstore-assets/google-play-icon-512x512.png`.
   - Upload `playstore-assets/google-play-feature-graphic-1024x500.png`.
   - Upload at least 2 mobile screenshots.
4. In **Release** > **Production** (or **Closed testing**):
   - Click **Create new release**.
   - Drag and drop your `app-release.aab`.
   - Enter Release notes (e.g., `Initial release of Adilabad App v1.0.0`).
   - Click **Review and rollout**!
