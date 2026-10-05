package org.dinosaurriders.swap.objects {
	import org.dinosaurriders.swap.Settings;
	import org.dinosaurriders.swap.levels.TextData;
	import org.flixel.FlxG;
	import org.flixel.FlxSprite;
	import org.flixel.FlxText;
	import org.flixel.FlxTimer;
	/**
	 * @author Mau
	 */
	public class TextObject extends FlxText {
		private var t : FlxTimer;
		private var backgroundBox : FlxSprite;
		private var onKillCallback : Function;
		
		public function TextObject(textData : TextData) {
			super(textData.x, textData.y, textData.width, textData.text);
			super.font = textData.fontName;
			super.color = textData.color;
			super.size = textData.size;
			
			backgroundBox = new FlxSprite(0, y - 15);
			backgroundBox.width = FlxG.width;
			backgroundBox.height = 50;
			backgroundBox.scrollFactor.x = backgroundBox.scrollFactor.y = 0;
			backgroundBox.alpha = 0.75;
			backgroundBox.makeGraphic(800, 50, 0xffffffff - color);
			backgroundBox.solid = false;
			backgroundBox.visible = true;
			
			scrollFactor.x = scrollFactor.y = 0;
		}
		
		public function show() : void {
			if (t == null) {
				FlxG.state.add(backgroundBox);
				FlxG.state.add(this);
				t = new FlxTimer();
				t.start(Settings.TEXTDURATION, 0, removeText);
			}
		}
		
		private function removeText(t : FlxTimer) : void {
			kill();
		}
		
		public function setOnKillCallback(callback : Function) : void {
			onKillCallback = callback;
		}

		override public function kill() : void {
			if (t != null) {
				t.stop();
			}
			
			if (onKillCallback != null) {
				onKillCallback();
			}
			
			backgroundBox.kill();
			super.kill();
		}
	}
}
