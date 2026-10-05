package org.dinosaurriders.swap.objects {
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Dynamics.Contacts.b2Contact;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Assets;
	import org.dinosaurriders.swap.Settings;

	import flash.filters.GlowFilter;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	/**
	 * @author Drakaen
	 */
	public class Exit extends PhysicalBody {
		private var warpTo : String;
		
		public function Exit(X : Number, Y : Number, image : Class) {
			super(X, Y+10, 0, 0, 0);
			
			loadGraphic(Assets.Exit, true, true, 48, 48);
			
			addAnimation("idle", [0,1,2,3,4,5,6,7,8,9,10], 8,true);
			solid = immovable = false;
			
			bodyDef.fixedRotation = true;
			
			bodyDef.type = b2Body.b2_staticBody;
			
			play("idle");
		}
		
		
		override public function update() : void {
			super.update();
			
			framePixels.applyFilter(framePixels, new Rectangle(0, 0, width, height), new Point(0, 0), new GlowFilter(0xcc00ff, 0.3, 12, 12, 1, 3, true));
		}
		
			
		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var polyDef : b2PolygonShape = new b2PolygonShape();

			polyDef.SetAsBox(width / Settings.ratio / 2, height / Settings.ratio / 2);
			bodyDef.fixedRotation = true;
			
			fixtureDefs[0] = new b2FixtureDef();
			fixtureDefs[0].shape = polyDef;
			fixtureDefs[0].isSensor = true;
			
			for each (var property : Object in properties) {
				switch (property.name) {
					case "warp":
						warpTo = property.value;
						break;
				}
			}
			
			return super.createPhysicsObject(world, properties);
		}
		
		override public function onStartCollision(contact : b2Contact) : void {
			super.onStartCollision(contact);
			
			var otherBody : PhysicalBody = identifyCollision(contact)[1].GetUserData();
			
			if (otherBody is Player) {
				var player : Player = otherBody as Player;
				player.exitLevel(warpTo);
			}
		}
	}
}
