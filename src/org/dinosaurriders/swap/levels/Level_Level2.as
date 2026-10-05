//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level2 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level2_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level2_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level2_PlayerLayer.csv", mimeType="application/octet-stream")] public var CSV_PlayerLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_PlayerLayer:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level2_FrontLayer.csv", mimeType="application/octet-stream")] public var CSV_FrontLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_FrontLayer:Class;

		//Tilemaps
		public var layerSky:FlxTilemap;
		public var layerBackground:FlxTilemap;
		public var layerPlayerLayer:FlxTilemap;
		public var layerFrontLayer:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Shapes
		public var TextGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level2(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 0.000, -32.000, 32, 32, 0.250, 0.250, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerBackground = addTilemap( CSV_Background, Img_Background, 0.000, -32.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerPlayerLayer = addTilemap( CSV_PlayerLayer, Img_PlayerLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[14]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[15]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
			layerFrontLayer = addTilemap( CSV_FrontLayer, Img_FrontLayer, 0.000, -32.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerBackground);
			masterLayer.add(layerPlayerLayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFrontLayer);
			masterLayer.add(TextGroup);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = -32;
			boundsMaxX = 1120;
			boundsMaxY = 480;
			boundsMin = new FlxPoint(0, -32);
			boundsMax = new FlxPoint(1120, 480);
			bgColor = 0xff88beef;
		}

		override public function createObjects(onAddCallback:Function = null, parentObject:Object = null):void
		{
			addShapesForLayerText(onAddCallback);
			addSpritesForLayerSprites(onAddCallback);
			generateObjectLinks(onAddCallback);
			if ( parentObject != null )
				parentObject.add(masterLayer);
			else
				FlxG.state.add(masterLayer);
		}

		public function addShapesForLayerText(onAddCallback:Function = null):void
		{
			var obj:Object;

			linkedObjectDictionary[13] = callbackNewData(new TextData(0.000, 30.000, 510.000, 50.000, 0.000, "Thankfully, I can jump over obstacles like this one by pressing the [SPACE] key.","system", 11, 0x000000, "center"), onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  ) ;
			obj = new BoxData(120.000, 210.000, 0.000, 50.000, 200.000, TextGroup );
			shapes.push(obj);
			linkedObjectDictionary[12] = callbackNewData( obj, onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  );
			obj = new BoxData(360.000, 210.000, 0.000, 50.000, 200.000, TextGroup );
			shapes.push(obj);
			linkedObjectDictionary[14] = callbackNewData( obj, onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  );
			obj = new BoxData(720.000, 210.000, 0.000, 50.000, 200.000, TextGroup );
			shapes.push(obj);
			linkedObjectDictionary[16] = callbackNewData( obj, onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  );
			linkedObjectDictionary[15] = callbackNewData(new TextData(0.000, 30.000, 480.000, 50.000, 0.000, "That was easy, now this one seems more challenging.","system", 11, 0x000000, "center"), onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  ) ;
			linkedObjectDictionary[17] = callbackNewData(new TextData(0.000, 30.000, 421.080, 50.000, 0.000, "Nothing can stop me.","system", 11, 0x000000, "center"), onAddCallback, TextGroup, generateProperties( null ), 1, 1, true  ) ;
			obj = new BoxData(810.000, 330.000, 0.000, 50.000, 50.000, TextGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, TextGroup, generateProperties( null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 383.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(1080.000, 352.000, Assets.Exit), Exit, SpritesGroup , 1080.000, 352.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level3" }, null ), onAddCallback );//"Exit"
			addSpriteToLayer(new PolygonBody(446.000, 352.000, Assets.SquareRock3, 4, 2000), PolygonBody, SpritesGroup , 446.000, 352.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:false }, null ), onAddCallback );//"SquareRock3"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
			createLink(linkedObjectDictionary[12], linkedObjectDictionary[13], onAddCallback, generateProperties( { name:"showText", value:true }, null ) );
			createLink(linkedObjectDictionary[14], linkedObjectDictionary[15], onAddCallback, generateProperties( { name:"showText", value:true }, null ) );
			createLink(linkedObjectDictionary[16], linkedObjectDictionary[17], onAddCallback, generateProperties( { name:"showText", value:true }, null ) );
		}

	}
}
