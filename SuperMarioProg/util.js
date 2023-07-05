
// creates an alias for requestAnimationFrame for backwards compatibility
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        function ( callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// add global parameters here

const PARAMS = {
    DEBUG: true,
    SCALE: 3,
    BITWIDTH: 16
};
