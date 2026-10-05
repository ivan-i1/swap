package org.dinosaurriders.swap {
	import org.flixel.FlxButton;
	import org.flixel.FlxG;
	import org.flixel.FlxSprite;
	import org.flixel.FlxState;
	import org.flixel.FlxText;
	/**
	 * @author ieiomeli
	 */
	
	
	public class Inicio extends FlxState{
		private var texto:FlxText;
		
		public function Inicio()
        {
            super();
        }
		
		override public function create():void
        {
            var s:FlxSprite = new FlxSprite();
			s.loadGraphic(Assets.SplashScreen);
            add(s);
			
 			texto = new FlxText(0, 30, FlxG.width, "SWAP").setFormat(null, 21, 0x9944ff, "center");
         
          	add(texto);
		   	var botonInicio:FlxButton =  new FlxButton(FlxG.width / 2 - 40, FlxG.height / 2 - 60, "Start Game!", iniciar);
			add(botonInicio);
		}

		private function iniciar() : void {
			FlxG.switchState(new LevelContainer("Level1"));
		}
	}
}
