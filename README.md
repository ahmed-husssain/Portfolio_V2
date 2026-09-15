# Portfolio V2 — Full-Stack Developer Portfolio

> Modern, minimal, performance-focused personal developer portfolio built with React, TypeScript, Vite, and Tailwind CSS.

## ⚡ Overview

Portfolio V2 is built around an **editorial, content-first, technical design philosophy**:
- **80% Typography & Content**
- **15% Subtle Micro-Interactions**
- **5% Visual Accent & Surprise**
- **Zero Gimmicks** — No heavy 3D scenes, no WebGL, no particle backgrounds, no scroll hijacking.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (CSS Variables)
- **Icons**: Lucide React
- **Typography**: Inter (Sans) + JetBrains Mono (Monospace)
- **Theme**: Instant Dark & Light mode support with zero layout shift

## 🚀 Performance Metrics (Production Build)

- **Total Gzipped Payload**: ~81.8 kB (HTML + CSS + JS)
- **Lighthouse Performance**: Built for 95+ performance & accessibility
- **Responsive**: Tested across 375px, 768px, 1024px, and 1440px viewports

## 📂 Project Structure

```text
portfolio-v2/
├── index.html
├── src/
│   ├── components/       # Reusable primitives (Navbar, Button, Container, Card, etc.)
│   ├── sections/         # Composed page sections (Hero, ProjectPreview, etc.)
│   ├── lib/              # Theme provider & utility hooks
│   ├── data/             # Navigation and project data models
│   ├── styles/           # Design system tokens and base styles
│   ├── App.tsx           # Page shell
│   └── main.tsx          # Application root
└── package.json
```

## 💻 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📄 License

MIT © [Ahmed Hussain](https://github.com/ahmed-husssain)
