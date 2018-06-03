GameApp.Control = (function() {

    // событие при нажатии клавиш
    var onKey = function (ev, key, pressed) {
        var player = GameApp.Game.getPlayer();

        switch (key) {
            case GameApp.Const.KEY.LEFT:       // движение влево
                player.input.left = pressed;
                ev.preventDefault();
                return false;

            case GameApp.Const.KEY.RIGHT:      // движение вправо
                player.input.right = pressed;
                ev.preventDefault();
                return false;

            case GameApp.Const.KEY.UP:         // движение вверх
                player.input.up = pressed;
                ev.preventDefault();
                return false;

            case GameApp.Const.KEY.DOWN:       // движение вниз
                player.input.down = pressed;
                ev.preventDefault();
                return false;

            case GameApp.Const.KEY.SPACE:      // прыжок
                player.input.jump = pressed && player.input.jumpAvailable;
                player.input.jumpAvailable = !pressed;
                ev.preventDefault();
                return false;
        }
    };


    var onKeyDownHandler = function (ev) {
        return onKey(ev, ev.keyCode, true);
    };

    var onKeyUpHandler = function (ev) {
        return onKey(ev, ev.keyCode, false);
    };


    /**
     *  Создание и запуск игры
     */
    var run = function() {
        GameApp.Game.loadImages(GameApp.Const.IMAGES, function (images) {

            GameApp.Game.createGame(images);
            GameApp.Game.run();

            Utils.dom.on(document, 'keydown', onKeyDownHandler, false);
            Utils.dom.on(document, 'keyup', onKeyUpHandler, false);
        });
    };

    return {
        run: run,
        onKeyDownHandler: onKeyDownHandler,
        onKeyUpHandler: onKeyUpHandler
    }

})();