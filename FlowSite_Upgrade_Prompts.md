# FlowSite — Complete Upgrade Prompt Guide
### Part-by-part prompts to transform FlowSite into an outstanding web builder

---

## How to use this guide

Paste each prompt exactly into your AI coding assistant (Cursor, Claude, Copilot) **one part at a time**. Complete and test each part before moving to the next. Parts are ordered by dependency — earlier parts are required by later ones.

---

---

# PART 1 — LocalStorage Persistence

**What this fixes:** Users currently lose all their work on every page refresh. This is the single biggest trust-killer.

---

### Prompt 1A — Auto-save to localStorage

```
I have a React app called FlowSite with a BuilderContext.tsx that holds a `data` object (PortfolioData) as the central state. I need to add localStorage persistence so users never lose their work.

Please do the following:

1. In BuilderContext.tsx, add a `useEffect` that runs every time `data` changes and calls:
   localStorage.setItem('flowsite_data', JSON.stringify(data))

2. When the context initialises, load saved data with:
   const saved = localStorage.getItem('flowsite_data')
   const initialData = saved ? JSON.parse(saved) : DEFAULT_DATA

3. Add a `clearSavedData()` function to the context that calls:
   localStorage.removeItem('flowsite_data')
   then resets state to DEFAULT_DATA

4. Make sure the default data constant is exported so it can be reused.

5. Debounce the save by 500ms using a useRef-based debounce (no lodash) so we don't write on every keystroke.

Keep all existing context API the same. Do not break any existing consumers.
```

---

### Prompt 1B — "Saved" indicator in the TopBar

```
In FlowSite's TopBar component, add a small save status indicator that shows:
- A pulsing dot + "Saving…" text for 500ms after any data change
- A green checkmark + "Saved" text that fades in after save completes
- Nothing when the app first loads with no changes

Requirements:
- Use the existing accent color CSS variable (--accent) for the dot
- The indicator should sit to the left of the Export button
- Use Framer Motion's `AnimatePresence` + `motion.div` for the fade transition
- The component reads a `saveStatus: 'idle' | 'saving' | 'saved'` prop
- Wire this prop from BuilderContext using the debounce timing from Prompt 1A

Style it as a small pill: 12px text, 6px horizontal padding, rounded-full, subtle border.
```

---

### Prompt 1C — "Reset to default" confirmation modal

```
In FlowSite's EditorPanel, add a "Reset all" button at the very bottom of the panel (below all sections).

When clicked, show a confirmation modal with:
- Title: "Start over?"
- Body: "This will erase all your content and reset to the default template."
- Two buttons: "Cancel" (closes modal) and "Reset" (calls clearSavedData() from BuilderContext then closes modal)

Requirements:
- Modal should be a centered overlay with a semi-transparent dark backdrop
- Use Framer Motion for the modal entrance (scale from 0.95 + fade in, 200ms)
- The Reset button should be styled in red/danger color
- Do not use any external modal library — build it with a React portal into document.body
- Make it accessible: trap focus inside modal, close on Escape key, aria-modal="true"
```

---

---

# PART 2 — Gemini AI Scanner (fully wired)

**What this fixes:** The "AI Image Scanner" button currently does nothing (mock delay only). This wires it to the real Gemini API to auto-fill profile data from a resume image or LinkedIn screenshot.

---

### Prompt 2A — Environment variable + API client setup

```
In FlowSite (React + Vite), set up the Gemini API client properly:

1. Create a `.env.local` file (add to .gitignore) with:
   VITE_GEMINI_API_KEY=your_key_here

2. In a new file `src/lib/gemini.ts`, create and export a configured GoogleGenerativeAI instance:
   import { GoogleGenerativeAI } from '@google/generative-ai'
   export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
   export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

3. Also export a `isGeminiConfigured` boolean:
   export const isGeminiConfigured = !!import.meta.env.VITE_GEMINI_API_KEY

4. In the TopBar or EditorPanel, if `isGeminiConfigured` is false, show a small warning tooltip on the AI Scanner button explaining the env var is missing.

Do not hardcode any API key anywhere in source files.
```

