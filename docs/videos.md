# Calculator videos

One narrated explainer per calculator in two formats: 16:9 (1920×1080, the page embed) and plain 9:16 (1080×1920, for TikTok/Reels/Shorts; centered, deliberately not the `tiktok` preset, which shifts content to dodge app buttons), built with [explainroo](https://github.com/vincentsch/explainroo) (local Kokoro voice, Whisper timing, Chrome frames, ffmpeg).

## Layout

- `videos/languages.json` language registry: `voice`, `status` (`ready` builds, `planned` is skipped), `captionsOnly` for languages Kokoro has no voice for (de, nl).
- `videos/<calculator-id>/video.json` look, size, pace; shared by all languages.
- `videos/<calculator-id>/scenes.js` language-neutral drawing. Cue on `[#markers]`, never spoken words, and read every on-screen string from `./strings.js`. Position with the `kit(s)` helpers from `videos/_shared/layout.js` (staged as `./layout.js`) so one file serves both ratios; tall content must stay above `s.safe.bottom` (the caption band).
- `videos/<calculator-id>/script.<lang>.md` narration; `strings.<lang>.json` on-screen text (`title` is required).
- Output: `apps/web/public/videos/<id>/<lang>.mp4` and `<lang>.9x16.mp4` (`--format wide|tall` builds one) (git-ignored). `LessonVideo.astro` embeds whatever exists above the lesson, with a language picker when there are several.

## Build

One-time: `git clone https://github.com/vincentsch/explainroo ../tools/explainroo && cd ../tools/explainroo && npm install && node bin/explainroo.js doctor --fetch` (or set `EXPLAINROO_DIR`).

`bun scripts/build-videos.ts [calculator] [--lang en] [--draft] [--dry]`, then `bun run build:web`. The build runs `check`, `render` and `verify`. explainroo exits non-zero from an onnxruntime teardown abort after success; the script tolerates only that message.

## Adding a language

1. Set its `status` to `ready` in `languages.json`.
2. Translate `script.en.md` and `strings.en.json` to `script.<lang>.md` and `strings.<lang>.json`. Keep scene ids and `[#markers]` unchanged; spell numbers as words for the voice.
3. Local voices only speak English today: explainroo uses `kokoro-js` (English phonemizer) and `whisper-base.en`. Other Kokoro languages need an espeak-ng phonemizer path and multilingual Whisper (not built yet). de/nl need captions on an English voice or a cloud TTS.

## Adding a calculator video

Copy `videos/percentage/`, rewrite the four files, and verify numbers against the calculator engine and lesson examples. Run `check`, look at `explainroo sheet`, then build.
