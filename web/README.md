# Swap — Phaser 4 port

Browser port of the 2013 Flixel + Box2D game in `../src/org/dinosaurriders/swap` (beta V1.0): title screen,
levels 1–20 (there is no 13) and the end screen. The ActionScript project is untouched — levels, maps, images,
sounds and the Flixel font are read from it in place.

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the ported engine logic and the level parser
npm run build    # type-check + production build into dist/
```

Controls: **← →** move, **Space** jump, hold **S** to select a glowing object, **X** to swap places with it,
**R** to restart the level.

## How it is put together

| Original | Port |
|---|---|
| Flixel 2.5 player motion, `FlxObject.separate`, tilemap collision | `src/flixel/core.ts` (pure port, tested) |
| photonstorm `FlxControl` (walk/jump) | `src/flixel/control.ts` |
| Box2D AS3 2.1a | [planck.js](https://piqnt.com/planck.js/) — same engine lineage |
| `b2BuoyancyController`, `ComputeSubmergedArea` (not in planck) | `src/physics/` |
| DAME level classes `levels/Level_LevelN.as` | parsed at load time by `src/levels/parseLevel.ts` |
| `LevelContainer.as` | `src/game/LevelContainer.ts` — runs one Flixel frame per 60 Hz tick, in the original order |
| `objects/*.as`, `PhysicsUtil.as` | `src/game/objects/`, `src/game/physicsUtil.ts` |
| `Inicio.as`, `EndgameState.as` | `src/scenes/TitleScene.ts`, `src/scenes/EndgameScene.ts` |

The player is a Flixel object (arcade movement and tile/AABB collision) dragging a Box2D body along for
contacts; everything else is simulated by Box2D. The port keeps that split.

## Deliberate differences

- Physics changes the original made in the middle of a Box2D step (enabling exits, rotation locks) run right
  after the step instead; planck does not allow them mid-step. Same frame, same order.
- Planck re-winds polygons counter-clockwise, which would change the player's mass; the AS3 value (the foot
  sensor counts negative) is set explicitly so pushing, weight switches and crush deaths match.
- Glow and blur effects are Phaser 4 filters standing in for Flash `GlowFilter`/`BlurFilter`. The blur zone's
  ghost trail is drawn as fading copies under one blur filter rather than a re-blurred bitmap.
- `states/StartAnimation.as` (a Flash SWF movie) is not ported; the original never shows it either.

Quirks of the original are kept as-is: footstep sounds stack every frame while walking, music restarts on
every level load, `onlyPlayer` fields also affect objects, and the swap copies velocities between pixel and
metre units.