---

### Prompt 2B — The scanImage function (core logic)

```
In FlowSite's BuilderContext.tsx, replace the mock `scanImage` function with a real Gemini implementation.

The function signature must stay: `scanImage(file: File): Promise<void>`

Implementation requirements:

1. Convert the File to base64:
   const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
     const reader = new FileReader()
     reader.onload = () => resolve((reader.result as string).split(',')[1])
     reader.onerror = reject
     reader.readAsDataURL(file)
   })

2. Send to Gemini with this exact prompt (do not shorten it):
   """
   You are a resume and LinkedIn profile parser. Analyze this image and extract all available information.
   
   Return ONLY a valid JSON object with this exact structure (use empty string "" for missing fields, empty array [] for missing lists):
   {
     "name": "full name",
     "role": "current job title or desired role",
     "bio": "2-3 sentence professional summary written in first person",
     "email": "email address if visible",
     "phone": "phone number if visible",
     "location": "city, country if visible",
     "skills": ["skill1", "skill2", "skill3"],
     "experience": [
       { "company": "", "role": "", "duration": "", "description": "" }
     ],
     "projects": [
       { "title": "", "description": "", "tech": "" }
     ],
     "education": "degree and institution if visible"
   }
   
   Return ONLY the JSON. No markdown, no explanation, no code fences.
   """

3. Parse the response and merge into the existing `data` state using `setData(prev => ({ ...prev, ...parsed }))`. Only overwrite fields that are non-empty in the parsed result.

4. Set a context field `scanStatus: 'idle' | 'scanning' | 'done' | 'error'` and `scanError: string | null` that the UI can consume.

5. Wrap everything in try/catch. On error, set scanStatus to 'error' and scanError to the error message.
```

---

### Prompt 2C — File upload UI + scanning progress in EditorPanel

```
In FlowSite's EditorPanel, upgrade the "AI Image Scanner" section with a proper file upload UI:

1. Replace the existing button with a drag-and-drop zone that:
   - Accepts image files (PNG, JPG, WEBP) and PDF (for resume scans)
   - Shows a dashed border that turns solid + accent color on dragover
   - Displays: upload icon + "Drop your resume or LinkedIn screenshot" + "PNG, JPG, PDF up to 10MB"
   - Has a fallback "Browse files" text link that opens a hidden <input type="file">

2. When a file is dropped or selected:
   - Show a preview thumbnail (if image) or a file icon with filename (if PDF)
   - Show a "Scan with AI" button below the preview
   - Clicking "Scan with AI" calls scanImage(file) from BuilderContext

3. While scanStatus === 'scanning', show:
   - An animated progress bar (CSS keyframes, indeterminate style) in accent color
   - Text: "Reading your profile…" that cycles through ["Extracting skills…", "Parsing experience…", "Writing bio…"] every 1.5s

4. When scanStatus === 'done', show:
   - A green success banner: "Profile filled! Review and edit below."
   - A "Scan another" link that resets the zone

5. When scanStatus === 'error', show:
   - A red error banner with the scanError message
   - A "Try again" link

Use only Tailwind utility classes and Framer Motion. No external file upload libraries.
```

---

---

# PART 3 — Device Preview (fix the broken buttons)

**What this fixes:** The TopBar has Mobile / Tablet / Desktop icons but clicking them does nothing.

---

### Prompt 3A — Responsive canvas wrapper

