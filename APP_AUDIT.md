# FlowSite: Comprehensive App Audit & Improvement Roadmap

## 1. Executive Summary
**FlowSite** is a high-performance, interactive website builder designed to create "Zero-Dependency" websites. It targets developers, students, and businesses by offering a visual editor that exports standalone, production-ready HTML files.

---

## 2. Core Objectives
*   **Democratize Web Design:** Enable non-designers to create high-end, modern websites.
*   **Zero-Lock-in:** Exported sites are pure HTML/CSS/JS, requiring no proprietary hosting or runtimes.
*   **Speed & Efficiency:** Focus on "Instant Creation" through templates and AI-assisted content generation.
*   **Modern Aesthetic:** Utilize 3D graphics and fluid animations to ensure out-of-the-box professional quality.

---

## 3. Comprehensive Feature Audit

### 🏗️ Architecture & State
*   **Framework:** React 19 + Vite 6 (Bleeding edge).
*   **State Management:** Centralized `BuilderContext` handling a deeply nested `PortfolioData` object.
*   **Website Types:** Supports four distinct modes: `Portfolio`, `College Project`, `Business`, and `App Landing Page`.
*   **Dynamic Theming:** Real-time CSS variable manipulation for colors and Light/Dark mode.

### ✍️ Editor Capabilities (`EditorPanel.tsx`)
*   **Profile Management:** Name, role, bio, and avatar upload (DataURL based).
*   **Section Control:** Fine-grained visibility toggles for 9+ website sections.
*   **Dynamic Content:** Add/Edit/Delete functionality for complex lists (Projects, Skills, Experience, Services, Pricing).
*   **Visual Customization:** Accent color picker, layout style selector (Modern/Minimal/Brutalist), and animation speed settings.
*   **AI Integration (UI):** "AI Image Scanner" button designed to pre-fill profile data using Gemini.

### 🖼️ Preview System (`Canvas.tsx`)
*   **3D Background:** Interactive Three.js scene with floating geometries reacting to the accent color.
*   **Section Rendering:** Specialized components for each `WebsiteType`.
*   **Animations:** Extensive use of `motion` for scroll progress, section entry, and UI interactions.
*   **Responsiveness:** Sticky navigation and fluid layouts designed for multiple screen sizes.

### 📤 Export Engine
*   **Logic:** Generates a single-file HTML string with embedded styles.
*   **Output:** Semantic HTML, basic responsive CSS, and essential metadata.

---

## 4. Current Limitations & "Under the Hood" Findings
1.  **AI Stub:** The `scanImage` function in `BuilderContext.tsx` is currently a mock (simulated delay) and does not call the Google Generative AI API despite the dependency being present.
2.  **Export Fidelity Gap:** The exported HTML is significantly simpler than the preview. It lacks the 3D backgrounds, complex `motion` animations, and the refined "glassmorphism" look of the editor preview.
3.  **Persistence:** There is no `localStorage` or backend persistence. Refreshing the browser resets all progress.
4.  **Device Preview UI Only:** The TopBar has device icons (Mobile/Tablet/Desktop), but clicking them does not yet resize the preview canvas to simulate those viewports.
5.  **Section Variety:** While there are 3 "Global" layout styles, individual sections (e.g., Hero) do not yet have their own sub-templates.

---

## 5. Improvement Roadmap (How to Improve)

### 🚀 High Priority (Functionality)
*   **Implement Gemini API:** Connect the `scanImage` function to `@google/genai`. Allow users to upload a resume or LinkedIn screenshot to auto-populate the entire site.
*   **Add LocalStorage Persistence:** Save the `data` object to `localStorage` on every change so users don't lose work.
*   **Fix Device Preview:** Implement a container in `Canvas.tsx` that adjusts its width (e.g., `375px` for mobile) based on the `activeDevice` state.

### 🎨 Medium Priority (UX & Polish)
*   **Enhanced Export Engine:** 
    *   Include a simplified CSS-only version of the floating 3D elements (using CSS animations).
    *   Add basic "Fade In" animations to the export using a tiny script or pure CSS `@keyframes`.
    *   Improve the CSS variable injection to ensure the exported site perfectly matches the chosen theme.
*   **Section Sub-Templates:** Allow users to pick between "Hero Style A" (Centered) and "Hero Style B" (Split Screen).
*   **Asset Optimization:** Instead of raw DataURLs (which make the HTML file huge), suggest a way to compress images or allow external URLs.

### 🛠️ Low Priority (Scaling)
*   **Multiple Pages:** Currently only supports single-page "Landing Page" styles. Adding support for sub-pages (e.g., `/blog`) would expand use cases.
*   **Custom Domain Guide:** In the export modal, provide links or instructions on how to host the exported file on GitHub Pages or Vercel.
*   **Icon Library Search:** Allow users to search the full Lucide icon library for Services/Features instead of fixed defaults.

---
*Audit conducted on May 19, 2026.*
