# table3d — the WebGL table

A real 3D table in the spirit of Tabletop Simulator, built on three.js with
react-three-fiber. It is the `'3d'` game layout (`use-game-layout.ts`) and
renders the whole Room in one scene: lobby, rounds, judging, result, podium.

Play it with no backend at `http://localhost:3210/demo` (bots; see
`src/app/demo/page.tsx` for the query params). Screenshot it with
`node scripts/shot3d.mjs` (usage in the file header).

## Layers

`table-3d.tsx` mounts one lazy chunk per layer, each behind an error boundary.
Layers **never import each other**. They share only:

- `useGame()` (`@/hooks/game`) — the game state, cursors and actions.
- `use-table.ts` — `useSeats()`, `useStage()`, `useHandSize()`, `useJudge()`.
- `space.ts` — the world's units, the table-space ↔ world mapping and every
  pose two layers must agree on (`heldHandSlot`, `playedPose`, `deckSpot`,
  `trophySpot`, `flatPose`).
- `store.ts` — `useTable3D` (hovered answer, cursor pin, dragging, camera view,
  mute) and the `fx` one-shot event bus.

| Layer | Entry (default export) | In Canvas | Owns |
|---|---|---|---|
| env | `scene/environment.tsx` | yes | room, table, lights, reflections |
| postfx | `scene/post-fx.tsx` | yes | post-processing |
| cards | `cards/cards-3d.tsx` | yes | every card: decks, Hands, played piles, answers, trophies |
| players | `players/players-3d.tsx` | yes | pawns, nameplates, 3D cursors, cursor broadcast, confetti |
| camera | `camera/camera-rig.tsx` | yes | the camera: seat view, orbit, zoom, cinematic moves |
| toys | `toys/toys-3d.tsx` | yes | physics toys (Rapier) |
| hud | `hud/hud.tsx` | no (DOM) | everything 2D over the scene |
| sound | `audio/sound.tsx` | no (DOM) | synthesized sound, driven by `fx` |

`?layers=env,cards` mounts only those layers.

## World

Y is up. The felt is the plane `y = 0`, centred on the origin. Table space (the
cursor space shared with the 2.5D layout and the backend, ADR-0006) maps as
`table (x, y) → world (x, 0, y)`: one world unit is one table radius. Seat 0
sits at table `(0, +1)`, i.e. world `+Z`.

Cards are modelled in local XY: face toward `+Z`, back toward `-Z`, top toward
`+Y`. A `CardPose` rotation is an Euler in `'YXZ'` order.

Seating (`useSeats`) uses the same order and colours as the 2.5D table. This
Player has no pawn: they are the camera.

## What the table shows (`useStage`)

| Stage | On the table |
|---|---|
| `lobby` | Pawns drop in as Players join; decks wait on the felt |
| `dealing` | Game started, first Round not here yet |
| `playing` | Black Card face up in the centre; others hold fanned Hands; a face-down pile appears in front of each Player who played |
| `judging` | Piles gather, shuffle and deal face up into the `layoutFeltCards` grid facing the Judge; the Judge lifts the answer under their cursor on every screen |
| `result` | The winning answer is celebrated; the Black Card flies to the winner's trophy pile. The next Round is already in `useGame()` underneath: don't show it yet |
| `finished` | Podium |

## Cross-layout compatibility

A Player on the 2.5D layout and one on the 3D layout share a Room. Cursors are
exchanged in table space, the judging grid is `layoutFeltCards` (same rects), and
a cursor's `card` is the Hand slot its owner hovers. Keep those three as they
are and the two layouts stay in sync.