```
In FlowSite's Canvas.tsx, wrap the preview content in a device-size container controlled by the `activeDevice` state from BuilderContext.

Requirements:

1. Read `activeDevice: 'mobile' | 'tablet' | 'desktop'` from BuilderContext.

2. Wrap the entire preview in a `motion.div` that animates width changes with spring physics:
   - mobile: max-width 375px
   - tablet: max-width 768px  
   - desktop: max-width 100%

3. The container should:
   - Be horizontally centered within the canvas area
   - Have a subtle device frame:
     - Mobile: rounded-[40px] border-4 border-gray-700 shadow-2xl with a small notch bar at the top (8px bar, rounded, same border color)
     - Tablet: rounded-[20px] border-4 border-gray-600 shadow-xl
     - Desktop: no frame, full width
   - Clip overflow so content doesn't spill outside the frame

4. Animate the transition with Framer Motion layoutId="device-frame" so it smoothly resizes when device changes.

5. The Three.js canvas background should always remain full-width behind the device frame (not clipped by it).

Keep all existing preview rendering logic intact.
```

---

### Prompt 3B — TopBar device switcher polish

```
In FlowSite's TopBar, upgrade the device preview switcher buttons:

1. The three buttons (Mobile, Tablet, Desktop) should be grouped in a pill container with a sliding highlight that moves to the active button using Framer Motion layoutId="device-indicator".

2. Each button shows:
   - Lucide icon: Smartphone / Tablet / Monitor
   - Tooltip on hover showing the device name + size (e.g. "Mobile — 375px")
   - Tooltip uses Framer Motion (opacity 0→1, y: 4→0, 150ms)

3. Active button: icon color becomes accent color, background gets a subtle fill
   Inactive buttons: muted color, no background

4. On screen widths below 768px, hide the Tablet and Desktop buttons (since you can't usefully preview those sizes on a small screen) and show a info tooltip "Device preview works best on larger screens".

5. Add a keyboard shortcut: Cmd+1 (mobile), Cmd+2 (tablet), Cmd+3 (desktop). Show the shortcut in the tooltip.
```

---

---

# PART 4 — Export Engine Upgrade

**What this fixes:** The exported HTML looks nothing like the gorgeous preview. Users feel cheated.

---

### Prompt 4A — CSS animations in export

```
In FlowSite's export engine (the function that generates the HTML string), add CSS animations to match the preview's feel:

1. Add this block inside the exported <style> tag:

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(2deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
}
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}
.section-animate { animation-delay: calc(var(--i, 0) * 0.1s); }

2. Apply `.fade-in-up section-animate` to every section element with an IntersectionObserver script:

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.setProperty('--i', i);
        e.target.classList.add('fade-in-up');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => observer.observe(s));
</script>

3. Add floating CSS shapes (replacing Three.js) as fixed-position pseudo-elements in the background:
   - 3–5 divs with class `.bg-shape`, absolutely positioned
   - Use the accent color with 8–12% opacity
   - Apply the `float` keyframe with staggered durations (8s, 11s, 14s)
   - Border-radius: 50% or random polygon via clip-path

Keep the script inline and under 50 lines total. No external dependencies.
```

---

### Prompt 4B — Glassmorphism and theme fidelity in export

```
In FlowSite's export engine, ensure the exported CSS perfectly matches the preview's visual theme:

1. Inject all CSS variables at :root based on the current theme values:
   :root {
     --accent: [user's chosen accent color];
     --accent-rgb: [R, G, B values separated by commas for rgba() use];
     --bg: [background color];
     --surface: [card surface color];
     --text: [primary text color];
     --text-muted: [secondary text color];
     --radius: [border radius value];
   }

2. For cards and section containers, add glassmorphism when the theme is "Modern":
   .glass-card {
     background: rgba(var(--accent-rgb), 0.05);
     backdrop-filter: blur(12px);
     -webkit-backdrop-filter: blur(12px);
     border: 1px solid rgba(var(--accent-rgb), 0.15);
     border-radius: var(--radius);
   }

3. For the "Brutalist" theme, add:
   .brutalist-card {
     border: 3px solid var(--text);
     border-radius: 0;
     box-shadow: 4px 4px 0 var(--text);
   }

4. For the "Minimal" theme:
   .minimal-card {
     border-bottom: 1px solid var(--text-muted);
     border-radius: 0;
     padding: 1.5rem 0;
   }

5. Export the hero section with a gradient heading:
   .gradient-heading {
     background: linear-gradient(135deg, var(--accent), var(--text));
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }

Apply the correct card class based on the layoutStyle stored in data.
```

