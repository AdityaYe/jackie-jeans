<<<<<<< HEAD
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

=======
# Jackie Jeans – Smart Fit Onboarding

A premium, mobile-first onboarding experience built for the **Jackie Jeans Internship Hiring Challenge**. The application helps users discover their ideal jeans through an intelligent fit questionnaire, offering both a traditional guided form and a conversational AI voice experience.

---

## Overview

Buying jeans online often involves guesswork, inconsistent sizing, and frequent returns. This project focuses on improving that first experience by collecting meaningful fit preferences through a simple onboarding flow.

Users can choose between:

* Manual Quiz
* AI Voice Assistant

Both experiences collect the same information and guide users toward a personalized fit profile before redirecting them to the Jackie Jeans website.

---

## Features

### Manual Onboarding

* Mobile-first guided experience
* Five-step onboarding flow
* Progress tracking
* Back navigation
* Input validation
* Conditional brand sizing
* Weight unit conversion (lb / kg)
* Responsive design

### AI Voice Assistant

* Voice-to-voice interaction using the Web Speech API
* Automatic listening after each spoken question
* Text input fallback
* Conversational question flow
* Voice confirmation
* Review previous answers
* Edit answers before completion

### Premium UI

* Custom Jackie Jeans-inspired design
* Editorial typography using Montserrat
* Dark luxury-inspired theme
* Premium micro interactions
* Responsive layouts
* Brand logo selection cards
* Modern chip-based size selection

---

## Quiz Flow

The onboarding has been reorganized into five logical steps to create a faster and more natural experience.

### Step 1

* Height
* Weight
* lb / kg selector

### Step 2

* Waist Measurement
* Hip Measurement

### Step 3

* Preferred Waist Fit
* Preferred Rise
* Preferred Thigh Fit

### Step 4

* Previously Purchased Brands
* Size Selection for Each Selected Brand

### Step 5

* Biggest Fit Frustration

---

## Tech Stack

### Frontend

* React (JSX)
* Tailwind CSS

### Voice

* Web Speech API
* Speech Recognition
* Speech Synthesis

### Styling

* Custom Design System
* Responsive Layouts
* CSS Animations

---

## Project Structure

```text
public/
├── backgrounds/
├── brand-logos/
├── jj-bg.svg
├── jj-title.svg

src/
├── components/
├── data/
├── hooks/
├── pages/
├── styles/
├── utils/
└── App.jsx
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/jackie-jeans-onboarding.git
```

Navigate into the project:

```bash
cd jackie-jeans-onboarding
```

>>>>>>> 34fd5e470baa3806c772213de0775860d15d0a1e
Install dependencies:

```bash
npm install
```

<<<<<<< HEAD
Run locally:
=======
Start the development server:
>>>>>>> 34fd5e470baa3806c772213de0775860d15d0a1e

```bash
npm run dev
```

<<<<<<< HEAD
Build for production:
=======
---

## Production Build

Create a production build:
>>>>>>> 34fd5e470baa3806c772213de0775860d15d0a1e

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

<<<<<<< HEAD
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
=======
---

## Design Goals

The experience was designed around four core principles:

* Premium
* Conversational
* Mobile-first
* Minimal

Rather than feeling like a traditional questionnaire, the onboarding aims to resemble a conversation with a personal stylist.

---

## Accessibility

* Keyboard accessible navigation
* Voice and text input support
* Responsive layouts
* Clear focus states
* Readable color contrast
>>>>>>> 34fd5e470baa3806c772213de0775860d15d0a1e
