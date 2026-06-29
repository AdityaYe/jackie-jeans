# Jackie Jeans Fit Quiz

Jackie Jeans Fit Quiz is a polished React onboarding experience for collecting denim fit preferences. It supports both a guided manual quiz and a voice-assisted flow, then sends the completed fit profile to the Jackie Jeans storefront.

## Features

- Premium landing experience with manual and voice onboarding paths
- 10-question fit profile covering measurements, fit preferences, denim brands, sizes, and fit frustrations
- Voice assistant flow with spoken prompts, automatic listening, typed fallback, answer validation, answer review, and editing
- Manual quiz flow with responsive grouped steps, progress tracking, brand selection, and per-brand size capture
- Completion summary with profile handoff through URL query parameters
- Responsive layout for mobile, tablet, and desktop
- Accessible buttons, visible focus states, alt text, and graceful voice fallback messaging

## Tech Stack

- React 19
- Vite 8
- Oxlint
- Web Speech API for voice recognition and speech synthesis
- Plain CSS with centralized design tokens

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint the project:

```bash
npm run lint
```

## Project Structure

```text
public/
  brand-logos/        Denim brand logo assets
  favicon.svg         Browser favicon
  jj-bg.svg           Landing background artwork
  jj-logo.svg         Jackie Jeans mark
  jj-title.svg        Jackie Jeans wordmark
src/
  components/         Shared UI components
  data/               Quiz questions, brand options, and flow configuration
  pages/              Landing, manual quiz, and voice quiz screens
  utils/              Fit profile formatting and query helpers
  App.jsx             App-level flow routing
  index.css           Global styles and design tokens
  main.jsx            React entry point
```

## Deployment

The app is configured for Vercel with `vercel.json`. Deploy the repository to Vercel and use the default Vite build command:

```bash
npm run build
```

The production output is generated in `dist/`.

## Screenshots

Add screenshots here before publishing:

- Landing page
- Manual quiz
- Voice assistant
- Completion summary

## Notes

Voice input depends on browser support for the Web Speech API. When recognition is unavailable or microphone access is denied, the voice flow remains usable through typed answers.
