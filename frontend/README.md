# CheckPoint!! — Frontend Application

> **Dual Health Intelligence & Regulatory Verification System**
> Built from Google Stitch Design System (Project ID: `2052610589543124770`)

---

## 🌟 Overview

**CheckPoint!!** empowers Indian consumers to instantly decode packaged foods and feminine hygiene products against mandatory Indian regulatory benchmarks (**FSSAI**, **BIS IS 5405:2019**, and **CDSCO**) and peer-reviewed toxicological journals.

### Key Capabilities
- **Split Dual-Action Hub**: Dedicated paths for **Food & Nutrition** (Green Identity) and **Women's Sanitary Care** (Lavender Identity).
- **Dual Scanner**:
  - **Barcode Scanner**: Viewfinder with flashlight control and manual entry.
  - **OCR Label Scanner**: Photograph nutrition tables and ingredient lists, edit/verify extracted text, and submit for backend grading.
- **Expressive Grade (A–D)**: Official letter grades computed via backend standards.
- **Gemini AI Intelligence**: "The Big Picture", rationale for grades, clean alternative suggestions, and interactive clinical Q&A.
- **Women's Hygiene Protocol**: Specialized metrics for Total Chlorine Free (TCF) bleaching, undetectable dioxins (<0.01ppt), fragrance allergens, and BIS absorbency.
- **Personalized Health Profile**: Track scan history, saved watchlists, and custom allergen/additive alerts.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS + Custom Design Tokens ([DESIGN.md](./DESIGN.md))
- **State Management**: Zustand
- **Data Fetching**: TanStack Query + Axios
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Mobile Container**: Capacitor compatible

---

## 🚀 Getting Started

Ensure you are inside the `frontend/` directory:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```

---

## 📱 Mobile & Responsive Support

Built for smooth operation across:
- **Android & iOS Devices**: Native safe-area insets, tap feedback, camera integration.
- **Mobile Viewports**: 360px – 480px.
- **Tablets & Laptops**: 768px – 1366px+. Intelligently centered layout avoiding stretching.