---

### Prompt 4C — Export modal upgrade

```
Replace FlowSite's current export modal with a polished multi-step export experience:

Step 1 — "Customize export":
- File name input (default: "[name]-portfolio.html")
- Toggle: "Include floating background shapes" (default on)
- Toggle: "Include scroll animations" (default on)  
- Toggle: "Minify HTML" (default off)
- Preview of estimated file size (calculate in real time as toggles change)

Step 2 — "Download":
- Large animated download button with Lucide Download icon
- After clicking, show a checkmark animation (draw SVG path, 400ms)
- Below the button show 3 hosting option cards:
  - GitHub Pages: icon + "Free. Drag your file to a gh-pages repo." + link to guide
  - Netlify Drop: icon + "Free. Drag to drop.netlify.com" + external link
  - Vercel: icon + "Free. Use vercel deploy --prebuilt" + external link
- Each card is clickable and opens the link in a new tab

Modal design:
- Two-column layout on desktop (options left, preview right showing a mini iframe of the exported content)
- Single column on mobile
- Smooth step transition with Framer Motion (slide left on advance, slide right on back)
- Close on Escape or clicking backdrop
```

---

---

# PART 5 — Section Sub-templates

**What this fixes:** All sites look the same. Users want layout variety per section.

---

### Prompt 5A — Hero section variants

```
In FlowSite, add layout variant selection for the Hero section.

Create 3 hero variants:

Variant A — "Centered" (current default):
- Name + role centered, bio below, CTA buttons centered
- Avatar as a circle above the name

Variant B — "Split screen":
- Left half: text (name, role, bio, CTA buttons), right aligned
- Right half: avatar filling the half, slight parallax on scroll
- On mobile: stacks vertically (avatar on top)

Variant C — "Minimal typographic":
- No avatar
- Very large name (clamp(3rem, 8vw, 7rem)) in gradient text
- Role as a small uppercase label above the name
- Single line bio below
- Horizontal rule divider
- CTA buttons as text links with arrow icons

Implementation:
1. Add `heroVariant: 'centered' | 'split' | 'minimal'` to the PortfolioData type with default 'centered'
2. In EditorPanel, add a layout picker with visual thumbnail cards for each variant (simple SVG thumbnails showing the rough layout shape)
3. In Canvas.tsx HeroSection component, render the correct variant based on heroVariant
4. Update the export engine to export the correct variant HTML

Use Framer Motion AnimatePresence to crossfade between variants when switching.
```

---

### Prompt 5B — Skills section variants

```
In FlowSite, add 2 layout variants for the Skills section:

Variant A — "Tag cloud" (current):
- Pill badges for each skill, wrapping flex layout
- Accent-colored border, hover lifts with shadow

Variant B — "Proficiency bars":
- Each skill shows as a horizontal bar
- Bar fill animates from 0 to the skill's proficiency % on scroll entry
- Proficiency is a new field (0–100 number) added to each skill item
- Label on the left, percentage on the right
- Bar uses accent color with a gradient from accent to accent/60

Variant C — "Icon grid":
- 3-column grid of cards
- Each card: large icon area (use first letter of skill as a stylised letter in accent color) + skill name
- Cards have glassmorphism or minimal style based on active layout theme
- Hover: card lifts, slight scale(1.03)

Implementation:
1. Add `skillsVariant: 'tags' | 'bars' | 'grid'` to PortfolioData
2. Add `proficiency?: number` to the Skill type
3. Add variant picker + proficiency sliders in EditorPanel under the Skills section
4. Render accordingly in Canvas.tsx
5. Export the selected variant as static HTML with CSS-only bar animations
```

