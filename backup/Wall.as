package org.dinosaurriders.swap {
	import flash.display.Sprite;
	
	public class Wall extends Sprite {
		public function Wall(x:Number, y:Number, width:Number, height:Number) {
			graphics.beginFill(0xff0000);
			graphics.drawRect(x, y, width, height);
			graphics.endFill();
		}
	}
}
