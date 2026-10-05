package org.dinosaurriders.swap.objects {
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Dynamics.Contacts.b2Contact;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2Fixture;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Settings;

	/**
	 * @author Drakaen
	 */
	public class WeightSwitch extends Switch {
		private var requiredForce : Number;
		private var currentForce : Number = 0;
		
		public function WeightSwitch(X : Number, Y : Number, image : Class, requiredForce : Number) {
			super(X, Y, image);
			
			this.requiredForce = requiredForce;
		}

		override public function onStartCollision(contact : b2Contact) : void {
			super.onStartCollision(contact);
			
			var collision : Vector.<b2Fixture> = identifyCollision(contact);
			var otherBody : PhysicalBody = collision[1].GetUserData();
			
			currentForce += otherBody.body.GetMass() * otherBody.gravityVector.Length();
			if (currentForce >= requiredForce) {
				activate();
			}
		}

		override public function onEndCollision(contact : b2Contact) : void {
			super.onEndCollision(contact);
			
			var collision : Vector.<b2Fixture> = identifyCollision(contact);
			var otherBody : PhysicalBody = collision[1].GetUserData();
			
			currentForce -= otherBody.body.GetMass() * otherBody.gravityVector.Length();		
			if (currentForce < requiredForce) {
				deactivate();
			}
		}

		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var polyDef : b2PolygonShape = new b2PolygonShape();
			
			polyDef.SetAsBox(width / Settings.ratio / 2, height / Settings.ratio / 2);
			fixtureDefs[0] = new b2FixtureDef();
			fixtureDefs[0].shape = polyDef;
			
			return super.createPhysicsObject(world, properties);
		}
	}
}
