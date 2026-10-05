//Code generated with DAME. http://www.dambots.com

package org.dinosaurriders.swap.levels
{
	import org.flixel.*;
	import flash.utils.Dictionary;
	// Custom imports:
import org.dinosaurriders.swap.*;import org.dinosaurriders.swap.objects.*;
	public class Level_Level19 extends BaseLevel
	{
		//Embedded media...
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level19_Back.csv", mimeType="application/octet-stream")] public var CSV_Back:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Back:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level19_Arrows.csv", mimeType="application/octet-stream")] public var CSV_Arrows:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Arrows:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level19_Player.csv", mimeType="application/octet-stream")] public var CSV_Player:Class;
		[Embed(source="../../../../../assets/spritesheet2.png")] public var Img_Player:Class;
		[Embed(source="../../../../../assets/worlds/map/mapCSV_Level19_Hazards.csv", mimeType="application/octet-stream")] public var CSV_Hazards:Class;
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


		public function Level_Level19(addToStage:Boolean = true, onAddCallback:Function = null, parentObject:Object = null)
		{
			// Generate maps.
			var properties:Array = [];
			var tileProperties:Dictionary = new Dictionary;

			properties = generateProperties( null );
			layerBack = addTilemap( CSV_Back, Img_Back, 0.000, 0.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerArrows = addTilemap( CSV_Arrows, Img_Arrows, 160.000, 128.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerPlayer = addTilemap( CSV_Player, Img_Player, 0.000, 0.000, 32, 32, 1.000, 1.000, true, 1, 1, properties, onAddCallback );
			properties = generateProperties( null );
			layerHazards = addTilemap( CSV_Hazards, Img_Hazards, 160.000, 512.000, 32, 32, 1.000, 1.000, false, 1, 1, properties, onAddCallback );

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
			boundsMaxY = 768;
			boundsMin = new FlxPoint(0, 0);
			boundsMax = new FlxPoint(960, 768);
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

			obj = new BoxData(320.000, 579.000, 0.000, 320.000, 201.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"gravityy", value:-16 }, { name:"buoyancy", value:5 }, null ), 1, 1 );
			obj = new BoxData(314.000, 621.000, 0.000, 340.000, 5.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"kills", value:true }, null ), 1, 1 );
			obj = new BoxData(390.000, 132.000, 0.000, 180.000, 170.000, PropertyFieldsGroup );
			shapes.push(obj);
			callbackNewData( obj, onAddCallback, PropertyFieldsGroup, generateProperties( { name:"gravityy", value:-12 }, { name:"buoyancy", value:200 }, { name:"fixesRotation", value:true }, null ), 1, 1 );
		}

		public function addSpritesForLayerSprites(onAddCallback:Function = null):void
		{
			addSpriteToLayer(null, Player, SpritesGroup , 270.000, 98.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Player"
			linkedObjectDictionary[8] = addSpriteToLayer(new WeightSwitch(462.000, 281.000, Assets.Switch1, 100), WeightSwitch, SpritesGroup , 462.000, 281.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( null ), onAddCallback );//"Switch1"
			addSpriteToLayer(new PolygonBody(896.000, 320.000, Assets.Crate1, 4, 500), PolygonBody, SpritesGroup , 896.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate1"
			addSpriteToLayer(new PolygonBody(0.000, 320.000, Assets.Crate1, 4, 500), PolygonBody, SpritesGroup , 0.000, 320.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate1"
			linkedObjectDictionary[9] = addSpriteToLayer(new Exit(463.000, 400.000, Assets.Exit), Exit, SpritesGroup , 463.000, 400.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"sensor", value:true }, { name:"enabled", value:false }, null ), onAddCallback );//"Exit"
			addSpriteToLayer(new PolygonBody(672.000, 480.000, Assets.Crate1, 4, 500), PolygonBody, SpritesGroup , 672.000, 480.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate1"
			addSpriteToLayer(new PolygonBody(224.000, 480.000, Assets.Crate1, 4, 500), PolygonBody, SpritesGroup , 224.000, 480.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:true }, null ), onAddCallback );//"Crate1"
			addSpriteToLayer(new PolygonBody(448.000, 512.000, Assets.Crate2, 4, 500), PolygonBody, SpritesGroup , 448.000, 512.000, 0.000, 1, 1, false, 1.000, 1.000, generateProperties( { name:"swappable", value:false }, { name:"fixedx", value:true }, null ), onAddCallback );//"Crate2"
		}

		public function generateObjectLinks(onAddCallback:Function = null):void
		{
			createLink(linkedObjectDictionary[8], linkedObjectDictionary[9], onAddCallback, generateProperties( { name:"onActivate", value:"ENABLE" }, null ) );
		}

	}
}
