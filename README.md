# Whisperess (online ML powered Audio Transcription in your browser)

<!-- embed link to video here -->

## Overview

Whisperess is an innovative web application that transcribes audio in real-time using the OpenAI Whisper model. It offers a user-friendly interface for transcribing audio files and videos, making it a versatile tool for note-taking, transcription, and collaboration.

## Demo

<!-- ![Whisperess Demo](https://vimeo.com/1043243704?share=copy) -->

[![Whisperess Demo](https://img.youtube.com/vi/video-id/0.jpg)](https://player.vimeo.com/video/1043243704?h=0d3b85c71d)

<video src="https://player.vimeo.com/video/1043243704?h=0d3b85c71d" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></video>

<iframe src="https://player.vimeo.com/video/1043243704?h=0d3b85c71d" width="480" height="360" frameBorder="640" class="giphy-embed" allowFullScreen></iframe>
<iframe title="vimeo-player" src="https://player.vimeo.com/video/1043243704?h=0d3b85c71d" width="640" height="360" frameborder="0"    allowfullscreen></iframe>

## Features

- Real-time transcription of audio in your browser
- Transcription powered by OpenAI Whisper model Locally on your device (no data sent to the server)
- Versatile: supports both microphone and file input for videos and audio files (mp3, mp4, m4a, wav, webm)
- Customizable: adjust transcription settings and language
- User-friendly: intuitive interface for easy navigation and interaction
- Note taking: save transcripts and notes for future reference and collaboration
- Export: export transcripts and notes to various formats (Txt , JSON)
- Installable: install the app as PWA on any device for a seamless experience

Try the demo at [https://whisperess.vercel.app/](https://whisperess.vercel.app/)

This template should help get you started developing with Svelte and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Need an official Svelte framework?

Check out [SvelteKit](https://github.com/sveltejs/kit#readme), which is also powered by Vite. Deploy anywhere with its serverless-first approach and adapt to various platforms, with out of the box support for TypeScript, SCSS, and Less, and easily-added support for mdsvex, GraphQL, PostCSS, Tailwind CSS, and more.

## Technical considerations

**Why use this over SvelteKit?**

- It brings its own routing solution which might not be preferable for some users.
- It is first and foremost a framework that just happens to use Vite under the hood, not a Vite app.

This template contains as little as possible to get started with Vite + TypeScript + Svelte, while taking into account the developer experience with regards to HMR and intellisense. It demonstrates capabilities on par with the other `create-vite` templates and is a good starting point for beginners dipping their toes into a Vite + Svelte project.

Should you later need the extended capabilities and extensibility provided by SvelteKit, the template has been structured similarly to SvelteKit so that it is easy to migrate.

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `allowJs` in the TS template?**

While `allowJs: false` would indeed prevent the use of `.js` files in the project, it does not prevent the use of JavaScript syntax in `.svelte` files. In addition, it would force `checkJs: false`, bringing the worst of both worlds: not being able to guarantee the entire codebase is TypeScript, and also having worse typechecking for the existing JavaScript. In addition, there are valid use cases in which a mixed codebase may be relevant.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```ts
// store.ts
// An extremely simple external store
import { writable } from 'svelte/store';
export default writable(0);
```
