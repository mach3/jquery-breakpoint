
# jquery-breakpoint

Watch a variable, trigger on breakpoint.
This may be useful for JS-based responsive page or page which has scroll animation.

## Features

- When variable leap over a breakpoint, trigger 'break' event
- Configurable event object and event name
  (If not configured, use setInterval)

## Usage

```javascript
var bp;
// Initialize instance
bp = new $.Breakpoint();
// or
bp = $.breakpoint();

// Configure
bp.config({
	// "points" is an array of breakpoints
	points: [100, 200, 300, 400, 500],
	// "target" is a function which returns the value to be observed
	target: function(){
		return $(window).scrollTop();
	}
});

// Set handler
// Event object and position object will be passed as arguments
bp.on("break", function(e, pos){
	console.log(pos);
	// 'pos' is object having props below
	// {
	//   "index": 0, // Index in breakpoints
	//   "value": 123, // Current value
	//   "point": 100 // Current point
	// }
});

// Start watching
bp.watch();
```

## Options

```javascript
bp.config({
	eventTarget: $(window),
	eventName: "resize",
	points: [320, 480, 568, 768, 1024, 1280],
	target: function(){
		return $(window).width();
	}
});
```

- **eventTarget :Object (null)**  
  Object which dispatch event
- **eventName :String (null)**  
  Event name
- **points :Array ([])**  
  Values for breakpoints
- **target :Function ($.noop)**  
  Function to return the value to be observed
- **interval :Integer (33)**  
  millisecond time for interval

If eventTarget or eventName is `null`, this uses `setInterval` for processing.

## Methods 

- **config([key|values, [value]])**
  Configure option(s)
- **watch()**
  Start watching
- **unwatch()**
  Stop watching
- **on/off/trigger()**  
  Aliace of jQuery.fn.on/off/trigger

## Events

- **change**  
  Fired when variable is changed
- **break**  
  Fired when variable leap over the breakpoint

