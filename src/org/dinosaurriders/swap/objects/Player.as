package org.dinosaurriders.swap.objects {
	import Box2D.Collision.Shapes.b2CircleShape;
	import Box2D.Collision.Shapes.b2PolygonShape;
	import Box2D.Collision.b2Manifold;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.Contacts.b2Contact;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2ContactImpulse;
	import Box2D.Dynamics.b2Fixture;
	import Box2D.Dynamics.b2FixtureDef;
	import Box2D.Dynamics.b2World;

	import org.dinosaurriders.swap.Assets;
	import org.dinosaurriders.swap.Settings;
	import org.dinosaurriders.swap.physics.PhysicsUtil;
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.FlxControl;
	import org.flixel.plugin.photonstorm.FlxControlHandler;

	import flash.utils.Dictionary;

	public class Player extends PhysicalBody {
		//private var grounded : Boolean;
		private var feetContactCount : int;
		private var _dead : Boolean = false;
		private var tempSwapObject : PhysicalBody;
		private var onKillCallback : Function;
		private var onExitCallback : Function;
		private var controls : Dictionary;
		private var canSwap : Boolean;
		private var swapCooldownTimer : FlxTimer;
		private var swapTouchSensorSprite : FlxSprite;

		public function Player(X : Number, Y : Number) : void {
			super(X, Y, 1000, 0, 1);
			loadGraphic(Assets.Player, true, true, 32, 32);

			offset.x = 12;
			width = 8;
			height = 32;

			controls = new Dictionary();
			controls["JUMP"] = Settings.JUMPKEY;
			controls["SWAP"] = Settings.SWAPKEY;
			controls["TOUCHSWAP"] = Settings.TOUCHSWAPKEY;

			addAnimation("jump", [5], 1, false);
			addAnimation("move", [9, 10, 11, 12, 13, 14, 15, 16], 16, true);
			addAnimation("fall", [6], 1, false);
			addAnimation("idle", [2, 0, 1, 0, 0, 1], 3, true);

			immovable = false;
			canSwap = true;
			swapCooldownTimer = new FlxTimer();
			swapTouchSensorSprite = new FlxSprite();

			bodyDef.fixedRotation = true;
			bodyDef.allowSleep = false;

			if (FlxG.getPlugin(FlxControl) == null) {
				FlxG.addPlugin(new FlxControl);
			}

			FlxControl.create(this, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, true, false);
			FlxControl.player1.setCustomKeys(Settings.UPKEY, Settings.DOWNKEY, Settings.LEFTKEY, Settings.RIGHTKEY);

			FlxControl.player1.setJumpButton(controls["JUMP"], FlxControlHandler.KEYMODE_PRESSED, Settings.PLAYERJUMP, FlxObject.FLOOR, 250, 200);
			// FlxControl.player1.setGravity(0, Settings.DEFAULTPLAYERGRAV);
			FlxControl.player1.setMovementSpeed(Settings.PLAYERSPEED, 0, Settings.PLAYERMAXVELOCITY, Settings.PLAYERMAXFALLSPEED, Settings.PLAYERDECCELERATION, 0);

			FlxControl.player1.setCursorControl(false, false, true, true);

			bodyDef.type = b2Body.b2_dynamicBody;
		}

		private function onFinishCooldown(t : FlxTimer) : void {
			canSwap = true;
			t.stop();
		}

		public function setOnKill(callback : Function) : void {
			this.onKillCallback = callback;
		}

		public function setOnExit(callback : Function) : void {
			this.onExitCallback = callback;
		}

		public function exitLevel(warpToLevel : String) : void {
			if (onExitCallback != null) {
				onExitCallback(warpToLevel);
			}
		}

		public function swap(swapObject : PhysicalBody) : void {
			if (swapObject.swappable && canSwap) {
				// linear velocities
				var tmpLin : FlxPoint = new FlxPoint();
				velocity.copyTo(tmpLin);
				velocity.x = swapObject.body.GetLinearVelocity().x;
				velocity.y = swapObject.body.GetLinearVelocity().y;
				swapObject.body.SetLinearVelocity(new b2Vec2(tmpLin.x / Settings.ratio, tmpLin.y / Settings.ratio));

				var tmpPos : b2Vec2 = body.GetPosition().Copy();
				body.SetPosition(swapObject.body.GetPosition());
				swapObject.body.SetPosition(tmpPos);

				// Prevents freezing in midair
				swapObject.body.SetAwake(true);

				FlxG.state.add(new SwapTrail(x - width / 2, y - height / 2));

				x = (body.GetPosition().x * Settings.ratio) - width / 2;
				y = (body.GetPosition().y * Settings.ratio) - height / 2;

				FlxG.state.add(new SwapTrail(x - width / 2, y - height / 2));

				// Start cooldown
				canSwap = false;
				swapCooldownTimer.start(Settings.SWAPCOOLDOWN, 0, onFinishCooldown);
			}
		}

		private function addTouchSensor() : void {
			fixtureDefs[3] = new b2FixtureDef();
			var touchSensorDef : b2PolygonShape = new b2PolygonShape();

			if (swapTouchSensorSprite.exists) {
				swapTouchSensorSprite.kill();
			}

			swapTouchSensorSprite = new SwapAreaSprite(x, y, this);
			FlxG.state.add(swapTouchSensorSprite);

			touchSensorDef.SetAsBox(Settings.TOUCHSENSORRADIUS, Settings.TOUCHSENSORRADIUS);
			// touchSensorDef.SetLocalPosition(new b2Vec2(width / Settings.ratio / 3.0, height / Settings.ratio / 3.0));
			fixtureDefs[3].shape = touchSensorDef;
			fixtureDefs[3].isSensor = true;
			fixtureDefs[3].userData = this;
			fixtures[3] = body.CreateFixture(fixtureDefs[3]);
		}

		private function removeTouchSensor() : void {
			swapTouchSensorSprite.kill();

			body.DestroyFixture(fixtures[3]);
		}

		override public function update() : void {
			super.update2();

			if (FlxG.keys.justPressed(controls["JUMP"])) {
				jump();
			}

			if (FlxG.keys.justPressed(controls["SWAP"]) && tempSwapObject != null) {
				// WARNING: order IS important
				PhysicsUtil.enqueueSwap(tempSwapObject, this);
			}

			if (FlxG.keys.justPressed(controls["TOUCHSWAP"])) {
				addTouchSensor();
			}

			if (FlxG.keys.justReleased(controls["TOUCHSWAP"])) {
				removeTouchSensor();
			}

			// checking where is the player in order to play soaunds and sprite
			if (!isTouching(FlxObject.FLOOR)) {
				if (velocity.y > 0) {
					play("fall");
					// trace("falling");
				} else if (velocity.y < 0) {
					play("jump");
					// trace("Goin up");
				}
			} else if (Math.abs(velocity.x) > 0.1) {
				play("move");
				FlxG.play(Assets.step, 0.1);
			} else {
				play("idle");
				// FlxG.play(Assets.jump);
			}

			body.SetPosition(new b2Vec2((x + width / 2) / Settings.ratio, (y + height / 2) / Settings.ratio));
		}

		override public function onStartCollision(contact : b2Contact) : void {
			var collision : Vector.<b2Fixture> = identifyCollision(contact);
			var playerFixture : b2Fixture = collision[0];
			var otherFixture : b2Fixture = collision[1];
			var otherBody : PhysicalBody = otherFixture.GetUserData() as PhysicalBody;

			// kill on touch
			if (otherBody != null && otherBody.kills) {
				kill();
			}

			// if touchsensor collided
			if (playerFixture == fixtures[3] && otherBody != null && otherBody.swappable) {
				// deselect previous swap object
				if (tempSwapObject != null && tempSwapObject.selected) {
					tempSwapObject.selected = false;
				}
				if (!otherBody.selected) {
					tempSwapObject = otherBody;
					tempSwapObject.selected = true;
				}
			}
			
			// if feet sensor touched something, then player landed somewhere
			// fixtures[1] is the feet sensor 
			else if (playerFixture == fixtures[1] && !otherFixture.IsSensor()) {
				feetContactCount++;
				onLand();
			}
		}

		override public function onEndCollision(contact : b2Contact) : void {
			var collision : Vector.<b2Fixture> = identifyCollision(contact);
			var playerFixture : b2Fixture = collision[0];
			var otherFixture : b2Fixture = collision[1];

			if (playerFixture == fixtures[1] && !otherFixture.IsSensor()) {
				feetContactCount--;

				if (feetContactCount == 0) {
					onAir();
				}
			}
		}

		override public function onBeforeSolveCollision(contact : b2Contact, oldManifold : b2Manifold) : void {
			var collision : Vector.<b2Fixture> = identifyCollision(contact);
			var otherObject : PhysicalBody = collision[1].GetUserData() as PhysicalBody;

			if (otherObject != null) {
				if (!otherObject.affectsPlayer) {
					contact.SetEnabled(false);
				}
			}

			super.onBeforeSolveCollision(contact, oldManifold);
		}

		override public function onAfterSolveCollision(contact : b2Contact, impulse : b2ContactImpulse) : void {
			var appliedForce : Number = 0;

			appliedForce += impulse.normalImpulses[0] * FlxG.framerate;
			// force by impulse
			// appliedForce += otherBody.gravityVector.y * otherBody.body.GetMass(); // force by gravity * mass

//			trace("ouch: ", appliedForce);
			if (appliedForce > Settings.MAXFORCE) {
				kill();
				_dead = true;
			}
		}

		override public function kill() : void {
			super.kill();

			if (onKillCallback != null) {
				onKillCallback();
			}
		}

		override public function createPhysicsObject(world : b2World, properties : Array = null) : b2Body {
			var footSensorShape : b2PolygonShape = new b2PolygonShape();
			var boxDef : b2PolygonShape = new b2PolygonShape();
			const widthSizeRatio : Number = 1, heightSizeRatio : Number = 1;
			var w1 : Number = width * widthSizeRatio / Settings.ratio, 
			h1 : Number = height * heightSizeRatio / Settings.ratio;

			fixtureDefs[0] = new b2FixtureDef();
			// rectangle
			fixtureDefs[1] = new b2FixtureDef();
			// foot sensor
			fixtureDefs[2] = new b2FixtureDef();
			// bottom circle
			fixtureDefs[3] = new b2FixtureDef();
			// touch sensor

			boxDef.SetAsBox(w1 / 2.2, h1 / 3);
			fixtureDefs[0].shape = boxDef;

			var vertices : Array = new Array();
			vertices[0] = new b2Vec2(-w1 / 3, h1 / 2);
			vertices[1] = new b2Vec2(-w1 / 3, h1 / 2 + Settings.FOOTSENSORSIZE / Settings.ratio);
			vertices[2] = new b2Vec2(w1 / 3, h1 / 2 + Settings.FOOTSENSORSIZE / Settings.ratio);
			vertices[3] = new b2Vec2(w1 / 3, h1 / 2);
			footSensorShape.SetAsArray(vertices, 4);

			fixtureDefs[1].shape = footSensorShape;
			fixtureDefs[1].isSensor = true;
			fixtureDefs[1].userData = this;

			var circleDef : b2CircleShape = new b2CircleShape();

			circleDef.SetRadius(w1 / 2);
			circleDef.SetLocalPosition(new b2Vec2(0, h1 * 1.0 / 3.0));
			fixtureDefs[2].shape = circleDef;

			fixtureDefs[3] = new b2FixtureDef();
			var touchSensorDef : b2PolygonShape = new b2PolygonShape();

			touchSensorDef.SetAsBox(Settings.TOUCHSENSORRADIUS, Settings.TOUCHSENSORRADIUS);
			// touchSensorDef.SetLocalPosition(new b2Vec2(width / Settings.ratio / 3.0, height / Settings.ratio / 3.0));
			fixtureDefs[3].shape = touchSensorDef;
			fixtureDefs[3].isSensor = true;
			fixtureDefs[3].userData = this;

			// Creates the body
			super.createPhysicsObject(world, properties);

			removeTouchSensor();

			body.SetBullet(true);
			return body;
		}

		public function jump() : void {
		}

		/*
		 * WorldContactListener calls this function when the player just entered air space
		 */
		public function onAir() : void {
			setFriction(0);
			//grounded = false;
		}

		/*
		 * WorldContactListener calls this function when the player lands
		 */
		public function onLand() : void {
			setFriction(1);
			//grounded = true;
		}

		public function setFriction(friction : Number) : void {
			for each (var fixture : b2Fixture in fixtures) {
				fixture.SetFriction(friction);
			}
		}

		public function get dead() : Boolean {
			return _dead;
		}

		// This rotates the player and the controls if the gravity changes
		override public function set gravityVector(gravityVector : b2Vec2) : void {
			super.gravityVector = gravityVector;
			FlxControl.player1.setGravity(gravityVector.x * Settings.ratio, gravityVector.y * Settings.ratio);
		}
	}
}