---

---

# PART 6 — UI & Editor Polish

**What this fixes:** The editor panel experience — making it feel as premium as the preview.

---

### Prompt 6A — Collapsible section accordion in EditorPanel

```
In FlowSite's EditorPanel, refactor the section list into a smooth accordion:

1. Each section (Profile, Hero, Skills, Projects, Experience, etc.) should be a collapsible panel:
   - Header row: section icon (Lucide) + section name + visibility toggle (eye icon) + chevron
   - Body: all the fields for that section, revealed on click
   - Only one section open at a time (like an accordion)
   - Active section header gets a left border in accent color

2. Animate open/close with Framer Motion:
   - Use `motion.div` with `variants={{ open: { height: 'auto' }, closed: { height: 0 } }}`
   - `overflow: hidden` on the container
   - Chevron rotates 180° when open (also animated)
   - Duration: 0.25s ease

3. Add drag-to-reorder for sections using @dnd-kit/sortable:
   - Each section header has a grip icon (GripVertical from Lucide) on the far left
   - Dragging reorders the section visibility order (stored in `data.sectionOrder`)
   - The preview updates in real time as sections are reordered
   - On drag: the dragged item gets slight opacity reduction + scale(1.02) shadow

4. Remember which section was last open in localStorage key 'flowsite_open_section'.
```

---

### Prompt 6B — Color picker upgrade

```
In FlowSite's EditorPanel, replace the basic accent color input with a full color picker experience:

1. Show a grid of 16 curated preset colors (provide these exact hex values):
   #6366f1, #8b5cf6, #ec4899, #ef4444, #f97316, #eab308,
   #22c55e, #14b8a6, #06b6d4, #3b82f6, #1d4ed8, #7c3aed,
   #db2777, #dc2626, #ea580c, #000000

2. Below the presets, show a custom color input:
   - A color swatch button that opens a native <input type="color"> picker
   - A hex text input next to it that syncs bidirectionally with the color picker
   - Validate hex on blur, revert to previous value if invalid

3. Show a live preview row below the picker:
   - A small card showing: primary button, text link, tag badge, and a heading — all using the chosen accent color
   - Updates in real time as color changes

4. Add a "Random" button that picks a random color from the presets array and applies it with a spin animation on the button icon.

5. The currently active color should show a checkmark overlay on its swatch.

All changes should call `setData(prev => ({ ...prev, accentColor: newColor }))` and immediately update the CSS variable on :root.
```

---

### Prompt 6C — Avatar upload upgrade

```
In FlowSite's EditorPanel, upgrade the avatar upload to a full image editor:

1. Drag-and-drop zone that accepts PNG, JPG, WEBP up to 5MB:
   - Dashed border, accent color on dragover
   - Shows current avatar as preview (circular crop) or a placeholder person icon

2. After selecting an image, show an inline crop UI:
   - Use react-easy-crop (install if not present)
   - Fixed 1:1 aspect ratio (circle crop preview)
   - Zoom slider (1x to 3x)
   - "Apply crop" button

3. After cropping:
   - Use canvas.toDataURL('image/webp', 0.7) to compress (reduces file size ~70%)
   - Store the cropped+compressed DataURL in data.avatar
   - Show final circular preview with a small "Change" button overlay on hover

4. Also offer "Use initials" fallback:
   - A button "Use initials instead" that sets data.avatar to null
   - When avatar is null, all preview components should show a circle with the user's initials in accent color background

5. Show the final DataURL byte size below the preview: e.g. "📁 42 KB — good" (green) or "📁 180 KB — large, may slow export" (amber) or "📁 400 KB — too large, re-crop" (red).
```

---

---

# PART 7 — Performance & Code Quality

**What this fixes:** Long-term maintainability and app performance.

---

### Prompt 7A — Three.js scene optimization

