// PhysicsUtil.as: deferred body destruction, the two-pass swap queue, buoyancy controllers and the hint text slot.
// The AS3 version is all static; here there is one per running level.
import type { Body, World } from 'planck';
import type { BuoyancyController } from '../physics/buoyancy';
import { Settings } from './settings';

export interface Swappable {
  enabled: boolean;
  // Only the player implements swap(); it is always the second body enqueued.
  swap?(other: never): void;
}

export interface ShowableText {
  alive: boolean;
  kill(): void;
  show(): void;
}

export class PhysicsUtil {
  private destroyQueue: Body[] = [];
  private swapQueue: Swappable[] = [];
  private rotationQueue: [Body, number][] = [];
  private buoyancyControllers: BuoyancyController[] = [];
  private currentText: ShowableText | null = null;
  private currentSkipCount = 0;

  destroyPhysicObjects(world: World): void {
    while (this.destroyQueue.length > 0) world.destroyBody(this.destroyQueue.pop()!);
  }

  enqueueRotation(body: Body, angle: number): void {
    this.rotationQueue.push([body, angle]);
  }

  callRotation(): void {
    while (this.rotationQueue.length > 0) {
      const [body, angle] = this.rotationQueue.pop()!;
      body.setAngle(angle);
    }
  }

  enqueueDeletedBody(body: Body): void {
    if (!this.destroyQueue.includes(body)) this.destroyQueue.push(body);
  }

  // Order matters: (target, player) so that the player's swap() is the one that runs.
  enqueueSwap(body1: Swappable, body2: Swappable): void {
    this.swapQueue.push(body1, body2);
    this.currentSkipCount = 0;
  }

  // Called twice per frame (before and after the world step). The first call disables both bodies for
  // the step, the second (SWAPSKIPCOUNT reached) re-enables them and performs the swap.
  callSwaps(): void {
    if (this.swapQueue.length > 0) {
      this.currentSkipCount++;
      this.swapQueue[0].enabled = false;
      this.swapQueue[1].enabled = false;
    }
    if (this.currentSkipCount === Settings.SWAPSKIPCOUNT) {
      while (this.swapQueue.length > 0) {
        this.swapQueue[0].enabled = true;
        this.swapQueue[1].enabled = true;
        const a = this.swapQueue.pop()!;
        const b = this.swapQueue.pop()!;
        (a.swap as (other: Swappable) => void).call(a, b);
      }
      this.currentSkipCount = 0;
    }
  }

  update(world: World): void {
    this.callSwaps();
    this.destroyPhysicObjects(world);
    this.callRotation();
    this.updateControllers();
  }

  addBuoyancyController(controller: BuoyancyController): void {
    this.buoyancyControllers.push(controller);
  }

  // Each controller is also registered with the AS3 world, whose Step() runs it again,
  // so the original applies buoyancy twice per frame. The caller runs this once more before stepping.
  updateControllers(): void {
    for (const c of this.buoyancyControllers) c.step();
  }

  enqueueText(t: ShowableText): void {
    if (this.currentText !== t) {
      if (this.currentText && this.currentText.alive) this.currentText.kill();
      this.currentText = t;
      t.show();
    }
  }
}
