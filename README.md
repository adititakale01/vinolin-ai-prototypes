# 🍷 Vinolin AI Prototypes Suite

> **A Next.js 14 Full-Stack showcase demonstrating RAG (Retrieval-Augmented Generation) and Computer Vision capabilities tailored for the Digital Wine Industry.**

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue) ![Status](https://img.shields.io/badge/Status-Prototype-green)

## Project Overview
I built this application to demonstrate how **Vinolin** can leverage Generative AI to solve two specific B2B challenges:
1.  **Trustworthy Consultation:** A chatbot that strictly adheres to a partner's inventory (no hallucinations).
2.  **Inventory Digitization:** Converting physical bottle labels into structured database entries.

## Key Modules

### 1. The Digital Cellar (B2B RAG Agent)
A conversational interface designed for winery websites.
*   **Feature:** Simulates a RAG (Retrieval-Augmented Generation) pipeline.
*   **Guardrails:** The AI is instructed to *only* recommend wines from a specific "Partner Catalog," strictly rejecting off-topic queries or hallucinated products.
*   **Tech:** Next.js App Router, React Server Components, Streaming UI.

### 2. LabelLens (Multimodal Inventory Tool)
A mobile-first computer vision utility.
*   **Feature:** Mimics the scanning of a wine bottle to extract metadata (Vintage, Region, Grape).
*   **Output:** Returns structured JSON data validated via **Zod schemas**, ready for database insertion.
*   **Tech:** Server Actions, Computer Vision Simulation.

---

## Technical Decisions

### Why "Demo Mode"?
To ensure a **zero-latency, 100% reliable experience** for the review team, this specific deployment utilizes **Mocked Streaming Responses** in the backend.

Instead of relying on live external API keys (which can rate-limit or fail regionally), I engineered the backend to simulate the exact behavior of an LLM (latency, token streaming, structured output) using native **JavaScript Web Streams** and `setTimeout` simulation.

**This ensures the application works immediately after cloning, with no environment variables required.**

---

## Dependencies & Stack
This project was initialized with `create-next-app` and uses the following core libraries:

*   **Framework:** `next` (v14+ App Router)
*   **Styling:** `tailwindcss`, `clsx`, `tailwind-merge`
*   **Icons:** `lucide-react`
*   **AI Simulation:** `ai` (Vercel AI SDK patterns)
*   **Validation:** `zod`

## 💻 Getting Started

You can run this project locally in less than 2 minutes. No API keys needed.

### 1. Clone the repository
```bash
git clone https://github.com/adititakale01/vinolin-ai-prototypes.git
cd vinolin-ai-prototypes
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```bash
├── app/
│   ├── api/chat/route.ts    # Streaming API (Mocked RAG Logic)
│   ├── actions.ts           # Server Actions (Mocked Vision Logic)
│   ├── page.tsx             # Main UI (Client Components)
│   └── layout.tsx           # Root Layout
├── components/              # Shared UI components
├── public/                  # Static assets
└── tailwind.config.ts       # Design system config
```

---

*Built by Aditi for Vinolin.*
