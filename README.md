# Jackie Jeans Fit Quiz

A premium, mobile-first onboarding experience built for the Jackie Jeans Internship Hiring Challenge. The application helps users find their ideal jeans fit through a guided manual quiz or an AI-powered voice assistant before redirecting them to the Jackie Jeans storefront.

## Features

* Manual onboarding with a responsive 5-step guided quiz
* AI voice assistant using the Web Speech API
* Automatic speech recognition with typed fallback
* Brand selection with per-brand size capture
* Progress tracking and answer review/editing
* Mobile-first responsive design
* Premium UI inspired by the Jackie Jeans design language

## Tech Stack

* React 19
* Vite 8
* Plain CSS
* Web Speech API
* Oxlint

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/jackie-jeans-fit-quiz.git
```

Navigate into the project:

```bash
cd jackie-jeans-fit-quiz
```

Install dependencies:

```bash
npm install
```

Run the development server:

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
├── brand-logos/
├── favicon.svg
├── jj-bg.svg
├── jj-logo.svg
└── jj-title.svg

src/
├── components/
├── data/
├── pages/
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

## Deployment

The project is ready to deploy using Vercel. The production build is generated in the `dist/` directory.

## Browser Support

Voice onboarding uses the Web Speech API. If speech recognition is unavailable or microphone access is denied, users can complete the onboarding using the built-in text input.
