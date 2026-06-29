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

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

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
