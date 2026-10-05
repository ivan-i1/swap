package org.dinosaurriders.swap {
	import Box2D.Collision.Shapes.b2CircleDef;
	import Box2D.Collision.Shapes.b2PolygonDef;
	import Box2D.Collision.Shapes.b2ShapeDef;
	import Box2D.Collision.b2AABB;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2DebugDraw;
	import Box2D.Dynamics.b2World;

	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;

	public class Swap extends Sprite {
        public var m_world:b2World;
        public var m_iterations:int = 10;
        public var m_timeStep:Number = 1.0/30.0;
      
        public var proporcion:Number=30;
		//public var player:b2Body, player2:b2Body;
      
        public function Swap(){
            crearMundo();
			crearCaja(0, 400, 550, 50, 0);
			crearCaja(450, 300, 100, 100, 0);
			crearCaja(150, 310, 20, 20, 10);
			crearCaja(0, 0, 10, 400, 0);
			crearCaja(540, 0, 10, 400, 0);
			
//			for (var y:Number = 0; y < 8; y++) {
//				for (var x:Number = 0; x < 3; x++) {
//					crearCaja(
//						x * 10 + 450, 
//						y * 20 + 200,
//						10, 10);
//				}
//			}
//          
            dibujar();
			
//			var spinningThing:b2RevoluteJointDef = new b2RevoluteJointDef();
//			spinningThing.body1 = crearCaja(300, 100, 20, 10, 0);
//			spinningThing.body2 = crearCaja(0, 0, 30, 10, 1);
//			
//			spinningThing.collideConnected = true;
//			
//			spinningThing.localAnchor1.Set(0, 0);
//			spinningThing.localAnchor2.Set(0 / proporcion, 200 / proporcion);
//			
//			spinningThing.referenceAngle = 0;
//			spinningThing.enableMotor = true;
//			spinningThing.maxMotorTorque = 200;
//			spinningThing.motorSpeed = 50;
//			
//			m_world.CreateJoint(spinningThing);
          
            stage.addEventListener(Event.ENTER_FRAME, Update, false, 0, true);
			
			//stage.addEventListener(MouseEvent.CLICK, mouseClick);
          	//stage.addEventListener(KeyboardEvent.KEY_DOWN, move);
			//m_world.SetContactListener(new HitListener());
        }
      
        private function dibujar(){
            var miDibujo:Sprite=new Sprite();
            addChild(miDibujo);
          
            var borrador:b2DebugDraw=new b2DebugDraw();
            borrador.m_sprite=miDibujo;
            borrador.m_drawScale=proporcion;
            borrador.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            borrador.m_lineThickness=3;
            borrador.m_fillAlpha=0.8;
          
            m_world.SetDebugDraw(borrador);
        }
      
        private function crearPelota(x0:Number, y0:Number, fx:Number, fy:Number){
            var bodyDef:b2BodyDef;
			var shapeDef:b2ShapeDef;
            var circleDef:b2CircleDef, boxDef:b2PolygonDef;
			var theSize:Number = 10;
			
			//if (Math.random() < 0.5) {
				circleDef = new b2CircleDef();			
				circleDef.radius = theSize/proporcion;
				shapeDef = circleDef;
			/*}
			else {
				boxDef = new b2PolygonDef();
				boxDef.SetAsBox(theSize/proporcion, theSize/proporcion);
				shapeDef = boxDef;
			}*/
			
			shapeDef.density = 1;
			shapeDef.restitution = 0.9;
			
			bodyDef = new b2BodyDef();
			bodyDef.userData = new Player(0, 0, theSize);
			addChild(bodyDef.userData);
			
			bodyDef.position.Set(x0/proporcion, y0/proporcion);
			
//			player2 = player;
//			player = m_world.CreateBody(bodyDef);
//			player.CreateShape(shapeDef);
//			player.SetMassFromShapes();
//			
//			player.SetLinearVelocity(new b2Vec2(fx, fy));
        }
		
		private function crearCaja(x:Number, y:Number, ancho:Number, alto:Number, density:Number = 1):b2Body {
			var body:b2Body;
            var bodyDef:b2BodyDef;
            var boxDef:b2PolygonDef;
			
			boxDef = new b2PolygonDef();
			boxDef.SetAsBox(ancho/proporcion, alto/proporcion);
			
			boxDef.density = density;
			
			bodyDef = new b2BodyDef();
			
			bodyDef.userData = new Wall(-ancho, -alto, ancho * 2, alto * 2);
			addChild(bodyDef.userData);
			
			bodyDef.position.Set(x/proporcion, y/proporcion);
			
			body = m_world.CreateBody(bodyDef);
			body.CreateShape(boxDef);
			body.SetMassFromShapes();
			
			return body;
		}
      
        private function crearMundo(){          
            //Rectángulo del mundo
            var worldAABB:b2AABB = new b2AABB();
            worldAABB.lowerBound.Set(-600.0/proporcion, -600.0/proporcion);
            worldAABB.upperBound.Set(600.0/proporcion, 600.0/proporcion);
          
            // Definir vector de gravedad
            var gravity:b2Vec2 = new b2Vec2(0.0, 10.0);
          
            // Para no generar simulación en objetos en reposo.
            var doSleep:Boolean = true;
          
            // Crear el mundo de la simulación
            m_world = new b2World(worldAABB, gravity, doSleep);
		}
		
		public function mouseClick(e:MouseEvent):void {
			var x0:Number = 100, y0:Number = 350, forceModifier:Number = 0.1;
			var x:Number = e.stageX, 
				fx:Number = Math.abs(e.stageX - x0), 
				fy:Number = Math.abs(e.stageY - y0); 
				
			var a:Number = Math.atan((y0 - e.stageY) / (e.stageX - x0));
			
			crearPelota(x0, y0, fx * forceModifier * Math.cos(a), fy * forceModifier * -Math.sin(a));
		}
      
        public function Update(e:Event):void{
          
            //Para correr la simulación
            m_world.Step(m_timeStep, m_iterations);
			
            // Go through body list and update sprite positions/rotations
            for (var bb:b2Body = m_world.m_bodyList; bb; bb = bb.m_next){
                if (bb.m_userData is Sprite){
                    //trace(bb.m_userData);
                    //trace(bb.m_userData.y);
                    //trace(bb.GetPosition().y);
                    //trace(bb.m_userData.y);
                    
                    bb.m_userData.x = bb.GetPosition().x * proporcion;
                    bb.m_userData.y = bb.GetPosition().y * proporcion;
                    bb.m_userData.rotation = bb.GetAngle() * (180/Math.PI);
                }
            }
			
            //m_world.DrawDebugData();
        }
		
//		public function move(e:KeyboardEvent):void {
//			switch (e.keyCode) {
//				case Keyboard.UP:
//				player.ApplyImpulse(new b2Vec2(0, -1), new b2Vec2(0, 0));
//				break;
//				
//				case Keyboard.DOWN:
//				player.ApplyImpulse(new b2Vec2(0, 1), new b2Vec2(0, 0));
//				break;
//				
//				case Keyboard.LEFT:
//				player.ApplyImpulse(new b2Vec2(-1, 0), new b2Vec2(0, 0));
//				break;
//				
//				case Keyboard.RIGHT:
//				player.ApplyImpulse(new b2Vec2(1, 0), new b2Vec2(0, 0));
//				break;
//				
//				case Keyboard.SPACE:
//				trace("swap");
//				var temp:b2Vec2 = player.GetPosition().Copy();
//				player.SetXForm(player2.GetPosition().Copy(), 0);
//				player2.SetXForm(temp, 0);
//				player
//				break;
//			}
//		}
	}
}
