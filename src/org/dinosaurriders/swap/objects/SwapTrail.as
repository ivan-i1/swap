package org.dinosaurriders.swap.objects {
	import org.dinosaurriders.swap.Assets;
	import org.flixel.FlxSprite;
	import org.flixel.FlxTimer;
	/**
	 * @author Mau
	 */
	public class SwapTrail extends FlxSprite {
		private var t : FlxTimer, t2 : FlxTimer;
		
		public function SwapTrail(x : int, y : int) {
			super(x, y);
			
			loadGraphic(Assets.SwapTrail, true, false, 64, 64);
			solid = false;
			
			addAnimation("play", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 12);
			play("play");
			
			t = new FlxTimer();
			t.start(1, 0, onFinish);
			t2 = new FlxTimer();
			t.start(0.16, 12, onAlphaChange);
		}
		
		private function onAlphaChange(t : FlxTimer) : void {
			alpha -= 0.1;
		}
		
		private function onFinish(t : FlxTimer) : void {
			kill();
		}
	}
}
