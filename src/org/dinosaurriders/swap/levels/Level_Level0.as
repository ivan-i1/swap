//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level0 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level0_Back.csv", mimeType="application/octet-stream")] public var CSV_Back:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Back:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level0_Arrows.csv", mimeType="application/octet-stream")] public var CSV_Arrows:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Arrows:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level0_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level0_Hazards.csv", mimeType="application/octet-stream")] public var CSV_Hazards:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Hazards:Class;

		//Tilemaps
		public var layerBack:FlxTilemap;
		public var layerArrows:FlxTilemap;
		public var layerPlayer:FlxTilemap;
		public var layerHazards:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Shapes
		public var PropertyFieldsGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level0(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerBack = addTilemap( CSV_Back, Img_Back, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerArrows = addTilemap( CSV_Arrows, Img_Arrows, 64.000, 512.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerPlayer = addTilemap( CSV_Player, Img_Player, 0.000, 0.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerHazards = addTilemap( CSV_Hazards, Img_Hazards, 64.000, 512.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerBack);
			masterLayer.add(layerArrows);
			masterLayer.add(layerPlayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerHazards);
			masterLayer.add(PropertyFieldsGroup);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = 0;
			boundsMaxX = 960;
			boundsMaxY = 960;
			boundsMin = new FlxPoint(0, 0);
			boundsMax = new FlxPoint(960, 960);
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

			obj = new BoxData(-451.000, -90.000, 0.000, 50.000, 50.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(new BreakableWall(224.000, 32.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 224.000, 32.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
			addSpriteToLayer(new PolygonBody(64.000, 64.000, Assets.ForestBoulderLarge, 12, 2000), PolygonBody, SpritesGroup , 64.000, 64.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"ForestBoulderLarge"
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 96.000, 359.820, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(0.000, 224.000, Assets.Exit), Exit, SpritesGroup , 0.000, 224.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, null ), onAddCallback );//"Exit"
			addSpriteToLayer(new BreakableWall(256.000, 192.000, Assets.BreakableWall1, Assets.ForestBoulderLarge, 7000), BreakableWall, SpritesGroup , 256.000, 192.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"BreakableWall1"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
