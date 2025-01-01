# Whisperess 🎙️

## open source 🌟

###### online ML powered Audio Transcription in your browser 🎧

## Overview 📝

Whisperess is an innovative web application that transcribes audio in real-time using the OpenAI Whisper model. It offers a user-friendly interface for transcribing audio files and videos, making it a versatile tool for note-taking, transcription, and collaboration.

## Demo 🎥

Try the Live demo at [https://whisperess.vercel.app/](https://whisperess.vercel.app/)

or watch the demo video below:
[![Whisperess Demo](/public/screenshots/screen-sm-4.png)](https://player.vimeo.com/video/1043243704?h=0d3b85c71d)

## Features ✨

- 🎤 Real-time transcription of audio in your browser
- 🧠 Transcription powered by OpenAI Whisper model Locally on your device (no data sent to the server)
- 📁 Versatile: supports both microphone and file input for videos and audio files (mp3, mp4, m4a, wav, webm)
- ⚙️ Customizable: adjust transcription settings and language
- 🎯 User-friendly: intuitive interface for easy navigation and interaction
- 📝 Note taking: save transcripts and notes for future reference and collaboration
- 💾 Export: export transcripts and notes to various formats (Txt , JSON)
- 📱 Installable: install the app as PWA on any device for a seamless experience

## Development Setup 🛠️

This project uses Svelte with TypeScript and Vite for development.

## Recommended IDE Setup 💻

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Technical Details 🔧

This is a Vite + Svelte + TypeScript project that provides:

- 🔥 Hot Module Replacement (HMR)
- 📚 TypeScript support
- ⚡ Lightning-fast development experience
- 🎨 Svelte components with TypeScript

**Why use Vite + Svelte?**

- 🚀 Extremely fast development server
- 📦 Optimized build output
- 🔌 Rich plugin ecosystem
- 🛠️ Simple and straightforward configuration

**TypeScript Configuration Notes** 📘

The project uses `global.d.ts` for TypeScript configuration to maintain flexibility in type checking while providing proper Svelte and Vite type support.

**HMR State Management** 💾

For state management that persists through HMR updates, consider using Svelte stores:

```ts
// store.ts
// An extremely simple external store

import { writable } from 'svelte/store';
export default writable(0);
```
