<div align="center">
  <h1>IELTSly</h1>
  <p>An AI-powered IELTS Writing preparation platform that helps you practice, get evaluated, and track your progress toward your target band score.</p>

  <p>
    <a href="https://ieltsly.netlify.app">Live App</a>
    ·
    <a href="https://github.com/Jeremi-code/IELTSly/issues/new?labels=bug">Report a Bug</a>
    ·
    <a href="https://github.com/Jeremi-code/IELTSly/issues/new?labels=enhancement">Request a Feature</a>
  </p>
</div>

---

## Overview

IELTSly is a full-stack IELTS Writing practice platform built for serious test-takers. It provides a realistic exam environment, AI-driven scoring using official IELTS band descriptors, and detailed analytics to identify your weak areas over time.

The platform is fully **BYOK (Bring Your Own Key)** — you connect your own Gemini or OpenAI API key, which is encrypted server-side with AES-256-GCM before storage.

---

## Features

- **Essay Simulator** — Practice Task 1 and Task 2 essays in timed exam mode or free practice mode
- **AI Evaluation** — Instant band scores and feedback across all four IELTS criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy
- **Question Bank** — Browse and filter real IELTS Writing prompts by task type and category
- **Band Calculator** — Log external mock test scores and compute your official overall IELTS band using the standard rounding formula
- **Progress Analytics** — Track average bands, writing velocity, and performance trends over time
- **Secure AI Key Storage** — API keys are encrypted server-side and never exposed in plain text

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Tweakcn |
| Animations | Framer Motion |
| Auth | Better Auth |
| UI | shadcn/ui, Lucide React |
| Backend | [IELTSly-API](https://github.com/Jeremi-code/IELTSly-API) |

---

## Local Development

### Prerequisites

- Node.js ≥ 20
- pnpm
- [IELTSly-API](https://github.com/Jeremi-code/IELTSly-API) running locally

### Setup

```bash
git clone https://github.com/Jeremi-code/IELTSly.git
cd IELTSly
pnpm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. **Report a bug** → [Open an issue](https://github.com/Jeremi-code/IELTSly/issues/new?labels=bug) and describe the problem, steps to reproduce, and expected behavior.
2. **Request a feature** → [Open an issue](https://github.com/Jeremi-code/IELTSly/issues/new?labels=enhancement) with a clear description of what you'd like and why.
3. **Submit a pull request** → Fork the repo, create a branch (`git checkout -b feature/your-feature`), make your changes, and open a PR against `main`.

Please ensure your code follows the existing style and passes type checks (`pnpm tsc --noEmit`) before submitting.

---

## Related

- **[IELTSly-API](https://github.com/Jeremi-code/IELTSly-API)** — Express + MongoDB backend

---

## License

[MIT](LICENSE)
