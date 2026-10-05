//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level9 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level9_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level9_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level9_BackLayer.csv", mimeType="application/octet-stream")] public var CSV_BackLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_BackLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level9_PlayerLayer.csv", mimeType="application/octet-stream")] public var CSV_PlayerLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_PlayerLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level9_FrontLayer.csv", mimeType="application/octet-stream")] public var CSV_FrontLayer:Class;
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


		public function Level_Level9(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 288.000, 96.000, 32, 32, 0.250, 0.250, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackground = addTilemap( CSV_Background, Img_Background, 416.000, 64.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackLayer = addTilemap( CSV_BackLayer, Img_BackLayer, 832.000, 416.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerPlayerLayer = addTilemap( CSV_PlayerLayer, Img_PlayerLayer, 832.000, 416.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerFrontLayer = addTilemap( CSV_FrontLayer, Img_FrontLayer, 832.000, 416.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerBackground);
			masterLayer.add(layerBackLayer);
			masterLayer.add(layerPlayerLayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFrontLayer);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 832;
			boundsMinY = 416;
			boundsMaxX = 1472;
			boundsMaxY = 928;
			boundsMin = new FlxPoint(832, 416);
			boundsMax = new FlxPoint(1472, 928);
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
			addSpriteToLayer(new BreakableWall(1024.000, 512.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 1024.000, 512.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new PolygonBody(896.000, 544.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 896.000, 544.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
			addSpriteToLayer(null, Player, SpritesGroup , 832.000, 576.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new BreakableWall(1056.000, 672.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 1056.000, 672.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new Exit(832.000, 704.000, Assets.Exit), Exit, SpritesGroup , 832.000, 704.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level10" }, null ), onAddCallback );//"Exit"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
