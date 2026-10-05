package org.dinosaurriders.swap.levels
{
	import org.flixel.FlxGroup;

	import org.flixel.FlxPoint;

	public class ShapeData
	{
		public var x:Number;
		public var y:Number;
		public var group:FlxGroup;

		public var scrollFactor:FlxPoint = new FlxPoint();

		public function ShapeData(X:Number, Y:Number, Group:FlxGroup )
		{
			x = X;
			y = Y;
			group = Group;
		}

		public function destroy():void
		{
			group = null;
		}
	}
}
