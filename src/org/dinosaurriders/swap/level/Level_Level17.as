//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level17 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Clouds.csv", mimeType="application/octet-stream")] public var CSV_Clouds:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Clouds:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Back.csv", mimeType="application/octet-stream")] public var CSV_Back:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Back:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level17_Front.csv", mimeType="application/octet-stream")] public var CSV_Front:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Front:Class;

		//Tilemaps
		public var layerSky:FlxTilemap;
		public var layerClouds:FlxTilemap;
		public var layerBackground:FlxTilemap;
		public var layerBack:FlxTilemap;
		public var layerPlayer:FlxTilemap;
		public var layerFront:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level17(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 0.000, 0.000, 32, 32, 0.000, 0.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerClouds = addTilemap( CSV_Clouds, Img_Clouds, -32.000, -64.000, 32, 32, 0.300, 0.300, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerBackground = addTilemap( CSV_Background, Img_Background, 0.000, 0.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerBack = addTilemap( CSV_Back, Img_Back, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[1]=generateProperties( { name:"affectsplayer", value:false }, null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[61]=generateProperties( { name:"outerglow", value:65280 }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerPlayer = addTilemap( CSV_Player, Img_Player, 0.000, 0.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerFront = addTilemap( CSV_Front, Img_Front, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerClouds);
			masterLayer.add(layerBackground);
			masterLayer.add(layerBack);
			masterLayer.add(layerPlayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFront);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = 0;
			boundsMaxX = 960;
			boundsMaxY = 512;
			boundsMin = new FlxPoint(0, 0);
			boundsMax = new FlxPoint(960, 512);
			bgColor = 0xff88beef;
		}

		override public function createObjects(onAddCallback:Function = null, parentObject:Object = null):void
		{
			addSpritesForLayerSprites(onAddCallback);
			generateObjectLinks(onAddCallback);
			if ( parentObject != null )
				parentObject.add(masterLayer);
			else
				FlxG.state.add(masterLayer);
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 240.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(913.000, 416.000, Assets.Exit), Exit, SpritesGroup , 913.000, 416.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level18" }, null ), onAddCallback );//"Exit"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