```
In FlowSite's Canvas.tsx, optimize the Three.js background scene:

1. Move the Three.js scene into a Web Worker using OffscreenCanvas:
   - Transfer the canvas to a worker: canvas.transferControlToOffscreen()
   - Run the Three.js render loop inside the worker
   - This frees the main thread for React rendering

2. If OffscreenCanvas is not supported (Safari < 17), fall back gracefully to the current main-thread implementation. Check with: typeof OffscreenCanvas !== 'undefined'

3. Pause the render loop when the tab is not visible:
   document.addEventListener('visibilitychange', () => {
     if (document.hidden) renderer.setAnimationLoop(null)
     else renderer.setAnimationLoop(animate)
   })

4. Reduce geometry complexity on mobile (navigator.maxTouchPoints > 0):
   - Use 8-segment spheres instead of 32-segment
   - Render max 4 floating objects instead of 8
   - Cap frame rate to 30fps: only render every other requestAnimationFrame

5. Dispose all Three.js resources on component unmount:
   - geometry.dispose() for every geometry
   - material.dispose() for every material
   - renderer.dispose()
   - Cancel animation frame
   This prevents memory leaks when the component re-mounts.
```

---

### Prompt 7B — Code splitting and lazy loading

```
In FlowSite (React + Vite), add proper code splitting to reduce the initial bundle size:

1. Lazy load the Three.js canvas:
   const ThreeCanvas = React.lazy(() => import('./ThreeCanvas'))
   Wrap with <Suspense fallback={<div className="canvas-skeleton" />}>
   The skeleton should be a gradient-animated placeholder (CSS @keyframes shimmer)

2. Lazy load the EditorPanel:
   const EditorPanel = React.lazy(() => import('./EditorPanel'))
   This means Three.js loads and starts rendering before the heavy editor code arrives.

3. In vite.config.ts, add manual chunk splitting:
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'three': ['three'],
           'framer': ['framer-motion'],
           'editor': ['./src/components/EditorPanel']
         }
       }
     }
   }

4. Add a preload hint in index.html for the editor chunk so it loads in parallel:
   <link rel="modulepreload" href="/assets/editor.[hash].js">
   (Generate this dynamically in the Vite build using vite-plugin-html or a custom plugin)

5. Show bundle size analysis by running:
   npx vite-bundle-visualizer
   and add this as an npm script: "analyze": "vite build && npx vite-bundle-visualizer"

Target: initial JS bundle under 200KB gzipped.
```

---

---

# PART 8 — New Features (competitive parity + beyond)

**What this goes beyond:** Features competitors don't have at this price point.

---

### Prompt 8A — QR code export

```
In FlowSite's export flow, add a QR code generator for the exported site:

1. After the user downloads the HTML file, show a new section in the export modal: "Share your site"

2. Add a button "Generate QR code":
   - When clicked, use the qrcode library (install: npm install qrcode) to generate a QR code
   - The QR code should encode a data: URI that plays back the HTML (for small files under 3KB) OR show instructions for hosting

3. Better approach — generate a shareable snippet:
   - Use a free paste API like https://api.paste.rs/ (POST the HTML, get back a URL)
   - QR code encodes that URL
   - Show the QR as a canvas element, 200×200px
   - Below it: "Scan to preview on mobile" 

4. Add a "Download QR code" button that converts the canvas to PNG and downloads it as "[name]-qr.png"

5. Add a "Copy link" button that copies the paste.rs URL to clipboard with a toast notification.

Use the qrcode npm package for generation. Style the QR code section as a card within the existing export modal Step 2.
```

---

### Prompt 8B — Template gallery (onboarding)

