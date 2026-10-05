//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level10 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level10_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level10_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level10_BackLayer.csv", mimeType="application/octet-stream")] public var CSV_BackLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_BackLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level10_PlayerLayer.csv", mimeType="application/octet-stream")] public var CSV_PlayerLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_PlayerLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level10_FrontLayer.csv", mimeType="application/octet-stream")] public var CSV_FrontLayer:Class;
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


		public function Level_Level10(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
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
			layerBackground = addTilemap( CSV_Background, Img_Background, 0.000, -256.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackLayer = addTilemap( CSV_BackLayer, Img_BackLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerPlayerLayer = addTilemap( CSV_PlayerLayer, Img_PlayerLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
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
			boundsMinY = -32;
			boundsMaxX = 640;
			boundsMaxY = 512;
			boundsMin = new FlxPoint(0, -32);
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
			addSpriteToLayer(new PolygonBody(140.000, -30.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 140.000, -30.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
			addSpriteToLayer(new BreakableWall(192.000, 32.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 192.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new BreakableWall(448.000, 32.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 448.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 96.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new BreakableWall(384.000, 32.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 384.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new BreakableWall(416.000, 32.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 416.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new PolygonBody(512.000, 192.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 512.000, 192.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(480.000, 192.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 480.000, 192.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			linkedObjectDictionary[22] = addSpriteToLayer(new WeightSwitch(96.000, 218.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 96.000, 218.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			addSpriteToLayer(new PolygonBody(512.000, 224.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 512.000, 224.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(480.000, 224.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 480.000, 224.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(288.000, 288.000, Assets.SquareRock3, 4, 2000), PolygonBody, SpritesGroup , 288.000, 288.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock3"
			addSpriteToLayer(new PolygonBody(160.000, 320.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 160.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(192.000, 352.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 192.000, 352.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(160.000, 352.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 160.000, 352.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(192.000, 384.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 192.000, 384.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			addSpriteToLayer(new PolygonBody(160.000, 384.000, Assets.SquareRock2, 4, 2500), PolygonBody, SpritesGroup , 160.000, 384.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock2"
			linkedObjectDictionary[23] = addSpriteToLayer(new Exit(431.000, 416.000, Assets.Exit), Exit, SpritesGroup , 431.000, 416.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level11" }, { name:"enabled", value:false }, null ), onAddCallback );//"Exit"
			addSpriteToLayer(new PolygonBody(160.000, 416.000, Assets.SquareRock3, 4, 2000), PolygonBody, SpritesGroup , 160.000, 416.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"SquareRock3"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
			createLink(linkedObjectDictionary[22], linkedObjectDictionary[23], onAddCallback, generateProperties( { name:"onActivate", value:"ENABLE" }, null ) );
		}

	}
}
