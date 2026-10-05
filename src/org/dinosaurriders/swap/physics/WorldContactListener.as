package org.dinosaurriders.swap.physics {
	import Box2D.Collision.b2Manifold;
	import Box2D.Dynamics.Contacts.b2Contact;
	import Box2D.Dynamics.b2ContactImpulse;
	import Box2D.Dynamics.b2ContactListener;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.objects.PhysicalBody;

	/**
	 * @author Drakaen
	 */
	public class WorldContactListener extends b2ContactListener {
		private var world : b2World;

		public function WorldContactListener(world : b2World) {
			this.world = world;
		}

		override public function BeginContact(contact : b2Contact) : void {
			if (contact.GetFixtureA().GetUserData() is PhysicalBody) {
				(contact.GetFixtureA().GetUserData() as PhysicalBody).onStartCollision(contact);
			}
			if (contact.GetFixtureB().GetUserData() is PhysicalBody) {
				(contact.GetFixtureB().GetUserData() as PhysicalBody).onStartCollision(contact);
			}
		}

		override public function EndContact(contact : b2Contact) : void {
			if (contact.GetFixtureA().GetUserData() is PhysicalBody) {
				(contact.GetFixtureA().GetUserData() as PhysicalBody).onEndCollision(contact);
			}
			if (contact.GetFixtureB().GetUserData() is PhysicalBody) {
				(contact.GetFixtureB().GetUserData() as PhysicalBody).onEndCollision(contact);
			}
		}

		override public function PreSolve(contact : b2Contact, oldManifold : b2Manifold) : void {
			if (contact.GetFixtureA().GetUserData() is PhysicalBody) {
				(contact.GetFixtureA().GetUserData() as PhysicalBody).onBeforeSolveCollision(contact, oldManifold);
			}
			if (contact.GetFixtureB().GetUserData() is PhysicalBody) {
				(contact.GetFixtureB().GetUserData() as PhysicalBody).onBeforeSolveCollision(contact, oldManifold);
			}
		}

		override public function PostSolve(contact : b2Contact, impulse : b2ContactImpulse) : void {
			if (contact.GetFixtureA().GetUserData() is PhysicalBody) {
				(contact.GetFixtureA().GetUserData() as PhysicalBody).onAfterSolveCollision(contact, impulse);
			}
			if (contact.GetFixtureB().GetUserData() is PhysicalBody) {
				(contact.GetFixtureB().GetUserData() as PhysicalBody).onAfterSolveCollision(contact, impulse);
			}
		}
	}
}