```
In FlowSite, add a template gallery as the first screen new users see (when localStorage has no saved data):

1. On first load (no saved data), instead of the editor, show a fullscreen template picker:
   - Header: "Start with a template" + skip link "Start blank →"
   - Grid of template cards (3 columns on desktop, 1 on mobile)

2. Create 6 starter templates as hardcoded data presets in a new file `src/data/templates.ts`:
   - "Developer Portfolio" — dark theme, purple accent, skills-heavy
   - "Designer Portfolio" — light theme, pink accent, projects-heavy
   - "Freelancer" — minimal theme, blue accent, services + pricing sections
   - "Student" — light theme, green accent, education + projects
   - "Startup Landing" — dark theme, orange accent, features + pricing
   - "Agency" — minimal theme, black accent, services + team

3. Each template card shows:
   - A small static preview (build as an HTML canvas or a styled div mimicking the layout)
   - Template name + "Best for: [audience]" label
   - Website type badge (Portfolio / Business / etc.)
   - "Use this template" button

4. Clicking a template:
   - Sets data state to that template's preset data
   - Saves to localStorage immediately
   - Transitions into the main editor with a smooth fade

5. In the EditorPanel, add a "Change template" link that returns to this screen (with a "Your content will be kept — only the layout and colors change" note).
```

---

### Prompt 8C — Keyboard shortcuts system

```
In FlowSite, add a global keyboard shortcuts system:

1. Create a useKeyboardShortcuts hook in src/hooks/useKeyboardShortcuts.ts that registers shortcuts with useEffect and cleans up on unmount.

2. Implement these shortcuts:
   - Cmd/Ctrl + E — toggle EditorPanel open/closed
   - Cmd/Ctrl + D — toggle dark/light mode
   - Cmd/Ctrl + Shift + E — trigger export modal
   - Cmd/Ctrl + 1/2/3 — switch device preview (mobile/tablet/desktop)
   - Cmd/Ctrl + Z — undo last data change (see undo system below)
   - Cmd/Ctrl + Shift + Z — redo
   - ? (question mark) — open shortcuts help modal

3. Add a simple undo/redo system in BuilderContext:
   - Keep a history array of the last 20 data snapshots
   - On every setData call, push the previous state to history
   - undo() pops from history and sets data to that snapshot
   - redo() moves forward through history

4. Add a "?" help modal that shows all shortcuts in a clean two-column table:
   - Left column: key combination shown as styled <kbd> elements
   - Right column: description
   - Opens/closes with the ? key and Escape
   - Semi-transparent backdrop, centered modal, Framer Motion entrance

5. Show a small "⌨ Shortcuts" link in the TopBar that opens the same modal on click.
```

---

---

# PART 9 — SEO & Meta for Exported Sites

**What this adds:** Makes exported sites actually findable and shareable.

---

### Prompt 9 — Complete meta tag injection in export

```
In FlowSite's export engine, inject a complete set of SEO and social meta tags into every exported HTML file:

1. Basic SEO:
<title>[name] — [role]</title>
<meta name="description" content="[first 155 chars of bio]">
<meta name="author" content="[name]">
<meta name="keywords" content="[skills joined by comma, first 10]">
<link rel="canonical" href="[leave blank with a comment: <!-- Add your URL here -->]">

2. Open Graph (for link previews on WhatsApp, Slack, iMessage):
<meta property="og:type" content="website">
<meta property="og:title" content="[name] — [role]">
<meta property="og:description" content="[bio first 155 chars]">
<meta property="og:image" content="[avatar DataURL if under 50KB, else omit with comment]">

3. Twitter Card:
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="[name] — [role]">
<meta name="twitter:description" content="[bio first 155 chars]">

4. JSON-LD structured data for Google:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[name]",
  "jobTitle": "[role]",
  "description": "[bio]",
  "email": "[email if provided]",
  "knowsAbout": [skills array]
}
</script>

5. Performance meta:
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">

All values must be HTML-escaped to prevent injection. Write a helper function escapeHtml(str: string): string that replaces &, <, >, ", ' with their HTML entities before injecting into meta tags.
```

---

---

# PART 10 — Final Polish & Deployment

**The finishing touches that make it feel production-grade.**

---

### Prompt 10A — Toast notification system

