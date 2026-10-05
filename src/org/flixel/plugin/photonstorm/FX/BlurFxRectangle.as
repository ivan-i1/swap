package org.flixel.plugin.photonstorm.FX {
	import org.flixel.FlxSprite;
	import org.flixel.plugin.photonstorm.FX.BaseFX;

	import flash.filters.BlurFilter;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	/**
	 * @author Mau
	 */
	public class BlurFxRectangle extends BaseFX
	{
		private var objects:Array;
		private var blurFilter:BlurFilter;
		private var currentSkipCount:int;
		private var blurSpeed:int;
		
		public function BlurFxRectangle() 
		{
		}
		
		/**
		 * Creates a new BlurFX the given width/height in size.<br>
		 * The blur X / Y / Quality parameters all control the strength of the effect.<br>
		 * Add the resulting FlxSprite to your display to see the effect.
		 * 
		 * @param	width			The width (in pixels) of the resulting FlxSprite containing the Blur effect
		 * @param	height			The height (in pixels) of the resulting FlxSprite containing the Blur effect
		 * @param	blurX			The amount of horizontal blur.
		 * @param	blurY			The amount of vertical blur.
		 * @param	blurQuality		The number of times to perform the blur. Default is 1 (fastest, single pass) up to a maxium of 15 (very VERY expensive!)
		 * 
		 * @return	An FlxSprite containing the updating blur effect
		 */
		public function create(x:int, y:int, width:int, height:int, blurX:Number, blurY:Number, blurQuality:int = 1, blurSpeed:int = 1):FlxSprite
		{
			sprite = new FlxSprite(x, y).makeGraphic(width, height, 0x0, true);
			sprite.alpha = 0.5;
			objects = new Array;
			
			blurFilter = new BlurFilter(blurX, blurY, blurQuality);
			
			copyPoint = new Point(0, 0);
			copyRect = new Rectangle(0, 0, width, height);
			
			this.blurSpeed = blurSpeed;
			
			return sprite;
		}
		
		/**
		 * Adds an FlxSprite to the BlurFX. Every loop this sprite will be drawn to the FX and then blurred if the FlxSprite is both onScreen() and visible.
		 * 
		 * @param	source		The FlxSprite to add to the blur effect
		 * @param	autoRemove	If true and the FlxSprite.exists value ever equals false then BlurFX will automatically remove it
		 */
		public function addSprite(source:FlxSprite, autoRemove:Boolean = true):void
		{
			objects.push( { sprite: source, autoRemove: autoRemove } );
			
			if (active == false)
			{
				active = true;
			}
		}
		
		/**
		 * Removes the FlxSprite from the effect
		 * 
		 * @param	source		The FlxSprite to remove from the blur effect
		 */
		public function removeSprite(source:FlxSprite):void
		{
			for (var i:int = 0; i < objects.length; i++)
			{
				if (objects[i].sprite == source)
				{
					objects.splice(i, 1);
					break;
				}
			}
		}
		
		public function draw():void
		{
			if (ready)
			{
				//	Write every object to the canvas
				for each (var obj:Object in objects)
				{
					//	Removal check
					if (obj.sprite.exists == false)
					{
						removeSprite(obj.sprite);
					}
					else
					{
						if (obj.sprite.visible && obj.sprite.onScreen())
						{
							sprite.stamp(obj.sprite, obj.sprite.x - sprite.x, obj.sprite.y - sprite.y);
						}
					}
				}
				
				//	We'll use the update timer to control how often the blur is run, not how often the objects are drawn
				if (lastUpdate != updateLimit)
				{
					lastUpdate++;
					
					return;
				}
				
				//	Then blur it
				if (currentSkipCount++ >= blurSpeed) {
					currentSkipCount = 0;
					sprite.pixels.applyFilter(sprite.pixels, copyRect, copyPoint, blurFilter);
				}
				
				lastUpdate = 0;
				
				sprite.dirty = true;
			}
		}
	}
}
