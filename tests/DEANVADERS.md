# Deanvaders preview

A small original arcade game at `/play` and in a window on the homepage.

- Canvas simulation is separate from React UI; it runs only during active play.
- Arrow keys / A-D move, Space fires, P/Escape pause. Pointer-drag moves and fires. Visible controls support pointer and keyboard input.
- The game pauses on hidden tab, window blur, leaving the game, and scrolling fully out of view. Input is reset on focus changes.
- Sound starts off, is synthesized locally, and only initializes after an explicit toggle. Calm FX follows reduced-motion preference and can be toggled.
- High score is stored locally with optional storage handling; there are no new APIs, trackers, accounts, dependencies, or data uploads.
- Four original illustrated distraction sprites: email, bill, video meeting, and task ticket. Coffee drops every sixth cleared distraction for eight seconds of faster spread shots. Wave clear awards 500 points.
- Dean's head art was generated from the portrait Dean supplied specifically for this game. All other visual/audio assets are original code; no Galaga, Space Invaders, Zoom, or Atlassian game/logo assets are used.

## Checks

`node tests/deanvaders.test.cjs` runs simulation checks using the existing TypeScript compiler.
`npm run build` checks the Next.js production build and types.

Manual browser checklist: start; movement; firing/scoring; coffee; pause/resume; blur; game-over/restart; sound off/on; reduced effects; narrow mobile layout; no overflow; unchanged site navigation.

Preview only. Do not merge or promote to production until Dean has tried it and approved.

## Rising-tension update

- Every wave increases movement speed, descent, fire rate and bullet speed on a smooth bounded curve. The remaining invaders speed up as the formation thins. No sudden extra health, unavoidable spread shots, or changed controls.
- Music is an original four-note square-wave bass pulse with a low-pass filter. It speeds up with the wave, fewer remaining enemies and their approach. Its peak gain is .009 vs .035 for effects; effects also duck music to 32% briefly.
- Sound still starts off. Sound controls everything; Music can be switched off independently to keep just effects. Music rests between waves and on pause/game-over. No background scheduler, external audio files or added dependencies.
- `node --test tests/deanvaders*.test.cjs` runs all simulation, progression, audio scheduling/mixing/muting/lifecycle checks (the original 12 checks plus 19 named tests).
