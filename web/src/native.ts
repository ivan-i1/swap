// Native-app glue (Capacitor). In a browser none of this runs.
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import type Phaser from 'phaser';
import { keys } from './input/keyLatch';

export function setupNative(game: Phaser.Game): void {
  if (!Capacitor.isNativePlatform()) return;

  // Android back: leave a level (or the end screen) for the title; on the title, close the app.
  App.addListener('backButton', () => {
    const active = game.scene.getScenes(true)[0];
    if (!active || active.scene.key === 'Title') void App.exitApp();
    else active.scene.start('Title');
  });

  // Phaser already pauses its loop and sound when the WebView is hidden; just make sure no
  // on-screen button stays held while the app is in the background.
  App.addListener('pause', () => keys.releaseAll());
}
