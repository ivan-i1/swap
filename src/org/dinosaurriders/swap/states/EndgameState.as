package org.dinosaurriders.swap.states {
	import org.flixel.FlxSprite;
	import org.dinosaurriders.swap.Inicio;
	import org.flixel.FlxG;
	import org.flixel.FlxState;
	import org.flixel.FlxText;
	import org.flixel.FlxTimer;
	/**
	 * @author Mau
	 */
	public class EndgameState extends FlxState {
		private var timer : FlxTimer;
		
		override public function create() : void {
			super.create();
			
			var bg : FlxSprite = new FlxSprite(0, 0);
			bg.width = bg.height = 1000;
			bg.makeGraphic(1000, 1000, 0xff000000);
			add(bg);
			
			var text : FlxText = new FlxText(0, 300, FlxG.width, "Thank you for playing");
			text.setFormat(null, 21, 0xffffffff, "center");
			add(text);
			
			timer = new FlxTimer();			
			timer.start(5, 0, onFinishTimer);
		}

		private function onFinishTimer(t : FlxTimer) : void {
			timer.stop();
			FlxG.switchState(new Inicio());
		}
	}
}
