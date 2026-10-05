package org.dinosaurriders.swap.objects {
	import Box2D.Dynamics.b2Body;

	/**
	 * @author Drakaen
	 */
	public class Switch extends PhysicalBody {
		private var activated : Boolean;

		public function Switch(X : Number, Y : Number, image : Class) {
			super(X, Y, 1, 0, 1);

			loadGraphic(image, false, false);
			bodyDef.type = b2Body.b2_staticBody;
		}

		/*
		 * Activates this switch and triggers the onActivate if all its requirements are met
		 */
		protected function activate() : void {
			var requirements : Array = findAllObjectLinks("require");
			var objectsToTrigger : Array = findAllObjectLinks("onActivate");
			var otherSwitch : Switch, otherBody : PhysicalBody;

			activated = true;
			var metRequirements : Boolean = activated;
			
			// check if switch requirements are met
			for each (var requirement : Array in requirements) {
				otherSwitch = requirement[2] as Switch;

				// only works for switches, if this fails, then you linked it with something wrong
				switch (requirement[1]) {
					case "AND":
						if (!otherSwitch.activated) {
							metRequirements = false; 
						}
						break;
				}
			}

			// if all requirements are met, then enable triggers
			for each (var object : Array in objectsToTrigger) {
				otherBody = object[2] as PhysicalBody;

				switch (object[1]) {
					case "ENABLE":
						otherBody.enabled = metRequirements;
						break;
				}
			}
		}

		protected function deactivate() : void {
			activated = false;
			
			var requirements : Array = findAllObjectLinks("require");
			var objectsToTrigger : Array = findAllObjectLinks("onActivate");
			var otherSwitch : Switch, otherBody : PhysicalBody;
			
			var metRequirements : Boolean = activated;			
			// check if switch requirements are met
			for each (var requirement : Array in requirements) {
				otherSwitch = requirement[2] as Switch;

				// only works for switches, if this fails, then you linked it with something wrong
				switch (requirement[1]) {
					case "AND":
						if (!otherSwitch.activated) {
							metRequirements = false; 
						}
						break;
				}
			}

			// if all requirements are met, then enable triggers
			for each (var object : Array in objectsToTrigger) {
				otherBody = object[2] as PhysicalBody;

				switch (object[1]) {
					case "ENABLE":
						otherBody.enabled = metRequirements;
						break;
				}
			}
		}
	}
}
