package org.dinosaurriders.swap.objects {
	import org.dinosaurriders.swap.Settings;
	import org.flixel.FlxSprite;
	import org.flixel.FlxTimer;
	/**
	 * @author Mau
	 */
	public class Rubble extends FlxSprite {
		private var t1 : FlxTimer;
		private var t2 : FlxTimer;
		
		public function Rubble(x : int, y : int, image : Class) {
			super(x, y);
			
			loadGraphic(image);
			
			velocity.x = Math.random() * 100 - 50;
			velocity.y = Math.random() * 100 - 50;
			
			acceleration.y = 10 * Settings.ratio;	
			
			t1 = new FlxTimer();
			t2 = new FlxTimer();
			t1.start(0.5, 0, onFlickerTimer);
			t2.start(1, 0, onFinishTimer);
		}
		
		private function onFlickerTimer(obj : FlxTimer) : void {
			flicker();
		}
		
		private function onFinishTimer(obj : FlxTimer) : void {
			kill();
		}
	}
}