# English Through Movies 🎬

A mobile-first English learning app built with React + TypeScript + TailwindCSS.

## Features

- **Dashboard** — stats overview, My English Universe, weak words alert, recent vocab & watched content
- **Dictionary** — add/edit/delete vocabulary (Word, Phrase, Slang, Idiom), search & filter, status tracking
- **Review** — spaced repetition flashcards (Again/Hard/Good), weak words appear more often, auto-promote to Known
- **Movies & Series** — 5 movies + 3 series with level/genre filters, mark watched, take quizzes
- **Quiz System** — translation, phrase meaning, context questions; wrong answers auto-saved as Weak Words
- **Progress** — full stats, category breakdown, weak words list, recent quiz history
- All data persisted in **localStorage** — no backend needed

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18
- TypeScript 5
- TailwindCSS 3
- Vite 5
- Lucide React (icons)
- localStorage (persistence)
