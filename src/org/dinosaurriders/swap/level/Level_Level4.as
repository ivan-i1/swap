//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level4 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level4_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level4_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level4_PlayerLayer.csv", mimeType="application/octet-stream")] public var CSV_PlayerLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_PlayerLayer:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level4_FrontLayer.csv", mimeType="application/octet-stream")] public var CSV_FrontLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_FrontLayer:Class;

		//Tilemaps
		public var layerSky:FlxTilemap;
		public var layerBackground:FlxTilemap;
		public var layerPlayerLayer:FlxTilemap;
		public var layerFrontLayer:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level4(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 0.000, -32.000, 32, 32, 0.250, 0.250, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerBackground = addTilemap( CSV_Background, Img_Background, 0.000, -32.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerPlayerLayer = addTilemap( CSV_PlayerLayer, Img_PlayerLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerFrontLayer = addTilemap( CSV_FrontLayer, Img_FrontLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerBackground);
			masterLayer.add(layerPlayerLayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFrontLayer);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = -32;
			boundsMaxX = 640;
			boundsMaxY = 480;
			boundsMin = new FlxPoint(0, -32);
			boundsMax = new FlxPoint(640, 480);
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
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 383.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			linkedObjectDictionary[7] = addSpriteToLayer(new Exit(606.000, 224.000, Assets.Exit), Exit, SpritesGroup , 606.000, 224.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level5" }, { name:"enabled", value:false }, null ), onAddCallback );//"Exit"
			addSpriteToLayer(new BreakableWall(480.000, 320.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 480.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			linkedObjectDictionary[6] = addSpriteToLayer(new WeightSwitch(570.000, 408.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 570.000, 408.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			addSpriteToLayer(new PolygonBody(150.000, 352.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 150.000, 352.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
			addSpriteToLayer(new PolygonBody(300.000, 384.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 300.000, 384.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
			createLink(linkedObjectDictionary[6], linkedObjectDictionary[7], onAddCallback, generateProperties( { name:"onActivate", value:"ENABLE" }, null ) );
		}

	}
}
