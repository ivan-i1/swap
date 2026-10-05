package org.dinosaurriders.swap.objects {
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Settings;

	/**
	 * @author Drakaen
	 */
	public class PolygonBody extends PhysicalBody {
		private var sides : int;

		public function PolygonBody(X : Number, Y : Number, image : Class, sides : int = 4, density : Number = 1, restitution : Number = 0, friction : Number = 1) : void {
			super(X, Y, density, restitution, friction);

			this.sides = sides;

			loadGraphic(image, false, false);
			bodyDef.type = b2Body.b2_dynamicBody;
		}

		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var polyDef : b2PolygonShape = new b2PolygonShape();

			// fill the whole square
			if (sides == 4) {
				polyDef.SetAsBox(width / Settings.ratio / 2, height / Settings.ratio / 2);
				//bodyDef.fixedRotation = true;
			} else {
				var vertices : Array = new Array;
				var dtheta : Number = 2 * Math.PI / sides, radius : Number = width / Settings.ratio / 2,
				initAngle : Number = 0;

				// dtheta / 2 is so that it starts with flat side below
				if (sides % 2 == 0) {
					initAngle = dtheta / 2.0;
				}

				for (var i : int = 0; i < sides; i++) {
					vertices.push(new b2Vec2(Math.cos(dtheta * i + initAngle) * radius, Math.sin(dtheta * i + initAngle) * radius));
				}

				polyDef.SetAsVector(vertices, sides);
			}

			fixtureDefs[0] = new b2FixtureDef();
			fixtureDefs[0].shape = polyDef;
			
			return super.createPhysicsObject(world, properties);
		}
	}
}
