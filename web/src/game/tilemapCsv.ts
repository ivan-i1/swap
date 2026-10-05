// DAME exports Flixel CSVs where 0 is an empty cell and N draws frame N of the tileset
// (FlxTilemap.loadMap with startingIndex 0, drawIndex 1). Phaser uses -1 for empty.
export function parseFlixelCsv(csv: string): number[][] {
  return csv
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => line.split(',').map((cell) => {
      const n = Number(cell);
      return n === 0 ? -1 : n;
    }));
}
