GameApp.CanvasGame = (function() {

    var create = function (width, height) {
        return init(document.createElement('canvas'), width, height);
    };

    var init = function(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

    var render = function(width, height, render, canvas) {
        canvas = canvas || create(width, height);
        render(canvas.getContext('2d'), width, height);
        return canvas;
    };

    return {
        init: init,
        render: render
    }
})();