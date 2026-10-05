// FlxTimer + TimerManager: advanced once per game tick. Loops = 0 means forever (the game relies on that).
export class FlxTimer {
  private time = 0;
  private loops = 0;
  private counter = 0;
  private loopsCounter = 0;
  private callback: ((t: FlxTimer) => void) | null = null;
  finished = true;

  constructor(private manager: TimerManager) {}

  start(time = 1, loops = 1, callback: ((t: FlxTimer) => void) | null = null): this {
    this.manager.add(this);
    this.time = time;
    this.loops = loops;
    this.callback = callback;
    this.counter = 0;
    this.loopsCounter = 0;
    this.finished = false;
    return this;
  }

  stop(): void {
    this.finished = true;
    this.manager.remove(this);
  }

  update(elapsed: number): void {
    this.counter += elapsed;
    while (this.counter >= this.time && !this.finished) {
      this.counter -= this.time;
      this.loopsCounter++;
      this.callback?.(this);
      if (this.loops > 0 && this.loopsCounter >= this.loops) this.stop();
    }
  }
}

export class TimerManager {
  private timers: FlxTimer[] = [];

  create(): FlxTimer {
    return new FlxTimer(this);
  }

  add(t: FlxTimer): void {
    if (!this.timers.includes(t)) this.timers.push(t);
  }

  remove(t: FlxTimer): void {
    const i = this.timers.indexOf(t);
    if (i >= 0) this.timers.splice(i, 1);
  }

  update(elapsed: number): void {
    for (const t of [...this.timers]) t.update(elapsed);
  }
}
