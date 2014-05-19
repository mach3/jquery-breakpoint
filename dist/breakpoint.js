/*!
 * jquery-breakpoint.js
 * --------------------
 * @version 0.1.0
 * @author mach3 <http://github.com/mach3>
 * @license MIT
 * @require jquery#1
 */
(function($){

    /**
     * Breakpoint
     * ----------
     * @class Watching the variable, trigger on breakpoint
     */
    var Breakpoint = function(){
        this._construct.apply(this, arguments);
    };

    (function(){
        var api = Breakpoint.prototype;

        api.EVENT_BREAK = "break";
        api.EVENT_CHANGE = "change";

        api.defaults = {
            eventName: null,
            eventTarget: null,
            interval: 33,
            points: [],
            target: $.noop
        };

        api.options = {};
        api.emitter = null;
        api.timer = null;
        api.value = null;
        api.index = null;

        /**
         * Constructor
         *
         * @constructor
         * @param {Object} options
         */
        api._construct = function(options){
            var my = this;

            // Configure
            this.options = {};
            this.config(this.defaults).config(options);

            // Event moethods
            this.emitter = $(this);
            $.each(["on", "off", "trigger"], function(i, name){
                my[name] = function(){
                    this.emitter[name].apply(this.emitter, arguments);
                    return this;
                };
            });

            // Bind
            this.run = $.proxy(this.run, this);
        };

        /**
         * Configure options
         * - .config(key, value); // Set a value
         * - .config(key); // Get a value
         * - .config(options); // Set values by object
         * - .config(); // Get all option values
         *
         * @param {String|Object} key|options
         * @param {*} value
         * @returns {Breakpoint|*|Object}
         */
        api.config = function(key, value){
            var args, my = this;

            args = arguments;
            switch($.type(key)){
                case "string":
                    if(args.length < 2){
                        return this.options[key];
                    }
                    this.options[key] = this._parse(key, value);
                    break;
                case "object":
                    $.each(args[0], function(key, value){
                        my.config(key, value);
                    });
                    break;
                case "undefined":
                    return this.options;
                default: break;
            }
            return this;
        };

        /**
         * Parse the option value
         *
         * @param {String} key
         * @param {*} value
         * @returns {*}
         */
        api._parse = function(key, value){
            if(key === "points"){
                if($.type(value) !== "array"){
                    throw new Error("Breakpoints: points should be array.");
                }
                return value.sort(function(a, b){
                    return a - b;
                });
            }
            if(key === "target" && ! $.isFunction(value)){
                throw new Error("Breakpoints: target should be function");
            }
            if(key === "eventTarget" && !! value){
                value = ("jquery" in value) ? value : $(value);
            }
            return value;
        };

        /**
         * Start watching process
         */
        api.watch = function(){
            var o = this.options;

            if(!! o.eventTarget && !! o.eventName){
                o.eventTarget.on(o.eventName, this.run);
                this.run();
            } else {
                this.timer = setInterval(this.run, o.interval);
            }
            return this;
        };

        /**
         * Stop watching process
         */
        api.unwatch = function(){
            var o = this.options;
            if(!! o.eventTarget && !! o.eventName){
                o.eventTarget.off(o.eventName, this.run);
            } else {
                clearInterval(this.timer);
            }
            return this;
        };

        /**
         * Process to observe the change of position
         * When value or index changed, trigger events.
         */
        api.run = function(){
            var value, pos;

            value = this.config("target")();
            if(this.value === value){
                return;
            }
            this.value = value;
            pos = this._getPosition(value);
            this.trigger(this.EVENT_CHANGE, pos);
            if(this.index !== pos.index){
                this.index = pos.index;
                this.trigger(this.EVENT_BREAK, pos);
            }
        };

        /**
         * Get position in "points" by value
         * Return an object which contains point value and index in "points"
         *
         * @param {Integer} value
         * @return {Object}
         */
        api._getPosition = function(value){
            var points, index = -1;
            
            points = this.config("points");
            $.each(points, function(i, point){
                if(value < point){ return false; }
                index = i;
            });
            return {
                point: points[index],
                index: index,
                value: value
            };
        };

    }());

    $.extend($, {
        Breakpoint: Breakpoint,
        breakpoint: function(options){
            return new $.Breakpoint(options);
        }
    });

}(jQuery));