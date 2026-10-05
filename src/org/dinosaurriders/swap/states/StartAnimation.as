package org.dinosaurriders.swap.states {
	import org.dinosaurriders.swap.Assets;
	import org.dinosaurriders.swap.Inicio;
	import org.flixel.FlxG;
	import org.flixel.FlxState;

	import flash.display.MovieClip;
	import flash.events.Event;

	/**
	 * @author Mau
	 */
	public class StartAnimation extends FlxState {
		private var noFrames : Number = 23;
		private var animation : MovieClip;
		private var prevFramerate : Number;

		override public function create() : void {
			animation = new Assets.StartAnimation();
			FlxG.stage.addChildAt(animation, 1);
			animation.addEventListener(Event.EXIT_FRAME, onExitFrame);
			prevFramerate = FlxG.framerate;
			FlxG.framerate = 8;
		}

		private function onExitFrame(e : Event) : void {
			noFrames--;
			if (noFrames <= 0) {
				FlxG.stage.removeChildAt(1);
				FlxG.framerate = prevFramerate;
				FlxG.switchState(new Inicio());
				animation.removeEventListener(Event.EXIT_FRAME, onExitFrame);
				this.kill();
			}
		}
	}
}
