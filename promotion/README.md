# CheckPoint!! Promotional Website & APK Distribution Portal

This is a dedicated, self-contained promotional website designed to showcase CheckPoint!! and distribute the Android APK directly to consumers and hackathon evaluators.

## Folder Structure
```
promotion/
├── index.html                  # Landing page with Neo-brutalist theme, device mockup, & QR code
├── package.json                # Lightweight npm server script
├── README.md                   # Documentation
└── downloads/
    ├── checkpoint-v1.0.apk     # Android APK file served for direct download
    └── README.md               # Guide to building & replacing APK releases
```

## How to Run Locally

You can preview the website locally using any static web server:

### Option 1: Via npm
```bash
cd promotion
npm start
```
Website will be available at `http://localhost:3000`.

### Option 2: Via Python (instant, no install needed)
```bash
cd promotion
python3 -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

## How to Update the APK File

When you build a new Android APK from `frontend/android`:
1. Build release or debug APK in Android Studio or via Gradle.
2. Copy the resulting `.apk` file into `promotion/downloads/checkpoint-v1.0.apk`.
3. The "Download APK" button and QR code on the website will immediately serve the new APK binary.

## Deployment Options

This directory is 100% static and zero-dependency. You can deploy it to:
- **Vercel**: `cd promotion && vercel`
- **Netlify**: Drag and drop the `promotion` folder into the Netlify dashboard
- **GitHub Pages**: Serve the `promotion/` folder from your repository settings
- **Firebase Hosting**: `firebase deploy --only hosting` with `public: "promotion"`
