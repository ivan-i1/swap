//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level20 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level20_Back.csv", mimeType="application/octet-stream")] public var CSV_Back:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Back:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level20_Arrows.csv", mimeType="application/octet-stream")] public var CSV_Arrows:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Arrows:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level20_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/maps/mapCSV_Level20_Hazards.csv", mimeType="application/octet-stream")] public var CSV_Hazards:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Hazards:Class;

		//Tilemaps
		public var layerBack:FlxTilemap;
		public var layerArrows:FlxTilemap;
		public var layerPlayer:FlxTilemap;
		public var layerHazards:FlxTilemap;

		//Sprites
		public var SpritesGroup:FlxGroup = new FlxGroup;

		//Shapes
		public var Property_FieldGroup:FlxGroup = new FlxGroup;

		//Properties


		public function Level_Level20(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerBack = addTilemap( CSV_Back, Img_Back, 0.000, -32.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerArrows = addTilemap( CSV_Arrows, Img_Arrows, 160.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerPlayer = addTilemap( CSV_Player, Img_Player, 0.000, -32.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerHazards = addTilemap( CSV_Hazards, Img_Hazards, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

			//Add layers to the master group in correct order.
			masterLayer.add(layerBack);
			masterLayer.add(layerArrows);
			masterLayer.add(layerPlayer);
			masterLayer.add(SpritesGroup);
			masterLayer.add(layerHazards);
			masterLayer.add(Property_FieldGroup);

			if ( addToStage )
				createObjects(onAddCallback, parentObject);

			boundsMinX = 0;
			boundsMinY = -32;
			boundsMaxX = 960;
			boundsMaxY = 640;
			boundsMin = new FlxPoint(0, -32);
			boundsMax = new FlxPoint(960, 640);
			bgColor = 0xff88beef;
		}

		override public function createObjects(onAddCallback:Function = null, parentObject:Object = null):void
		{
			addShapesForLayerProperty_Field(onAddCallback);
			addSpritesForLayerSprites(onAddCallback);
			generateObjectLinks(onAddCallback);
			if ( parentObject != null )
				parentObject.add(masterLayer);
			else
				FlxG.state.add(masterLayer);
		}

		public function addShapesForLayerProperty_Field(onAddCallback:Function = null):void
		{
			var obj:Object;

			obj = new BoxData(360.000, 540.000, 0.000, 50.000, 80.000, Property_FieldGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, Property_FieldGroup, generateProperties( { name:"endgame", value:true }, null ), 1, 1 );
			obj = new BoxData(390.000, 300.000, 0.000, 5.000, 150.000, Property_FieldGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, Property_FieldGroup, generateProperties( { name:"kills", value:true }, null ), 1, 1 );
			obj = new BoxData(-480.000, 540.000, 0.000, 50.000, 50.000, Property_FieldGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, Property_FieldGroup, generateProperties( null ), 1, 1 );
			obj = new BoxData(540.000, 120.000, 0.000, 120.000, 180.000, Property_FieldGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, Property_FieldGroup, generateProperties( { name:"kills", value:true }, null ), 1, 1 );
			obj = new BoxData(270.000, 0.000, 0.000, 270.000, 120.000, Property_FieldGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, Property_FieldGroup, generateProperties( { name:"gravityx", value:2 }, { name:"gravityy", value:-9.5 }, null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(new PolygonBody(320.000, 64.000, Assets.Crate3, 4, 500, 0, 0.5), PolygonBody, SpritesGroup , 320.000, 64.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate3"
			addSpriteToLayer(null, Player, SpritesGroup , 384.000, 64.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			addSpriteToLayer(new Exit(352.000, 544.000, Assets.Exit), Exit, SpritesGroup , 352.000, 544.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"enabled", value:true }, null ), onAddCallback );//"Exit"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
		}

	}
}
