# Swap — Phaser 4 port

Browser port of the 2013 Flixel/ActionScript prototype in `../src/org/dinosaurriders/swap`.
Assets are imported in place from `../assets` and `../src/org/flixel/data`, so the AS3 project stays untouched.

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests for the ported game logic
npm run build    # type-check + production build into dist/
```

Controls: arrow keys to move, **X** for the jetpack (0.3s of fuel, refills after a 0.2s pause).

## What maps to what

| ActionScript | Phaser port |
|---|---|
| `Flixel.as` (800×600, 60Hz) | `src/main.ts` (arcade physics on a fixed 60Hz step) |
| `Inicio.as` | `src/scenes/TitleScene.ts` |
| `LevelLoader.as` | `src/scenes/LevelScene.ts` |
| `levels/Level_Level1.as` (DAME export) | `src/game/level1.ts` (plain data) |
| `objects/Player.as` input/energy/animation | `src/game/playerControl.ts` |
| `FlxCamera.STYLE_PLATFORMER` | `src/game/camera.ts` |
| DAME CSV (0 = empty) | `src/game/tilemapCsv.ts` (→ Phaser's -1 = empty) |

## Known behaviour carried over from the original

- Dying (falling into the kill box under the map) only removes the player; there is no respawn or game-over yet.
- Leaving the map to the left fast enough misses the kill box (it starts at x=376), and the player falls forever.
- `backup/` (the Box2D experiment) and the unused `claws.png`, `player.png`, `spritesheet3.png` were not ported.
