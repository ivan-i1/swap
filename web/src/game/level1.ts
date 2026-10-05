// Level 1 as exported by DAME into levels/Level_Level1.as, rewritten as plain data.
import backCsv from '../../../assets/worlds/maps/mapCSV_Level1_BackLayer.csv?raw';
import playerCsv from '../../../assets/worlds/maps/mapCSV_Level1_PlayerLayer.csv?raw';
import frontCsv from '../../../assets/worlds/maps/mapCSV_Level1_FrontLayer.csv?raw';

export interface TileLayerDef {
  name: string;
  csv: string;
  tileset: 'spritesheet1' | 'spritesheet2';
  x: number;
  y: number;
  scroll: number;
  collides: boolean;
}

export const TILE_SIZE = 32;

// Draw order matches Level_Level1.masterLayer: back, player, front, then sprites.
export const layers: TileLayerDef[] = [
  { name: 'BackLayer', csv: backCsv, tileset: 'spritesheet2', x: 320, y: 0, scroll: 0.5, collides: false },
  { name: 'PlayerLayer', csv: playerCsv, tileset: 'spritesheet1', x: 640, y: 0, scroll: 1, collides: true },
  { name: 'FrontLayer', csv: frontCsv, tileset: 'spritesheet1', x: 640, y: 0, scroll: 1, collides: false },
];

export const playerSpawn = { x: 931, y: 88 };

// The single box on TriggerLayer, linked to the player with { kill: true }.
export const killTrigger = { x: 376, y: 506, width: 1249.524, height: 67.03 };

export const bgColor = '#000000';
