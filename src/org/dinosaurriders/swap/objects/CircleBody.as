package org.dinosaurriders.swap.objects {
	import Box2D.Collision.Shapes.b2CircleShape;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Settings;
	/**
	 * @author Drakaen
	 */
	public class CircleBody extends PhysicalBody {
		public function CircleBody(X : Number, Y : Number, image : Class,
			density : Number = 1, restitution : Number = 0, friction : Number = 1) : void {
			super(X, Y, density, restitution, friction);
			
			loadGraphic(image, false, false);
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		
		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var circleDef : b2CircleShape = new b2CircleShape();
			circleDef.SetRadius(width / Settings.ratio / 2);
			
			fixtureDefs[0] = new b2FixtureDef();
			fixtureDefs[0].shape = circleDef;
			
			return super.createPhysicsObject(world, properties);
		}
	}
}
