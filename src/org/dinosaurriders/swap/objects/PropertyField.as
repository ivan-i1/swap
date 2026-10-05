package org.dinosaurriders.swap.objects {
	import org.dinosaurriders.swap.states.EndgameState;
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.Contacts.b2Contact;
	import Box2D.Dynamics.Controllers.b2BuoyancyController;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Settings;
	import org.dinosaurriders.swap.levels.TextData;
	import org.dinosaurriders.swap.physics.PhysicsUtil;
	import org.flixel.FlxG;
	import org.flixel.FlxSprite;
	import org.flixel.plugin.photonstorm.FX.BlurFxRectangle;
	import org.flixel.plugin.photonstorm.FlxSpecialFX;

	import flash.utils.Dictionary;

	/**
	 * @author Mau
	 */
	public class PropertyField extends PhysicalBody {
		private var gravityField : b2Vec2;
		private var affectedByField : Dictionary;
		private var blurs : Boolean;
		private var onlyPlayer : Boolean;
		private var blur : BlurFxRectangle;
		private var blurEffect : FlxSprite;
		private var bc : b2BuoyancyController;
		private var fixesRotation : Boolean = false;
		private var endsGame : Boolean = false;

		public function PropertyField(X : Number, Y : Number) {
			super(X, Y, 0, 0, 0);

			affectedByField = new Dictionary();
			affectsPlayer = true;

			bodyDef.type = b2Body.b2_staticBody;
		}
		
		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var polyDef : b2PolygonShape = new b2PolygonShape();

			polyDef.SetAsBox(width / Settings.ratio / 2, height / Settings.ratio / 2);
			bodyDef.fixedRotation = true;

			fixtureDefs[0] = new b2FixtureDef();
			fixtureDefs[0].shape = polyDef;
			fixtureDefs[0].isSensor = true;

			gravityField = new b2Vec2();

			for each (var property : Object in properties) {
				switch (property.name) {
					case "gravityx":
						gravityField.x = property.value;
						break;
					case "gravityy":
						gravityField.y = property.value;
						break;
					case "blur":
						blurs = property.value;
						break;
					case "onlyPlayer":
						onlyPlayer = property.value;
						break;
					case "fixesRotation":
						fixesRotation = property.value;
						break;
					case "buoyancy":
						bc = new b2BuoyancyController();
						bc.offset = height / Settings.ratio;
						bc.density = property.value;
						bc.linearDrag = 500;
						bc.angularDrag = 250;
						PhysicsUtil.addBuoyancyController(world, bc);
						break;
					case "endgame":
						endsGame = property.value;
						break;
				}
			}
			
			if (bc != null) {
				var bouyancyNormal : b2Vec2 = gravityField.Copy();
				bouyancyNormal.Normalize();
				bc.normal.Set(bouyancyNormal.x, bouyancyNormal.y);
			}
			
			return super.createPhysicsObject(world, properties);
		}
		
		override public function onStartCollision(contact : b2Contact) : void {
			super.onStartCollision(contact);
			
			var otherBody : PhysicalBody = identifyCollision(contact)[1].GetUserData();
			
			if (otherBody != null) {
				if (affectedByField[otherBody] == null) {
					affectedByField[otherBody] = 0;
				}
				
				affectedByField[otherBody]++;
				
				if (affectedByField[otherBody] == 1 && 
					((onlyPlayer && otherBody is Player) ||
					affectsPlayer ||
				 	(!affectsPlayer && !(otherBody is Player)))) {
					applyProperties(otherBody);
				}
			}
		}

		override public function onEndCollision(contact : b2Contact) : void {
			super.onEndCollision(contact);

			var otherBody : PhysicalBody = identifyCollision(contact)[1].GetUserData();

			if (otherBody != null) {
				affectedByField[otherBody]--;
				
				if (affectedByField[otherBody] == 0 &&
					((onlyPlayer && otherBody is Player) ||
					affectsPlayer ||
					(!affectsPlayer && !(otherBody is Player)))) {
					ripProperties(otherBody);
				}
			}
		}

		public function applyProperties(affectedBody : PhysicalBody) : void {
			callObjectLinkActions();
			
			if (endsGame) {
				FlxG.switchState(new EndgameState());
				return;
			}
						
			if (blurs) {
				if (FlxG.getPlugin(FlxSpecialFX) == null) {
					FlxG.addPlugin(new FlxSpecialFX);
				}
				
				blur = FlxSpecialFX.blurRect();
				FlxG.flash(0x66220044, 0.5);
				blurEffect = blur.create(x, y, width, height, 6, 6, 4, 0);
				blur.addSprite(affectedBody);
				blur.start(1);
				
				FlxG.state.add(blurEffect);
			}
			// apply bouyancy 
			if (bc != null) {
				bc.AddBody(affectedBody.body);				
			}
			
			if (fixesRotation) {
				affectedBody.fixedRotation = true;
			}
			
			var newGravity : b2Vec2 = affectedBody.gravityVector.Copy();
			newGravity.Add(gravityField);
			affectedBody.gravityVector = newGravity;
		}

		public function ripProperties(affectedBody : PhysicalBody) : void {
			if (blurs) {
				FlxG.flash(0x66220044, 0.5);
				blur.stop();
				FlxG.state.remove(blurEffect);
				FlxG.removePluginType(FlxSpecialFX);
			}
			// remove bouyancy 
			if (bc != null) {
				bc.RemoveBody(affectedBody.body);
			}
			
			if (fixesRotation) {
				affectedBody.fixedRotation = false;
			}
			
			var newGravity : b2Vec2 = affectedBody.gravityVector.Copy();
			newGravity.Subtract(gravityField);
			affectedBody.gravityVector = newGravity;
		}
		
		private function callObjectLinkActions() : void {
			var links : Array = findAllObjectLinks("showText");
			var textObject : TextObject;
			
			for each (var textMessages : Array in links) {
				textObject = textMessages[2] as TextObject;
				
				if (textObject.alive) {
					PhysicsUtil.enqueueText(textObject);
				}
			}
		}
	}
}
