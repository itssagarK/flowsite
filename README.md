<div align="center">
  <div style="background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%); padding: 2px; border-radius: 24px; display: inline-block; margin-bottom: 20px;">
    <div style="background: #030712; padding: 20px 40px; border-radius: 22px;">
      <h1 style="margin: 0; background: linear-gradient(135deg, #818CF8 0%, #F472B6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3em;">FlowSite</h1>
      <p style="color: #94A3B8; font-size: 1.2em; margin-top: 10px;">Build Your Dream Website in Seconds</p>
    </div>
  </div>
</div>

---

## 🌟 Overview

**FlowSite** is a blazing-fast, modern, and highly interactive website builder designed to democratize web creation. Whether you are a software engineer needing a portfolio, a student showcasing college projects, a startup launching a landing page, or a developer releasing an app, FlowSite provides the tools to generate stunning, responsive, and personalized websites without writing a single line of code.

The core philosophy behind FlowSite is **"Instant Creation, Zero Dependencies."** You build your site in a rich, 3D-enhanced visual editor, and when you are ready, you export a clean, single-file HTML/CSS/JS document that can be hosted anywhere for free (GitHub Pages, Vercel, Netlify, etc.).

## ✨ Key Features & Logic

FlowSite is engineered with several advanced features that set it apart from traditional rigid template builders:

### 1. Multi-Disciplinary Templates
Instead of forcing a generic layout, FlowSite offers tailored data structures and UI components based on the `WebsiteType`:
*   **Personal Portfolios:** Optimized for developers and designers (Projects, Skills, Experience).
*   **College Projects:** Structured for academia (Coursework, Semesters, Technologies, Awards).
*   **Business Websites:** Built for conversion (Services, Statistics, Testimonials, Team).
*   **App Landing Pages:** Designed for software products (Features, Pricing Tiers, FAQs).

### 2. The Export Engine (Zero-Dependency Output)
**The Logic:** Most site builders lock you into their hosting ecosystem or export convoluted React/Webpack projects. FlowSite's `exportCode` function (found in `BuilderContext.tsx`) takes a different approach. It dynamically generates a pure, vanilla HTML string injected with semantic tags and scoped CSS variables. 
*   **Why?** This ensures the exported website loads instantly, requires zero build steps, has perfect SEO, and can be hosted on the simplest static servers.

### 3. AI-Powered Content Generation (The Scanner)
*   **The Feature:** An integrated "AI Image Scanner" that utilizes the Gemini API (`@google/genai`).
*   **The Logic:** Users often struggle with the "blank page problem" when writing bios or structuring their skills. By allowing a user to upload a resume screenshot or a profile image, FlowSite aims to automatically populate the Editor fields (Name, Bio, Tagline, Skills) using generative AI, dramatically reducing onboarding time.

### 4. Real-Time 3D Interactive Canvas
*   **The Feature:** A stunning, interactive 3D background system (`Background3D.tsx`) using Three.js and React Three Fiber.
*   **The Logic:** To provide a premium, modern aesthetic out-of-the-box. The geometries (Icosahedrons, Tori, Spheres) float and react to user interaction, creating a dynamic visual experience that makes the resulting websites feel alive and high-end.

### 5. Advanced Theming System
*   **The Feature:** Instant switching between Light/Dark modes, multiple Accent Colors, and Layout Styles (Modern, Minimal, Brutalist).
*   **The Logic:** Theming is handled via CSS variables injected at the `:root` level (`index.css` and `BuilderContext.tsx`). This allows the React application to instantly reflect theme changes without re-rendering heavy components, ensuring a buttery-smooth editing experience.

## 🛠️ Technical Architecture

FlowSite is built on a modern, bleeding-edge frontend stack:

*   **Framework:** React 19
*   **Build Tool:** Vite 6 (for ultra-fast HMR and optimized builds)
*   **Styling:** Tailwind CSS v4 (utilizing the new `@theme` directive and custom CSS variables for complex gradients and glassmorphism effects)
*   **Animations:** Motion (formerly Framer Motion) for fluid layout transitions, micro-interactions, and complex state animations (`AnimatePresence`, `layoutId`).
*   **3D Graphics:** `three`, `@react-three/fiber`, and `@react-three/drei` for the interactive background scenes.
*   **Icons:** Lucide React for consistent, clean iconography.
*   **State Management:** React Context API (`BuilderContext.tsx`). The entire state of the user's website is maintained in a single, deeply nested object (`PortfolioData`), allowing any component in the editor or preview to instantly read and mutate the website's configuration.

## 🚀 Getting Started (Local Development)

To run FlowSite locally on your machine and contribute to the project:

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/itssagarK/flowsite.git
    cd flowsite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root of the project to enable AI features.
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or the port specified in your terminal).

## 📁 Project Structure

```text
flowsite/
├── src/
│   ├── components/
│   │   ├── editor/       # The left-hand sidebar for data input (EditorPanel.tsx)
│   │   ├── home/         # The initial landing page and template selector
│   │   ├── preview/      # The rendered sections of the user's website (Hero, Projects, etc.)
│   │   └── three/        # 3D canvas and WebGL components (Background3D.tsx)
│   ├── context/          # State management logic (BuilderContext.tsx)
│   ├── App.tsx           # Main application routing and layout
│   ├── index.css         # Global styles, Tailwind configuration, and CSS variables
│   └── main.tsx          # React entry point
├── public/               # Static assets
├── index.html            # Main HTML template
├── vite.config.ts        # Vite build and plugin configuration
└── package.json          # Project dependencies and scripts
```

## 🤝 Contributing

Contributions to FlowSite are highly encouraged! Whether it's adding new layout styles in the export function, improving the 3D backgrounds, or integrating more AI features, your help is welcome.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---
*Built with ❤️ for creators, developers, and designers.*