```
In FlowSite, add a lightweight toast notification system without any external library:

1. Create a ToastContext in src/context/ToastContext.tsx:
   type Toast = { id: string; message: string; type: 'success' | 'error' | 'info'; duration?: number }
   type ToastContextType = { addToast: (toast: Omit<Toast, 'id'>) => void }

2. Render toasts as a fixed stack in the bottom-right corner:
   - position: fixed, bottom: 1.5rem, right: 1.5rem, z-index: 9999
   - Each toast: pill shape, icon (✓ / ✕ / ℹ) + message, auto-dismiss after duration (default 3000ms)
   - Max 3 toasts visible at once; oldest auto-dismisses when a 4th arrives

3. Animate with Framer Motion:
   - Enter: slide in from right + fade in (x: 60 → 0, opacity: 0 → 1, 250ms spring)
   - Exit: slide out to right + fade out (x: 0 → 60, opacity: 1 → 0, 200ms ease)
   - Use AnimatePresence with mode="popLayout" for smooth stacking

4. Wire up toasts throughout the app:
   - addToast({ message: 'Changes saved', type: 'success' }) — after localStorage save
   - addToast({ message: 'Profile filled from image!', type: 'success' }) — after AI scan
   - addToast({ message: 'Copied to clipboard', type: 'info' }) — after copy actions
   - addToast({ message: err.message, type: 'error' }) — on any caught error
   - addToast({ message: 'HTML downloaded', type: 'success' }) — after export

5. Each toast has an "×" close button on the right that dismisses it immediately.
   Add a hover-pause behavior: hovering a toast pauses its auto-dismiss timer.
```

---

### Prompt 10B — README and documentation

```
Write a comprehensive README.md for the FlowSite project. It should cover:

1. **Hero section**: Project name, one-line description, badges (Vite, React, Three.js, Framer Motion), and a screenshot placeholder

2. **Features list** (use checkboxes):
   - ✅ Zero-dependency HTML export
   - ✅ 3D interactive Three.js canvas
   - ✅ AI profile scanner (Gemini 1.5 Flash)
   - ✅ 4 website types (Portfolio, Business, College, App Landing)
   - ✅ LocalStorage auto-save
   - ✅ Device preview (Mobile / Tablet / Desktop)
   - ✅ Dark / Light mode
   - ✅ 3 layout themes (Modern / Minimal / Brutalist)
   - ✅ Keyboard shortcuts
   - ✅ SEO meta injection in export

3. **Getting started** (exact commands):
   git clone [repo]
   cd flowsite
   npm install
   cp .env.example .env.local
   # Add your VITE_GEMINI_API_KEY to .env.local
   npm run dev

4. **Environment variables table**:
   | Variable | Required | Description |
   |---|---|---|
   | VITE_GEMINI_API_KEY | Optional | Enables AI profile scanner |

5. **Project structure** (tree with one-line descriptions per file/folder)

6. **Contributing guide**: fork → branch → PR instructions

7. **License**: MIT
```

---

---

## Quick-start order

| Priority | Part | Est. time | Impact |
|---|---|---|---|
| 1 | Part 1 — Persistence | 30 min | 🔴 Critical |
| 2 | Part 2 — Gemini AI | 2 hours | 🔴 Critical |
| 3 | Part 3 — Device preview | 45 min | 🟡 High |
| 4 | Part 4 — Export upgrade | 1.5 hours | 🟡 High |
| 5 | Part 6 — Editor polish | 2 hours | 🟡 High |
| 6 | Part 5 — Sub-templates | 2 hours | 🟢 Medium |
| 7 | Part 8A/8B — New features | 3 hours | 🟢 Medium |
| 8 | Part 9 — SEO meta | 30 min | 🟢 Medium |
| 9 | Part 7 — Performance | 2 hours | 🟢 Low |
| 10 | Part 10 — Polish | 1 hour | 🟢 Low |

---

*Generated for FlowSite — May 2026*
