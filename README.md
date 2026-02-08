# Staccato

A minimalist Rapid Serial Visual Presentation (RSVP) engine designed for deep comprehension and high-velocity reading.

Inspired by the precision of Monkeytype and the aesthetics of Material 3 Expressive, Staccato eliminates the physical strain of saccadic eye movements, allowing the mind to focus purely on the flow of information.

---

## Philosophy

Traditional reading is limited by the mechanics of the human eye. We spend more time navigating white space and jumping between words than we do processing meaning.

Staccato centers every word on its **Optimal Recognition Point (ORP)**. By anchoring your gaze to a single focal point, the application leverages your brain's natural ability to decode visual language at speeds impossible with conventional linear text.

## Features

### Precision Engine

- **Vertical Staccato**: 50ms vertical transitions powered by Framer Motion.
- **Anchor Highlighting**: Automatic ORP detection for instant word recognition.
- **Intelligent Pacing**: Algorithms that respect the weight of punctuation and the complexity of long-form vocabulary.

### Document Orchestration

- **Universal Extraction**: Native parsing for PDF, DOCX, and plain text files.
- **Condensation Mode**: Integrated extractive summarizer to distill long documents into their core essence.

### Experience Design

- **Inline Configuration**: Speed and settings are an organic extension of the reading room.
- **Fluid Motion**: Lenis-based smooth scrolling and scroll-reactive UI transitions.
- **Keyboard-First Interface**: Designed for a flow state, where every action is a single stroke away.

---

## Keyboard Reference

| Key     | Action                          |
| :------ | :------------------------------ |
| `Space` | Play or Pause the engine        |
| `R`     | Return to the beginning         |
| `U`     | Upload a new document           |
| `T`     | Open manual text input          |
| `I`     | View information panel          |
| `Esc`   | Toggle settings and speed panel |
| `← / →` | Adjust speed by 50 WPM          |

---

## Technical Architecture

The application is built on a modern, performance-oriented stack:

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **State**: Zustand
- **Scrolling**: Lenis
- **Parsing**: PDF.js & Mammoth.js

---

## Local Development

Ensure you have [Node.js](https://nodejs.org/) installed on your system.

```bash
# Clone the repository
git clone https://github.com/bonevane/staccato.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

_Designed for the modern reader. Built for speed._
