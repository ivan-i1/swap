// Physical keyboard → shared key latch. Registered once on the window so keys held across a level
// restart (scenes recreate their own keyboard plugins) cannot get stuck.
import { keys } from './keyLatch';

const CODES: Record<string, string> = {
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  Space: 'SPACE',
  KeyX: 'X',
  KeyS: 'S',
  KeyR: 'R',
};

export function listenToKeyboard(target: Window = window): void {
  target.addEventListener('keydown', (e) => {
    const name = CODES[e.code];
    if (!name) return;
    e.preventDefault();
    keys.down(name, 'keyboard');
  });
  target.addEventListener('keyup', (e) => {
    const name = CODES[e.code];
    if (!name) return;
    e.preventDefault();
    keys.up(name, 'keyboard');
  });
  target.addEventListener('blur', () => keys.releaseAll());
  target.document.addEventListener('visibilitychange', () => {
    if (target.document.hidden) keys.releaseAll();
  });
}
