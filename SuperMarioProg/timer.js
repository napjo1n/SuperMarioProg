// Googler Seth Ladd's "Bad Aliens"

class Timer {
    constructor() {
        this.gameTime = 0;
        this.maxStep = 0.05;
        this.lastTimestamp = 0;
    };

    tick() {
        var current = Date.now();
        var delta = (current - this.lastTimestamp) / 1000; // convert milliseconds to seconds
        this.lastTimestamp = current;

        var gameDelta = Math.min(delta, this.maxStep);
        this.gameTime += gameDelta;
        return gameDelta;
    };
};
