// Port of FlxCamera's STYLE_PLATFORMER follow. Phaser's own deadzone is always centred,
// whereas Flixel's sits a quarter of its height above centre, so we drive scroll ourselves.

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function platformerDeadzone(viewWidth: number, viewHeight: number): Rect {
  const w = viewWidth / 8;
  const h = viewHeight / 3;
  return { x: (viewWidth - w) / 2, y: (viewHeight - h) / 2 - h * 0.25, width: w, height: h };
}

export function followDeadzone(
  scroll: { x: number; y: number },
  target: Rect,
  deadzone: Rect,
): { x: number; y: number } {
  let { x, y } = scroll;

  let edge = target.x - deadzone.x;
  if (x > edge) x = edge;
  edge = target.x + target.width - deadzone.x - deadzone.width;
  if (x < edge) x = edge;

  edge = target.y - deadzone.y;
  if (y > edge) y = edge;
  edge = target.y + target.height - deadzone.y - deadzone.height;
  if (y < edge) y = edge;

  return { x, y };
}

// FlxCamera.update: after following, keep the view inside setBounds() (left/top checked before right/bottom).
export function clampToBounds(
  scroll: { x: number; y: number },
  bounds: Rect,
  viewWidth: number,
  viewHeight: number,
): { x: number; y: number } {
  let { x, y } = scroll;
  if (x < bounds.x) x = bounds.x;
  if (x > bounds.x + bounds.width - viewWidth) x = bounds.x + bounds.width - viewWidth;
  if (y < bounds.y) y = bounds.y;
  if (y > bounds.y + bounds.height - viewHeight) y = bounds.y + bounds.height - viewHeight;
  return { x, y };
}
