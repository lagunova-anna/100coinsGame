//   отрисовка
GameApp.Renderer = {

    images: [],    // массив html-элементов img с ссылками на файлы изображений в src
    canvas: null,
    ctx: null,

    ground: {},
    sky: {},
    score: null,
    vscore: 0,

    initialize: function (images) {
        this.images = images;

        this.canvas = GameApp.CanvasGame.init(Utils.dom.get('canvas'), GameApp.Const.WIDTH, GameApp.Const.HEIGHT);
        this.ctx = this.canvas.getContext('2d');

        this.ground = this.createGround();
        this.sky = this.createSky();

        this.score = Utils.dom.get('score');

        this.vscore = 0;
    },

    render: function (dt) {
        var player = GameApp.Game.getPlayer();
        var camera = GameApp.Game.getCamera();
        var arena = GameApp.Game.getArena();

        // обновляем координаты игрока
        player.rx = Utils.math.lerp(player.x, player.dx, dt);
        player.ry = Utils.math.lerp(player.y, player.dy, dt);
        camera.rx = Utils.math.lerp(camera.x, camera.dx, dt);
        camera.ry = Utils.math.lerp(camera.y, camera.dy, dt);

        // не позволяет отображать игрока и камеру ниже области
        player.rx = Math.max(0, player.rx);
        camera.rx = Math.max(GameApp.Const.WIDTH / 2, camera.rx);
        camera.rx = Math.min(arena.w - GameApp.Const.WIDTH / 2, camera.rx);
        player.rx = Math.min(arena.w, player.rx);
        camera.ry = Math.max(0, camera.ry);

        this.ctx.clearRect(0, 0, GameApp.Const.WIDTH, GameApp.Const.HEIGHT);    // очищаем холст
        this.ctx.save();                                                        // сохраняем состояние
        this.ctx.translate(GameApp.Const.WIDTH / 2, 0);                         // смещаем начало координат в точку  (360, 0) - внизу по центру

        this.renderGround(this.ctx);      // рисуем землю по размеру камеры
        this.renderSky(this.ctx);         // рисуем небо
        this.renderFront(this.ctx);       // рисуем обстановку (лестницы, платформы, монеты и врагов)
        this.renderPlayer(this.ctx);      // рисуем пользователя
        this.renderScore(this.ctx);       // рисуем счет

        this.ctx.restore();               // восстанавливаем состояние,

        GameApp.Main.checkEndGame();      // каждый раз проверяем, закончилась ли игра

    },

    /**
     * Создаем небо (но не рисуем)
     */
    createSky: function () {
        var w = GameApp.Const.WIDTH * GameApp.Const.GROUND_SPEED,
            h = GameApp.Const.HEIGHT * 1.3,
            tile = this.images.sky,
            tw = tile.width,
            th = tile.height,
            max = Math.floor(w / tile.width),
            dw = w / max,
            image = GameApp.CanvasGame.render(w, h, function (ctx) {
                var n;
                for (n = 0; n < max; n++) {

                    ctx.drawImage(tile, 0, 0, tw, th, n * dw, 0, dw, h);
                    Utils.styles.setBorders(ctx, '#0040fc', n * dw, 0, dw, h);   // для дебага добавляем обводку для спрйтов
                }
            });
        return {w: w, h: h, image: image};
    },

    /**
     * Рисуем небо
     * @param ctx - контекст для рисования
     */
    renderSky: function (ctx) {
        var camera = GameApp.Game.getCamera();
        var arena = GameApp.Game.getArena();

        var sky = this.sky,
            x = sky.w * (camera.rx / arena.w),
            y = Utils.data.ty(0) - GameApp.Const.HEIGHT * 1.3,
            w = Math.min(GameApp.Const.WIDTH, sky.w - x),
            w2 = GameApp.Const.WIDTH - w;
        ctx.drawImage(sky.image, x, 0, w, sky.h, -GameApp.Const.WIDTH / 2 + 1, y, w, sky.h);

        if (w2 > 0) {

            ctx.drawImage(sky.image, 0, 0, w2, sky.h, -GameApp.Const.WIDTH / 2 + w, y, w2, sky.h);
        }

    },

    /**
     * Создаем землю (но не рисуем)
     */
    createGround: function () {
        var w = GameApp.Const.WIDTH * GameApp.Const.GROUND_SPEED;
        var h = GameApp.Const.GROUND;
        var tile = this.images.ground;
        var tw = tile.width;
        var th = tile.height;
        var max = Math.floor(w / tile.width);
        var dw = w / max;

        // здесь создаем тег <canvas> нужного размера и содержания (но не добавляем его в DOM)
        var image = GameApp.CanvasGame.render(w, h, function (ctx) {
                var n;
                for (n = 0; n < max; n++) {
                    ctx.drawImage(tile, 0, 0, tw, th, n * dw, 0, dw, h);

                    Utils.styles.setBorders(ctx, '#ffffff', n * dw, 0, dw, h);   // для дебага добавляем обводку для спрйтов
                }
            });

         return {w: w, h: h, image: image};
    },

    /**
     * Рисуем землю
     * @param ctx - контекст для рисования
     */
    renderGround: function (ctx) {
        var camera = GameApp.Game.getCamera();

        var ground = this.ground;
        var x = ground.w * (camera.rx / GameApp.Game.getArena().w);
        var y = Utils.data.ty(0);
        var w = Math.min(GameApp.Const.WIDTH, ground.w - x);
        var w2 = GameApp.Const.WIDTH - w;

        // принимает изображение ground.image, обрезает его до прямоугольника по ширине камеры и выводит в заданной точке
        ctx.drawImage(ground.image, x, 0, w, ground.h, -GameApp.Const.WIDTH / 2 + 1, y, w, ground.h);

        if (w2 > 0) {
            // принимает изображение ground.image, обрезает его до прямоугольника по ширине камеры и выводит в заданной точке
            ctx.drawImage(ground.image, 0, 0, w2, ground.h, -GameApp.Const.WIDTH / 2 + w, y, w2, ground.h);
        }

    },

    /**
     * Рисуем обстановку (лестницы, платформы, враги и монеты)
     * @param ctx - контекст для рисования
     */
    renderFront: function (ctx) {
        var camera = GameApp.Game.getCamera();

        var left = Utils.data.x2col(camera.rx - GameApp.Game.getArena().w / 4),
            center = Utils.data.x2col(camera.rx),
            right = Utils.data.x2col(camera.rx + GameApp.Game.getArena().w / 4);

        this.renderQuadrant(ctx, left, Utils.data.normalizeColumn(center + 0), +1);
        this.renderQuadrant(ctx, right, Utils.data.normalizeColumn(center - 1), -1);
    },


    /**
     * Рисуем квадрат (ячейку - в ней ничего, платформа, лестница, монета или враг)
     */
    renderQuadrant: function (ctx, min, max, dir) {
        var camera = GameApp.Game.getCamera();

        var r, y, cell,
            rmin = Math.max(0, Utils.data.y2row(camera.ry - GameApp.Const.GROUND) - 1),
            rmax = Math.min(GameApp.Game.getArena().rows - 1, rmin + (GameApp.Const.HEIGHT / GameApp.Const.ROW_HEIGHT + 1)),
            c = min;
        while (c !== max) {
            for (r = rmin; r <= rmax; r++) {
                y = Utils.data.ty(r * GameApp.Const.ROW_HEIGHT);
                cell = GameApp.Game.getArena().getCell(r, c);
                if (cell.platform)
                    this.renderPlatform(ctx, c, y);
                else if (cell.ladder)
                    this.renderLadder(ctx, c, y);
                else if (cell.coin)
                    this.renderCoin(ctx, c, y);
                if (cell.enemy)
                    this.renderEnemy(ctx, c, y, cell.enemy);
                
                var x = Utils.data.col2x(c + 0.5),
                    w = GameApp.Const.COL_WIDTH,
                    h = GameApp.Const.ROW_HEIGHT,
                    x0 = Utils.data.tx(x),
                    x1 = x0 - w / 2;

                Utils.styles.setDashedBorders(ctx, '#000000', x1, y - h, w, h);   // для дебага добавляем обводку для спрйтов

            }
            c = Utils.data.normalizeColumn(c + dir);
        }
    },

    /**
     * Рисуем  платформу
     */
    renderPlatform: function (ctx, col, y) {
        var platform = this.images.platform,
            x = Utils.data.col2x(col + 0.5),
            x0 = Utils.data.tx(x),
            x1 = x0 - GameApp.Const.COL_WIDTH / 2,
            x2 = x0 + GameApp.Const.COL_WIDTH / 2,
            w = x2 - x1,
            h = GameApp.Const.ROW_HEIGHT;

        ctx.drawImage(platform, x1, y - h, w, h);

        Utils.styles.setBorders(ctx, '#f3361c', x1, y - h, w, h);   // для дебага добавляем обводку для спрйтов
    },

    /**
     * Рисуем  лестницу
     */
    renderLadder: function (ctx, col, y) {

        var ladder = this.images.ladder,
            x = Utils.data.col2x(col + 0.5),
            x0 = Utils.data.tx(x),
            x1 = x0 - ladder.width / 2 + 10,
            x2 = x0 + ladder.width / 2 - 10,
            w = x2 - x1,
            ny = 4,
            h = GameApp.Const.ROW_HEIGHT + ny;

        ctx.drawImage(ladder, 0, 30, ladder.width, 30, x1, y - h, w, h);

        Utils.styles.setBorders(ctx, '#fbfc43', x1, y - h, w, h);   // для дебага добавляем обводку для спрйтов
    },

    /**
     * Рисуем  монеты
     */
    renderCoin: function (ctx, col, y) {

        var coins = this.images.coins,
            x = Utils.data.col2x(col + 0.5),
            w = GameApp.Const.COIN.W,
            h = GameApp.Const.COIN.H,
            x0 = Utils.data.tx(x),
            x1 = x0 - w / 2,
            x2 = x0 + w / 2;

        ctx.drawImage(coins, x1, y - h, w, h);

        Utils.styles.setBorders(ctx, '#66fc39', x1, y - h, w, h);   // для дебага добавляем обводку для спрйтов
    },

    /**
     * Рисуем врагов
     */
    renderEnemy: function (ctx, col, y, enemy) {
        var a = enemy.animation,
            x = Utils.data.tx(enemy.x) + enemy.nx,
            y = Utils.data.ty(enemy.y) + enemy.ny,
            w = enemy.w,
            h = enemy.h;

        ctx.drawImage(this.images.enemy, a.x + (enemy.animationFrame * a.w), a.y, a.w, a.h, x, y - h - 1, w, h);

        Utils.styles.setBorders(ctx, '#ff74fe', x, y - h - 1, w, h);   // для дебага добавляем обводку для спрйтов
    },

    /**
     * Рисуем игрока
     */
    renderPlayer: function (ctx) {
        var player = GameApp.Game.getPlayer();

        ctx.drawImage(this.images.player, player.animation.x + (player.animationFrame * player.animation.w), player.animation.y, player.animation.w, player.animation.h,
            Utils.data.tx(player.rx) - player.w / 2, Utils.data.ty(player.ry) - player.h, player.w, player.h);

        Utils.styles.setBorders(ctx, '#6dffff', Utils.data.tx(player.rx) - player.w / 2, Utils.data.ty(player.ry) - player.h, player.w, player.h);   // для дебага добавляем обводку для спрйтов
    },

    /**
     * Рисуем счет
     */
    renderScore: function (ctx) {
        var player = GameApp.Game.getPlayer();

        if (player.score > this.vscore) {
            this.vscore = this.vscore + 2;
            Utils.dom.set(this.score, this.vscore);
        }
    }

};
