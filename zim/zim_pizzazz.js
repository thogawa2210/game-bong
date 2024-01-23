// ZIM - https://zimjs.com - Code Creativity!
// JavaScript Canvas Framework for General Interactive Media
// free to use - donations welcome of course! https://zimjs.com/donate

// ZIM PIZZAZZ 3 - see https://zimjs.com/code#libraries for examples

// ~~~~~~~~~~~~~~~~~~~~~~~~
// DESCRIPTION - coded in 2018 (c) ZIM
// Pizzazz 3 is a helper module for ZIM that adds patterns!
// SEE also Pizzazz for background shapes and Pizzazz 2 for icons

// VERSION 3 - Patterns for ProgressBar, Buttons, Panes, etc.
// See the ZIM Explore on Pizzazz 3 for an example: https://zimjs.com/explore/patterns.html

// import this js file in the top of your code below where you import createjs and zim
// you can get a custom pattern with pizzazz.makePattern() - this returns a Container with type "Pattern"
// Use this on its own or pass it into the backing parameter in zim.ProgressBar, zim.Button, zim.Pane, etc.
// pizzazz.listPatterns() will list your pattern options in the console

// DOCS
// Docs are provided at https://zimjs.com/docs.html
// See PIZZAZZ MODULE at bottom

var pizzazz = function(pizzazz) {

	// pixels, noise, dots, stripes, slants, hatch, plaid, bling
	pizzazz.makePattern = function(type, colors, size, cols, rows, spacingH, spacingV, interval, startPaused, backgroundColor, gradient, cache) {
		var duo; if (duo = zob(pizzazz.makePattern, arguments)) return duo;
		if (zot(type)) type = "pixels";
		type = type.toLowerCase();
		if (zot(colors)) colors = "black";
		if (zot(size)) size = 10;
		if (zot(cols)) cols = 30;
		if (zot(rows)) rows = 10;
		if (zot(spacingH)) spacingH = 0;
		if (zot(spacingV)) spacingV = 0;
		if (zot(interval)) interval = 0;
		if (zot(startPaused)) startPaused = false;
		if (zot(cache)) cache = type=="dots"?false:true;
		if (zot(gradient)) gradient = 0;

		var stage = (typeof zimDefaultFrame != "undefined" && zimDefaultFrame)?zimDefaultFrame.stage:null;

		if (Array.isArray(colors)) {
		   var patternLength = colors.length;
		} else if (colors.array) {
		   var patternLength = colors.array.length;
		} else {
		   var patternLength = 2;
		}

		// animations need extra tiling so keep the original bounds for masking
		var bounds = {x:0, y:0, width:size*cols, height:size*rows}

		obj = function() { // "pixels"
			return new zim.Rectangle({width:size,height:size,color:zik(colors),style:false}).alp(zim.rand());
		};
		if (type == "noise") {
			var obj = function() {
				return new zim.Rectangle({width:size,height:size,color:zik(colors),style:false});
			}
		} else if (type == "dots") {
			var obj = function() {
				return new Circle({radius:size,color:zik(colors),style:false});
			}
		} else if (type == "stripes") {
			obj = function() {
				var count = 0;
				return function() {
					var s = zik(size);
					if (typeof colors == "string") {
						count++;
						if (count%2==1) {
							return new zim.Rectangle({width:s,height:s*rows,color:zik(colors),style:false});
						} else {
							return new zim.Rectangle({width:s,height:s*rows,color:"rgba(0,0,0,.01)",style:false});
						}
					} else {
						return new zim.Rectangle({width:s,height:s*rows,color:zik(colors),style:false});
					}

				}
			}();
		} else if (type == "slants") {
			var extraCols = Math.ceil(Math.sqrt(rows*rows+cols*cols)); // not quite but good enough
			obj = function() {
				var count = 0;
				return function() {
					var s = zik(size);
					if (typeof colors == "string") {
						count++;
						if (count%2==1) {
							return new zim.Rectangle({width:s,height:s*extraCols,color:zik(colors),style:false});
						} else {
							return new zim.Rectangle({width:s,height:s*extraCols,color:"rgba(0,0,0,.01)",style:false});
						}
					} else {
						return new zim.Rectangle({width:s,height:s*extraCols,color:zik(colors),style:false});
					}

				}
			}();
		} else if (type == "hatch" || type == "plaid") {
			var extraCols = Math.ceil(Math.sqrt(rows*rows+cols*cols)); // not quite but good enough
			obj = function() {
				var count = 0;
				return function() {
					var s = zik(size);
					if (typeof colors == "string") {
						count++;
						if (count%2==1) {
							return new zim.Rectangle({width:s,height:s*extraCols,color:zik(colors),style:false});
						} else {
							return new zim.Rectangle({width:s,height:s*extraCols,color:"rgba(0,0,0,.01)",style:false});
						}
					} else {
						return new zim.Rectangle({width:s,height:s*extraCols,color:zik(colors),style:false});
					}

				}
			}();
		} else if (type == "bling") {
			var obj = function() {
				var s = new zim.Shape(-size/2, -size/2, size, size, null, false);
				s.graphics.f(zik(colors)).dp(0,0,size/2,8,.5,360/8/2);
				return s;
			}
		}

		var special = (type=="stripes"||type=="slants"||type=="hatch"||type=="plaid");
		var colsStart = cols;
		if (type=="plaid") cols = Math.max(cols, rows);
		if (interval > 0 && special) {
			if (type=="slants"||type=="hatch") {
				extraCols += patternLength*2; // extra for animating
			} else {
				cols += patternLength; // extra for animating
			}
		}

		var container = new zim.Tile(obj, (type=="slants" || type=="hatch")?extraCols:cols, special?1:rows, spacingH, spacingV);
		if (!zot(backgroundColor)) var background = container.background = new Rectangle({width:container.width,height:container.height,color:backgroundColor,style:false}).center(container, 0);

		if (type == "slants" || type == "hatch" || type == "plaid") {
			var outer = new zim.Container(size*(interval>0&&extraCols?extraCols:cols), size*rows, null, null, false);
			var inner = new zim.Container(size*(interval>0&&extraCols?extraCols:cols), size*rows, null, null, false).centerReg(outer);
			var mask = new zim.Rectangle({width:size*(interval>0&&extraCols?extraCols:cols),height:size*rows,color:"rgba(0,0,0,0)",style:false}).addTo(outer);
			container.centerReg(inner);
			if (type == "plaid" || type == "hatch") {
				var copy = container.clone().centerReg(inner).rot(90);
				copy.blendMode = "overlay";
			}
			if (type != "plaid") inner.rotation = 45;
			inner.setMask(mask);
			container = outer;
			if (interval > 0 && (type=="slants" || type=="hatch")) {
				inner.x -= (container.width - bounds.width)/2;
			}
		}
		setGradient();
		if (cache || type=="hatch" || type=="plaid") container.cache();

		if (special && interval > 0) {
			var mask = new zim.Rectangle({width:bounds.width, height:bounds.height, color:"rgba(0,0,0,0)", style:false});
			container.addTo(mask);
			mask.pattern = container;
			container = mask;
			mask.pattern.setMask(mask.shape);
			var num = (type=="stripes" || type=="plaid")?size*patternLength:Math.ceil(size/5)*patternLength*7;
			container.added(function() {
				zog()
				container.pattern.animate({
					props:{x:"-"+String(num)},
					time:interval,
					loop:true,
					ease:"linear"
				});
				if (startPaused) {
					container.pattern.pauseAnimate();
					container.intervalPaused = true;
				} else {
					container.intervalPaused = false;
				}
			});
		} else if (interval > 0) {
			var outer = new zim.Container({style:false});
			container.addTo(outer);
			container = outer;
			container.zimInterval = zim.interval(interval, function() {
			    container.removeAllChildren();
			    var newTile = new zim.Tile(obj, (type=="slants" || type=="hatch")?extraCols:cols, special?1:rows, spacingH, spacingV).addTo(container);
				setGradient()
				if (!zot(backgroundColor)) var background = container.background = new Rectangle(container.width, container.height, backgroundColor).center(container, 0);
				if (cache) container.cache();
				if (container.stage) container.stage.update();
			});
			if (startPaused) {
				container.zimInterval.pause();
				container.intervalPaused = true;
			} else {
				container.intervalPaused = false;
			}
		}

		container.mouseChildren = false;
		container.type = "Pattern";
		container.patternType = type;
		container.patternInterval = interval;

		setGradient();
		if (gradient > 0 && container.cacheCanvas) container.updateCache();

		container.pauseInterval = function(type) {
			if (zot(type)) type = true;
			container.intervalPaused = type;
			if (container.patternInterval > 0) {
				if (container.zimInterval) {
					container.zimInterval.pause(type);
				} else if (container.pattern && container.pattern.pauseAnimate) {
					container.pattern.pauseAnimate(type);
				}
			}
		}
		container.clearInterval = function() {
			if (container.patternInterval > 0) {
				if (container.zimInterval) {
					container.zimInterval.clear();
				} else if (container.pattern && container.pattern.pauseAnimate) {
					container.pattern.stopAnimate();
				}
			}
			container.intervalPaused = null;
		}

		function setGradient() {
			if (gradient > 0) { // add an overlay
				var gr = new createjs.Shape();
				gr.graphics.lf(["rgba(255,255,255,"+gradient+")","rgba(0,0,0,"+gradient+")"], [0, 1], 0, 0, 0, container.height);
				gr.graphics.dr(0, 0, container.width, container.height);
				container.addChild(gr);
			}
		}
		container.centerReg(null,null,false);
		return container;
	}

	pizzazz.listPatterns = function() {
		zog("pixels", "noise", "dots", "stripes", "slants", "hatch", "plaid", "bling");
	}
	return pizzazz;
}(pizzazz || {});