//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level18 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level18_Back.csv", mimeType="application/octet-stream")] public var CSV_Back:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Back:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level18_Arrows.csv", mimeType="application/octet-stream")] public var CSV_Arrows:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Arrows:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level18_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level18_Hazards.csv", mimeType="application/octet-stream")] public var CSV_Hazards:Class;
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


		public function Level_Level18(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerBack = addTilemap( CSV_Back, Img_Back, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerArrows = addTilemap( CSV_Arrows, Img_Arrows, 64.000, 512.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			tileProperties[23]=generateProperties( { name:"kills", value:true }, null );
			tileProperties[24]=generateProperties( { name:"kills", value:true }, null );
			properties.push( { name:"%DAME_tiledata%", value:tileProperties } );
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

			obj = new BoxData(223.000, 660.000, 0.000, 320.000, 172.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"gravityx", value:-5 }, null ), 1, 1 );
			obj = new BoxData(226.000, 515.000, 0.000, 320.000, 145.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"gravityy", value:-14 }, { name:"buoyancy", value:20 }, null ), 1, 1 );
			obj = new BoxData(210.000, 590.000, 0.000, 360.000, 5.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"kills", value:true }, null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(new PolygonBody(96.000, 384.000, Assets.Crate2, 4, 500), PolygonBody, SpritesGroup , 96.000, 384.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate2"
			addSpriteToLayer(new PolygonBody(160.000, 384.000, Assets.Crate2, 4, 500), PolygonBody, SpritesGroup , 160.000, 384.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate2"
			addSpriteToLayer(null, Player, SpritesGroup , 0.000, 416.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(0.000, 768.000, Assets.Exit), Exit, SpritesGroup , 0.000, 768.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"warp", value:"Level19" }, null ), onAddCallback );//"Exit"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
