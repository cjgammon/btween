
/**
 * tween class
 */
 class Tween {

    EasingFunctions = {
        linear: (t) => t,
        // accelerating from zero velocity
        easeInQuad: (t) => t*t,
        // decelerating to zero velocity
        easeOutQuad: (t) => t*(2-t),
        // acceleration until halfway, then deceleration
        easeInOutQuad: (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
        // accelerating from zero velocity 
        easeInCubic: (t) => t*t*t,
        // decelerating to zero velocity 
        easeOutCubic: (t) => (--t)*t*t+1,
        // acceleration until halfway, then deceleration 
        easeInOutCubic: (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
        // accelerating from zero velocity 
        easeInQuart: (t) => t*t*t*t,
        // decelerating to zero velocity 
        easeOutQuart: (t) => 1-(--t)*t*t*t,
        // acceleration until halfway, then deceleration
        easeInOutQuart: (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
        // accelerating from zero velocity
        easeInQuint: (t) => t*t*t*t*t,
        // decelerating to zero velocity
        easeOutQuint: (t) => 1+(--t)*t*t*t*t,
        // acceleration until halfway, then deceleration 
        easeInOutQuint: (t) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
        // bounce out
        bounceOut: (t) => {
            if (t < (1/2.75)) {
                return (7.5625*t*t) ;
            } else if (t < (2/2.75)) {
                return (7.5625*(t-=(1.5/2.75))*t + .75);
            } else if (t < (2.5/2.75)) {
                return (7.5625*(t-=(2.25/2.75))*t + .9375);
            } else {
                return (7.5625*(t-=(2.625/2.75))*t + .984375);
            }
        }
    }

    _id = Math.floor(Math.random() * 1000);
    _startTime = Date.now();
    _target = null;
    _duration = 0;
    _easingFunction = this.EasingFunctions.linear;
    _startVars = {};
    _endVars = {};
    completed = false;

    constructor(target, vars) {
        this._target = target;
        this._duration = vars.duration * 1000; //to milli
        this._startTime = Date.now();
        if (vars.ease && this.EasingFunctions[vars.ease]) {
            this._easingFunction = this.EasingFunctions[vars.ease];
        }

        for (let i in vars) {
            if (target.hasOwnProperty(i)) {
                this._startVars[i] = target[i];
                this._endVars[i] = vars[i];
            }
        }
    }

    update() {
        let elapsed = (Date.now() - this._startTime) / this._duration;
        elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;

        let easeTime = this._easingFunction(elapsed);

        for (let i in this._endVars) {
            this._target[i] = this.lerp(this._startVars[i], this._endVars[i], easeTime);
        }

        if (elapsed == 1) {
            this.completed = true;
        }
    }

    /**
     * Linear interpolation
     * @param v0 start value
     * @param v1 end value
     * @param t time 
     * @returns number
     */
    lerp = (v0: number, v1: number, t: number): number => {
        return v0 * (1 - t) + v1 * t;
    };
}

/**
 * Tween Manager class
 */
class Btween {

    static tweens = [];

    static to(target, vars) {
        let tw = new Tween(target, vars);
        this.tweens.push(tw);
    }

    static set(target, vars) {
        for (let i in vars) {
            if (target.hasOwnProperty(i)) {
                target[i] = vars[i];
            }
        }
    }

    static fromTo(target, fromVars, toVars) {
        this.set(target, fromVars);
        this.to(target, toVars);
    }

    static update() {
        let i = this.tweens.length;
        while (i-- ) {
            const tween = this.tweens[i];
            if (tween.completed) {
                this.tweens.splice(i, 1);
            } else {
                tween.update();
            }
        }
    }
}