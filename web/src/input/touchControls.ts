// On-screen controls for phones and tablets: the game only knows keys, so each button holds a key in the
// shared latch for as long as a finger is on it. Buttons sit in the bars beside the 4:3 game on wide
// screens and float over it, translucent, on 4:3 tablets.
import { keys } from './keyLatch';

interface ButtonDef {
  key: string;
  label: string;
  side: 'left' | 'right';
  row: number; // 0 = bottom
  col: number; // 0 = outer edge
  small?: boolean;
}

const BUTTONS: ButtonDef[] = [
  { key: 'LEFT', label: '◀', side: 'left', row: 0, col: 0 },
  { key: 'RIGHT', label: '▶', side: 'left', row: 0, col: 1 },
  { key: 'R', label: '↻', side: 'left', row: 2, col: 0, small: true },
  { key: 'SPACE', label: 'JUMP', side: 'right', row: 0, col: 0 },
  { key: 'X', label: 'SWAP', side: 'right', row: 0, col: 1 },
  { key: 'S', label: 'SELECT', side: 'right', row: 1, col: 0 },
];

const CSS = `
#touch-controls { position: fixed; inset: 0; pointer-events: none; z-index: 10; display: none;
  font-family: nokiafc22, monospace; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
#touch-controls.visible { display: block; }
#touch-controls button { position: absolute; pointer-events: auto; touch-action: none;
  width: var(--size); height: var(--size); border-radius: 50%; border: 2px solid rgba(255,255,255,0.55);
  background: rgba(40, 20, 70, 0.45); color: #fff; font: inherit; font-size: 13px; line-height: 1; padding: 0;
  -webkit-tap-highlight-color: transparent; }
#touch-controls button.small { width: calc(var(--size) * 0.66); height: calc(var(--size) * 0.66); font-size: 20px; }
#touch-controls button.big-glyph { font-size: 26px; }
#touch-controls button.long { font-size: 10px; }
#touch-controls button.held { background: rgba(153, 68, 255, 0.75); border-color: #fff; }
`;

export function createTouchControls(doc: Document = document): { setVisible(v: boolean): void } {
  const style = doc.createElement('style');
  style.textContent = CSS;
  doc.head.appendChild(style);

  const root = doc.createElement('div');
  root.id = 'touch-controls';
  doc.body.appendChild(root);

  const size = 'clamp(56px, 11vmin, 84px)';
  root.style.setProperty('--size', size);
  const gap = '12px';

  for (const def of BUTTONS) {
    const b = doc.createElement('button');
    b.type = 'button';
    b.textContent = def.label;
    b.dataset.key = def.key;
    b.setAttribute('aria-label', def.key === 'R' ? 'Restart level' : def.label);
    if (def.small) b.classList.add('small');
    if (def.label.length === 1) b.classList.add('big-glyph');
    if (def.label.length > 4) b.classList.add('long');

    const inset = def.side === 'left' ? 'env(safe-area-inset-left)' : 'env(safe-area-inset-right)';
    b.style[def.side] = `calc(${inset} + ${gap} + ${def.col} * (var(--size) + ${gap}))`;
    b.style.bottom = `calc(env(safe-area-inset-bottom) + ${gap} + ${def.row} * (var(--size) + ${gap}))`;

    const release = () => {
      b.classList.remove('held');
      keys.up(def.key, 'touch');
    };
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      b.classList.add('held');
      keys.down(def.key, 'touch');
    });
    b.addEventListener('pointerup', release);
    b.addEventListener('pointercancel', release);
    b.addEventListener('lostpointercapture', release);
    b.addEventListener('contextmenu', (e) => e.preventDefault());
    root.appendChild(b);
  }

  return {
    setVisible(v: boolean) {
      // No releaseAll here: a level restart hides and re-shows the controls, and a held ▶ should survive it.
      // Hidden buttons lose pointer capture, which releases their keys anyway.
      root.classList.toggle('visible', v);
    },
  };
}

/** Phones and tablets get touch controls; desktops with a mouse do not. */
export function isTouchDevice(win: Window = window): boolean {
  return win.matchMedia('(pointer: coarse)').matches || win.navigator.maxTouchPoints > 0;
}

let controls: { setVisible(v: boolean): void } | null = null;

/** Show the on-screen controls (touch devices only) while a level is running. */
export function showTouchControls(visible: boolean): void {
  if (!visible && !controls) return;
  if (!controls) {
    if (!isTouchDevice()) return;
    controls = createTouchControls();
  }
  controls.setVisible(visible);
}
