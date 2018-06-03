GameApp.Game = (function() {
    var now;
    var dt = 0;
    var last = Utils.math.timestamp();
    var step = 1 / 60;

    var arena;
    var camera;
    var enemies;
    var player;
    var renderer;

    /**
     * Один цикл игры (обновление, отрисовка)
     */
    var frame =  function() {
        now = Utils.math.timestamp();

        dt = dt + Math.min(1, (now - last) / 1000);

        while (dt > step) {
            dt = dt - step;
            update(step);
        }
        render(dt);
        last = now;

        if (GameApp.Main.getFlagGame()) {
            requestAnimationFrame(frame);    // запускаем цикл игры
        }
    };

    /**
     *  Обновление состояния
     */
    function update(dt) {
        player.update(dt);
        enemies.update(dt);
        camera.update(dt);
    }

    /**
     *  Отрисовка
     */
    function render(dt) {
        renderer.render(dt);
    }

    /**
     *  Запуск игры
     */
    var run = function () {
        frame();
    };

    /**
     * Анимация персонажей в игре
     */
    var animate = function(entity, animation) {
        animation = animation || entity.animation;
        entity.animationFrame = entity.animationFrame || 0;
        entity.animationCounter = entity.animationCounter || 0;
        if (entity.animation !== animation) {
            entity.animation = animation;
            entity.animationFrame = 0;
            entity.animationCounter = 0;
        }
        else if (++(entity.animationCounter) === 5) {
            entity.animationFrame = Utils.math.normalize(entity.animationFrame + 1, 0, entity.animation.frames);
            entity.animationCounter = 0;
        }
    };


    /**
     * Создание игры
     * @param images - массив из html-элементов img с соответствующим src
     */
    var createGame = function(images) {
        // создаем необходимые классы
        var Arena =  Utils.class.create(GameApp.Arena);
        var Enemies = Utils.class.create(GameApp.Enemies);
        var Player = Utils.class.create(GameApp.Player);
        var Camera = Utils.class.create(GameApp.Camera);
        var Renderer =  Utils.class.create(GameApp.Renderer);

        // создаем экземпляры классов
        arena = new Arena();
        enemies = new Enemies();
        player = new Player();
        camera = new Camera();
        renderer = new Renderer(images);
    };


    /**
     * Загружаем картинки из спрайтов  (т.е. создаем массив из html-элементов img с соответствующим src)
     * @param names   - массив наименований файлов
     * @param callback
     */
    var loadImages = function(names, callback) {
        var n;
        var name;
        var result = {};
        var count = names.length;
        var onLoad = function () {
            if (--count === 0) {
                callback(result)
            }
        };

        for (n = 0; n < names.length; n++) {
            name = names[n];
            result[name] = document.createElement('img');
            Utils.dom.on(result[name], 'load', onLoad);
            result[name].src = "images/" + name + ".png";
        }
    };

    return {
        createGame: createGame,
        run: run,
        animate: animate,
        loadImages: loadImages,

        getArena: function() {
            return arena;
        },

        getRenderer: function() {
            return renderer;
        },

        getPlayer: function() {
            return player;
        },

        getCamera: function() {
            return camera;
        }
    }
})();