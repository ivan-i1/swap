//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level16 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Sky.csv", mimeType="application/octet-stream")] public var CSV_Sky:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Sky:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Clouds.csv", mimeType="application/octet-stream")] public var CSV_Clouds:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Clouds:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Background.csv", mimeType="application/octet-stream")] public var CSV_Background:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Background:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_BlackSpaceLayer.csv", mimeType="application/octet-stream")] public var CSV_BlackSpaceLayer:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_BlackSpaceLayer:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Stars1.csv", mimeType="application/octet-stream")] public var CSV_Stars1:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Stars1:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Stars2.csv", mimeType="application/octet-stream")] public var CSV_Stars2:Class;
		[Embed(source="../../../../../assets/spritesheet1.png")] public var Img_Stars2:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level16_Front.csv", mimeType="application/octet-stream")] public var CSV_Front:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Front:Class;

		//Tilemaps
		public var layerSky:FlxTilemap;
		public var layerClouds:FlxTilemap;
		public var layerBackground:FlxTilemap;
		public var layerBlackSpaceLayer:FlxTilemap;
		public var layerStars1:FlxTilemap;
		public var layerStars2:FlxTilemap;
		public var layerPlayer:FlxTilemap;
		public var layerFront:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Shapes
		public var PropertyFieldsGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level16(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerSky = addTilemap( CSV_Sky, Img_Sky, 0.000, 0.000, 32, 32, 0.000, 0.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerClouds = addTilemap( CSV_Clouds, Img_Clouds, 480.000, -32.000, 32, 32, 0.300, 0.300, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerBackground = addTilemap( CSV_Background, Img_Background, 800.000, -32.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerBlackSpaceLayer = addTilemap( CSV_BlackSpaceLayer, Img_BlackSpaceLayer, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerStars1 = addTilemap( CSV_Stars1, Img_Stars1, 0.000, 0.000, 32, 32, 0.500, 0.500, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerStars2 = addTilemap( CSV_Stars2, Img_Stars2, -96.000, -32.000, 32, 32, 0.250, 0.250, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerPlayer = addTilemap( CSV_Player, Img_Player, 0.000, 0.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerFront = addTilemap( CSV_Front, Img_Front, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerSky);
			masterLayer.add(layerClouds);
			masterLayer.add(layerBackground);
			masterLayer.add(layerBlackSpaceLayer);
			masterLayer.add(layerStars1);
			masterLayer.add(layerStars2);
			masterLayer.add(layerPlayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerFront);
			masterLayer.add(PropertyFieldsGroup);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = 0;
			boundsMaxX = 2880;
			boundsMaxY = 608;
			boundsMin = new FlxPoint(0, 0);
			boundsMax = new FlxPoint(2880, 608);
			bgColor = 0xff88beef;
		}

		override public function createObjects(onAddCallback:Function = null, parentObject:Object = null):void
		{
			addShapesForLayerPropertyFields(onAddCallback);
			addSpritesForLayerSprites(onAddCallback);
			generateObjectLinks(onAddCallback);
			if ( parentObject != null )
				parentObject.add(masterLayer);
			else
				FlxG.state.add(masterLayer);
		}

		public function addShapesForLayerPropertyFields(onAddCallback:Function = null):void
		{
			var obj:Object;

			obj = new BoxData(0.000, 318.000, 0.000, 1590.000, 150.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"blur", value:true }, null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 415.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(2399.000, 414.000, Assets.Exit), Exit, SpritesGroup , 2399.000, 414.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level17" }, null ), onAddCallback );//"Exit"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
