package org.dinosaurriders.swap.objects {
	import org.dinosaurriders.swap.Assets;
	import org.flixel.FlxSprite;
	/**
	 * @author Mau
	 */
	public class SwapAreaSprite extends FlxSprite {
		private var follow : FlxSprite;
		
		public function SwapAreaSprite(x : int, y : int, follow : FlxSprite) {
			super(x, y);
			loadGraphic(Assets.SwapArea, false, false, 64, 64);
			
			this.follow = follow;
		}

		override public function update() : void {
			super.update();
			
			x = follow.x - follow.width - 18;
			y = follow.y - follow.height / 2.0;
		}
	}
}
