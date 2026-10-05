package org.dinosaurriders.swap {
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2DebugDraw;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.levels.*;
	import org.dinosaurriders.swap.objects.PhysicalBody;
	import org.dinosaurriders.swap.objects.Player;
	import org.dinosaurriders.swap.objects.PropertyField;
	import org.dinosaurriders.swap.objects.TextObject;
	import org.dinosaurriders.swap.objects.Tileblock;
	import org.dinosaurriders.swap.physics.PhysicsUtil;
	import org.dinosaurriders.swap.physics.WorldContactListener;
	import org.flixel.*;

	import flash.display.Sprite;
	import flash.utils.Dictionary;
	import flash.utils.getDefinitionByName;

	public class LevelContainer extends FlxState {
		private var currentLevel : BaseLevel;
		private var currentLevelName : String;
		private var player : Player;
		private var camera : FlxCamera;
		private var exitTo : String;
		// box2d physics
		protected var world : b2World;
		protected var worldGroup : FlxGroup;
		protected var spriteGroup : FlxGroup;
		private var debugSprite : Sprite;

		public function LevelContainer(level : String) {
			this.currentLevelName = level;
		}

		public function loadLevelByName(level : String) : Object {
			var myLevel : Class = getDefinitionByName("org.dinosaurriders.swap.levels.Level_" + level) as Class;
			return new myLevel(true, onObjectAddedCallback);
		}

		override public function create() : void {
			worldGroup = new FlxGroup();
			spriteGroup = new FlxGroup();
			FlxG.playMusic(Assets.dark);
			// sets up the world physics
			setupWorld();

			// Creates the level
			currentLevel = loadLevelByName(currentLevelName) as BaseLevel;
			spriteGroup.add(currentLevel.hitTilemaps);

			FlxG.bgColor = currentLevel.bgColor;

			camera = new FlxCamera(0, 0, FlxG.width, FlxG.height);
			FlxG.resetCameras(camera);
			camera.follow(player, FlxCamera.STYLE_PLATFORMER);
			var hitTilemap : FlxTilemap = (currentLevel.hitTilemaps.members[0] as FlxTilemap);

			camera.setBounds(hitTilemap.x, hitTilemap.y, hitTilemap.width, hitTilemap.height);
			FlxG.worldBounds = new FlxRect(hitTilemap.x - 100, hitTilemap.y, hitTilemap.width + 200, hitTilemap.height + 200);

			// initial flash
			FlxG.flash(0xffffff, 2);
		}

		private function setupWorld() : void {
			// Gravity is 0 because is handled individually by each object
			var gravity : b2Vec2 = new b2Vec2(0, 0);

			// TODO fix this so that objects can sleep
			world = new b2World(gravity, true);
			world.SetContactListener(new WorldContactListener(world));

			debugDrawing();
		}

		/*
		 * Creates the physics for the given tilemap
		 */
		private function createTilemapPhysics(tilemap : FlxTilemap, properties : Array, level : BaseLevel, offsetX : Number, offsetY : Number) : void {
			var currentHitLayer : Array;

			// DAME tile properties are stored in properties["%DAME_tiledata%"][tileId][key]
			var tileProperties : Dictionary;

			if (properties[0] == null) {
				// if it has no properties, we still need to iterate over an empty array
				tileProperties = new Dictionary;
			} else if (properties[0].name != "%DAME_tiledata%") {
				throw new Error("Invalid tilemap properties index");
			} else {
				tileProperties = properties[0].value;
			}

			var currentProperties : Array;

			// create map tiles
			if (level.hitTilemaps.members.lastIndexOf(tilemap) != -1) {
				currentHitLayer = tilemap.getData();

				for (var y : Number = 0, i : Number = 0; y < tilemap.heightInTiles; y++) {
					for (var x : Number = 0; x < tilemap.widthInTiles; x++, i++) {
						if (currentHitLayer[i] != 0) {
							createTileBox(x, y, offsetX, offsetY, tileProperties[currentHitLayer[i]]);
						}
					}
				}

				// Create border tiles on the hit layer
				for (var y1 : int = -10; y1 <= tilemap.heightInTiles + 10; y1++) {
					spriteGroup.add(createTileBox(-1, y1, offsetX, offsetY, []));
					spriteGroup.add(createTileBox(tilemap.widthInTiles, y1, offsetX, offsetY, []));
				}

				for (var x1 : int = -1; x1 < tilemap.widthInTiles; x1++) {
					spriteGroup.add(createTileBox(x1, tilemap.heightInTiles + 5, offsetX, offsetY, [{name:"kills", value:true}, {name:"sensor", value:false}]));
				}
			}
		}

		/*
		 * Creates a solid and static tile block, all sizes expressed in tiles
		 */
		private function createTileBox(tileX : Number, tileY : Number, offsetX : Number, offsetY : Number, properties : Array) : Tileblock {
			var tile : Tileblock = new Tileblock((offsetX + tileX) * Settings.TILESIZE, (offsetY + tileY) * Settings.TILESIZE);
			tile.width = Settings.TILESIZE;
			tile.height = Settings.TILESIZE;
			tile.createPhysicsObject(world, properties);

			worldGroup.add(tile);
			return tile;
		}
		
		private function createPropertyField(obj : Object, properties : Array) : PropertyField { 
			var field : PropertyField = new PropertyField(obj.x, obj.y);
			field.width = obj.width;
			field.height = obj.height;
			field.createPhysicsObject(world, properties);
			return field;
		}

		protected function onObjectAddedCallback(obj : Object, layer : FlxGroup, level : BaseLevel, scrollX : Number, scrollY : Number, properties : Array) : Object {
			if (obj is Player) {
				player = obj as Player;
				player.setOnKill(onKillPlayerCallback);
				player.setOnExit(onExitPlayerCallback);
			} else if (obj is FlxTilemap) {
				var map : FlxTilemap = obj as FlxTilemap;
				createTilemapPhysics(map, properties, level, map.x / Settings.TILESIZE, map.y / Settings.TILESIZE);
			} else if (obj is ObjectLink) {
				var link : ObjectLink = obj as ObjectLink;

				if (link.fromObject is PhysicalBody) {
					((PhysicalBody)(link.fromObject)).addObjectLink(properties[0].name, properties[0].value, link.toObject);
				}
				if (link.toObject is TextData) {
					// FIXME this creates a duplicate field
					var field : PropertyField = createPropertyField(link.fromObject, properties);
					field.addObjectLink(properties[0].name, properties[0].value, new TextObject((TextData)(link.toObject)));
				}
			} else if (obj is BoxData) {
				createPropertyField(obj, properties);
			}

			if (obj is PhysicalBody) {
				var physicsBody : PhysicalBody = obj as PhysicalBody;
				physicsBody.createPhysicsObject(world, properties);
				worldGroup.add(physicsBody);

				if (!(obj is Player)) {
					spriteGroup.add(physicsBody);
				}
			}

			return obj;
		}

		override public function update() : void {
			super.update();

			FlxG.collide(player, spriteGroup);

			PhysicsUtil.update(world, FlxG.elapsed, 10, 10);

			// Box2D physics step
			world.Step(FlxG.elapsed, 10, 10);
//			world.DrawDebugData();
			world.ClearForces();

			PhysicsUtil.callSwaps();
			if (FlxG.keys.justPressed("R")) {
				this.reset();
			}

			if (exitTo != null) {
				currentLevelName = exitTo;
				exitTo = null;
				reset();
			}
		}

		private function onKillPlayerCallback() : void {
			reset();
		}

		private function onExitPlayerCallback(levelName : String) : void {
			exitTo = levelName;
		}

		private function reset() : void {
			/*var temp:Player=this.player;
			player.kill();
			player.revive();
			player=temp;*/

			// destroy disposed objects
			PhysicsUtil.clearControllers();
			worldGroup.kill();
			PhysicsUtil.destroyPhysicObjects(world);

			this.kill();

			FlxG.switchState(new LevelContainer(currentLevelName));
		}

		private function debugDrawing() : void {
			// Assuming a world is set up, under variable m_world
			// debugSprite is some sprite that we want to draw our debug shapes into.
			debugSprite = new Sprite();
			FlxG.stage.addChild(debugSprite);

			// FIXME debug does not follow camera
			var debugDraw : b2DebugDraw = new b2DebugDraw();

			debugDraw.SetSprite(debugSprite);
			debugDraw.SetDrawScale(Settings.ratio);
			debugDraw.SetLineThickness(1);
			debugDraw.SetAlpha(1.0);
			debugDraw.SetFillAlpha(0.5);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
		}
	}
}