package org.dinosaurriders.swap {
	import flash.display.Sprite;
	
	public class Player extends Sprite {		
		public function Player(x:Number, y:Number, size:Number) {
			//graphics.beginBitmapFill(myBitmap);
			graphics.beginFill(0x0000ff);
			graphics.drawCircle(x, y, size);
			//graphics.drawRect(x, y, 100, 100);
			graphics.endFill();
		}
	}
}
