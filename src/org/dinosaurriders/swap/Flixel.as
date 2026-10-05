package org.dinosaurriders.swap {
	import org.flixel.FlxGame;

	[SWF(width="640", height="480", backgroundColor="#000000")]
	public class Flixel extends FlxGame {
		public function Flixel() {
			super(640, 480, Inicio, 1, 60, 30, true);
		}
	}
}
