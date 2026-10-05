package org.dinosaurriders.swap.physics {
	import Box2D.Dynamics.Controllers.b2BuoyancyController;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2TimeStep;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Settings;
	import org.dinosaurriders.swap.objects.PhysicalBody;
	import org.dinosaurriders.swap.objects.TextObject;
	/**
	 * @author Drakaen
	 */
	public class PhysicsUtil {
		private static var destroyQueue : Vector.<b2Body> = new Vector.<b2Body>();
		private static var swapQueue : Vector.<PhysicalBody> = new Vector.<PhysicalBody>();
		private static var rotationQueue : Array = [];
		private static var buoyancyControllers : Vector.<b2BuoyancyController> = new Vector.<b2BuoyancyController>();
		private static var currentText : TextObject;
		
		private static var currentSkipCount : int = 0;
		
		public static function destroyPhysicObjects(world : b2World) : void {
			while (destroyQueue.length > 0) {
				world.DestroyBody(destroyQueue.pop());
			}
		}
		
		public static function enqueueRotation(body : b2Body, angle : Number) : void {
			rotationQueue.push(angle, body);
		}
		
		public static function callRotation() : void {
			while (rotationQueue.length > 0) {
				(rotationQueue.pop() as b2Body).SetAngle(rotationQueue.pop());
			}	
		}
		
		public static function enqueueDeletedBody(body : b2Body) : void {
			destroyQueue.push(body);
		}
		
		public static function enqueueSwap(body1 : PhysicalBody, body2 : PhysicalBody) : void {
			swapQueue.push(body1, body2);
			currentSkipCount = 0;
		}
		
		public static function callSwaps() : void {
			if (swapQueue.length > 0) {
				currentSkipCount++;
				swapQueue[0].enabled = swapQueue[1].enabled = false;
			}
			
			if (currentSkipCount == Settings.SWAPSKIPCOUNT) {
				while (swapQueue.length > 0) {
					swapQueue[0].enabled = swapQueue[1].enabled = true;
					swapQueue.pop().swap(swapQueue.pop());
				}
				
				currentSkipCount = 0;
			}
		}
		
		public static function update(world : b2World, dt : Number, velocityIterations : int, positionIterations : int) : void {
			callSwaps();
			destroyPhysicObjects(world);
			callRotation();
			updateControllers(dt, velocityIterations, positionIterations);
		}
		
		public static function addBuoyancyController(world : b2World, controller : b2BuoyancyController) : void {
			buoyancyControllers.push(controller);
			world.AddController(controller);
		}
		
		public static function updateControllers(dt : Number, velocityIterations : int, positionIterations : int) : void {
			for (var i : int = 0; i < buoyancyControllers.length; i++) {
				var x : b2TimeStep = new b2TimeStep();
				x.dt = dt;
				buoyancyControllers[i].Step(x);
			}
		}
		
		public static function clearControllers() : void {
			buoyancyControllers = new Vector.<b2BuoyancyController>();
		}
		
		public static function enqueueText(t : TextObject) : void {
			// if it's not currently showing
			if (currentText != t) {
				// if currenttext is alive
				if (currentText != null && currentText.alive) {
					currentText.kill();
				}
				
				currentText = t;
				currentText.show();
			}
		}
	}
}
