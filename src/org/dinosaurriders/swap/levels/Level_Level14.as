//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level14 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level14_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level14_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level14_BackLayer.csv", mimeType="application/octet-stream")] public var CSV_BackLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_BackLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level14_PlayerLayer.csv", mimeType="application/octet-stream")] public var CSV_PlayerLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_PlayerLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level14_FrontLayer.csv", mimeType="application/octet-stream")] public var CSV_FrontLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_FrontLayer:Class;

		//Tilemaps
		public var layerSky:FlxTilemap;
		public var layerBackground:FlxTilemap;
		public var layerBackLayer:FlxTilemap;
		public var layerPlayerLayer:FlxTilemap;
		public var layerFrontLayer:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level14(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 0.000, 0.000, 32, 32, 0.250, 0.250, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackground = addTilemap( CSV_Background, Img_Background, 0.000, -128.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackLayer = addTilemap( CSV_BackLayer, Img_BackLayer, 0.000, -160.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerPlayerLayer = addTilemap( CSV_PlayerLayer, Img_PlayerLayer, 0.000, -160.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerFrontLayer = addTilemap( CSV_FrontLayer, Img_FrontLayer, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerBackground);
			masterLayer.add(layerBackLayer);
			masterLayer.add(layerPlayerLayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFrontLayer);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = -160;
			boundsMaxX = 640;
			boundsMaxY = 512;
			boundsMin = new FlxPoint(0, -160);
			boundsMax = new FlxPoint(640, 512);
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
			linkedObjectDictionary[18] = addSpriteToLayer(new WeightSwitch(178.000, 88.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 178.000, 88.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			linkedObjectDictionary[21] = addSpriteToLayer(new Exit(320.000, 32.000, Assets.Exit), Exit, SpritesGroup , 320.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level15" }, { name:"enabled", value:false }, null ), onAddCallback );//"Exit"
			linkedObjectDictionary[20] = addSpriteToLayer(new WeightSwitch(256.000, 216.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 256.000, 216.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			addSpriteToLayer(new BreakableWall(160.000, 128.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 160.000, 128.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new PolygonBody(288.000, 160.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 288.000, 160.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
			addSpriteToLayer(null, Player, SpritesGroup , 192.000, 256.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			linkedObjectDictionary[19] = addSpriteToLayer(new WeightSwitch(111.000, 344.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 111.000, 344.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			addSpriteToLayer(new PolygonBody(448.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 448.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(192.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 192.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(160.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 160.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(224.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 224.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(160.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 160.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(352.000, 288.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 352.000, 288.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
			createLink(linkedObjectDictionary[18], linkedObjectDictionary[19], onAddCallback, generateProperties( { name:"require", value:"AND" }, null ) );
			createLink(linkedObjectDictionary[18], linkedObjectDictionary[20], onAddCallback, generateProperties( { name:"require", value:"AND" }, null ) );
			createLink(linkedObjectDictionary[18], linkedObjectDictionary[21], onAddCallback, generateProperties( { name:"onActivate", value:"ENABLE" }, null ) );
		}

	}
}
