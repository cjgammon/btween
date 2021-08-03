/**
 * tween class
 */
var Tween = /** @class */ (function () {
    function Tween(target, vars) {
        this.EasingFunctions = {
            linear: function (t) { return t; },
            // accelerating from zero velocity
            easeInQuad: function (t) { return t * t; },
            // decelerating to zero velocity
            easeOutQuad: function (t) { return t * (2 - t); },
            // acceleration until halfway, then deceleration
            easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
            // accelerating from zero velocity 
            easeInCubic: function (t) { return t * t * t; },
            // decelerating to zero velocity 
            easeOutCubic: function (t) { return (--t) * t * t + 1; },
            // acceleration until halfway, then deceleration 
            easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
            // accelerating from zero velocity 
            easeInQuart: function (t) { return t * t * t * t; },
            // decelerating to zero velocity 
            easeOutQuart: function (t) { return 1 - (--t) * t * t * t; },
            // acceleration until halfway, then deceleration
            easeInOutQuart: function (t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; },
            // accelerating from zero velocity
            easeInQuint: function (t) { return t * t * t * t * t; },
            // decelerating to zero velocity
            easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t; },
            // acceleration until halfway, then deceleration 
            easeInOutQuint: function (t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; },
            // bounce out
            bounceOut: function (t) {
                if (t < (1 / 2.75)) {
                    return (7.5625 * t * t);
                }
                else if (t < (2 / 2.75)) {
                    return (7.5625 * (t -= (1.5 / 2.75)) * t + .75);
                }
                else if (t < (2.5 / 2.75)) {
                    return (7.5625 * (t -= (2.25 / 2.75)) * t + .9375);
                }
                else {
                    return (7.5625 * (t -= (2.625 / 2.75)) * t + .984375);
                }
            }
        };
        this._id = Math.floor(Math.random() * 1000);
        this._startTime = Date.now();
        this._target = null;
        this._duration = 0;
        this._easingFunction = this.EasingFunctions.linear;
        this._startVars = {};
        this._endVars = {};
        this.completed = false;
        /**
         * Linear interpolation
         * @param v0 start value
         * @param v1 end value
         * @param t time
         * @returns number
         */
        this.lerp = function (v0, v1, t) {
            return v0 * (1 - t) + v1 * t;
        };
        this._target = target;
        this._duration = vars.duration * 1000; //to milli
        this._startTime = Date.now();
        if (vars.ease && this.EasingFunctions[vars.ease]) {
            this._easingFunction = this.EasingFunctions[vars.ease];
        }
        for (var i in vars) {
            if (target.hasOwnProperty(i)) {
                this._startVars[i] = target[i];
                this._endVars[i] = vars[i];
            }
        }
    }
    Tween.prototype.update = function () {
        var elapsed = (Date.now() - this._startTime) / this._duration;
        elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;
        var easeTime = this._easingFunction(elapsed);
        for (var i in this._endVars) {
            this._target[i] = this.lerp(this._startVars[i], this._endVars[i], easeTime);
        }
        if (elapsed == 1) {
            this.completed = true;
        }
    };
    return Tween;
}());
/**
 * Tween Manager class
 */
var Tw = /** @class */ (function () {
    function Tw() {
    }
    Tw.to = function (target, vars) {
        var tw = new Tween(target, vars);
        this.tweens.push(tw);
    };
    Tw.set = function (target, vars) {
        for (var i in vars) {
            if (target.hasOwnProperty(i)) {
                target[i] = vars[i];
            }
        }
    };
    Tw.fromTo = function (target, fromVars, toVars) {
        this.set(target, fromVars);
        this.to(target, toVars);
    };
    Tw.update = function () {
        var i = this.tweens.length;
        while (i--) {
            var tween = this.tweens[i];
            if (tween.completed) {
                this.tweens.splice(i, 1);
            }
            else {
                tween.update();
            }
        }
    };
    Tw.tweens = [];
    return Tw;
}());
