import { describe, expect, it } from 'vitest';
import { PhysicsUtil } from '../src/game/physicsUtil';

function body(name: string, log: string[]) {
  return {
    name,
    _enabled: true,
    get enabled() { return this._enabled; },
    set enabled(v: boolean) { this._enabled = v; log.push(`${name}.enabled=${v}`); },
    swap(other: { name: string }) { log.push(`${name}.swap(${other.name})`); },
  };
}

describe('PhysicsUtil swap queue (called before and after each world step)', () => {
  it('disables both bodies for one step, then re-enables them and lets the player swap', () => {
    const log: string[] = [];
    const util = new PhysicsUtil();
    const rock = body('rock', log);
    const player = body('player', log);

    util.enqueueSwap(rock, player); // order as in Player.update: (target, player)
    util.callSwaps(); // before the step
    expect(log).toEqual(['rock.enabled=false', 'player.enabled=false']);

    util.callSwaps(); // after the step
    expect(log.slice(2)).toEqual([
      'rock.enabled=false', 'player.enabled=false', // first statement of the second pass, as in AS3
      'rock.enabled=true', 'player.enabled=true',
      'player.swap(rock)',
    ]);

    log.length = 0;
    util.callSwaps();
    expect(log).toEqual([]);
  });
});

describe('PhysicsUtil.enqueueText', () => {
  it('shows a text once and kills the previous one if it is still up', () => {
    const util = new PhysicsUtil();
    const make = () => ({ alive: true, shown: 0, killed: 0, show() { this.shown++; }, kill() { this.killed++; this.alive = false; } });
    const a = make();
    const b = make();
    util.enqueueText(a);
    util.enqueueText(a);
    expect(a.shown).toBe(1);
    util.enqueueText(b);
    expect(a.killed).toBe(1);
    expect(b.shown).toBe(1);
  });
});
