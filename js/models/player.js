GameApp.Player = {
    x: null,        // координата по x
    y: null,        // координата по y
    w: null,        // ширина
    h: null,        // высота

    dx: null,       // скорость по x
    dy: null,       // скорость по y
    ddx: null,      // ускорение по x
    ddy: null,      // ускорение по у

    gravity: null,  // сила тяжести
    maxdx: null,    // максмальная скорость игрока по горизонтали
    maxdy: null,    // максмальная скорость игрока по вертикали
    climbdy: null,  // скорость набора высоты игрока
    impulse: null,  // импульс при прыжке игрока
    accel: null,    // горизонтальное ускорение
    friction: null, // горизонтальное трение

    animation: {},  // объект свойств для анимации

    input: {},      // состояния игрока

    collision: {},  // точки столкновения

    stepping: null, // идет (как по ступенькам)
    falling: null,  // падает
    hurting: null,  // состояние столкновения
    climbing: null, // состояние подьема/спуска

    score: 0,       // счет

    initialize: function () {

        // по умолчанию игрок стоит на середине первой ячейки
        this.x = Utils.data.col2x(0.5);
        this.y = Utils.data.row2y(0);

        this.w = GameApp.Const.PLAYER_WIDTH;
        this.h = GameApp.Const.PLAYER_HEIGHT;
        this.dx = 0;
        this.dy = 0;

        this.gravity = GameApp.Const.METER * GameApp.Const.GRAVITY;
        this.maxdx = GameApp.Const.METER * GameApp.Const.MAXDX;
        this.maxdy = GameApp.Const.METER * GameApp.Const.MAXDY;
        this.climbdy = GameApp.Const.METER * GameApp.Const.CLIMBDY;
        this.impulse = GameApp.Const.METER * GameApp.Const.IMPULSE;
        this.accel = this.maxdx / GameApp.Const.ACCEL;
        this.friction = this.maxdx / GameApp.Const.FRICTION;

        this.input = {
            left: false,          // движение влево
            right: false,         // движение вправо
            up: false,            // движение вверх
            down: false,          // движение вниз
            jump: false,          // прыжок
            jumpAvailable: true   // готовность к прыжку
        };

        this.collision = this.createCollisionPoints();
        this.animation = GameApp.Const.PLAYER.STAND;
        this.score = 0;
    },

    /**
     *  Создаем точки столкновения (8 точек столкновения для платформы и еще две для лестницы)
     */
    createCollisionPoints: function () {
        return {
            topLeft: {x: -this.w / 4, y: this.h - 2},
            topRight: {x: this.w / 4, y: this.h - 2},
            middleLeft: {x: -this.w / 2, y: this.h / 2},
            middleRight: {x: this.w / 2, y: this.h / 2},
            bottomLeft: {x: -this.w / 4, y: 0},
            bottomRight: {x: this.w / 4, y: 0},
            underLeft: {x: -this.w / 4, y: -1},
            underRight: {x: this.w / 4, y: -1},
            ladderUp: {x: 0, y: this.h / 2},
            ladderDown: {x: 0, y: -1}
        }
    },

    /**
     *  Обновление игрока
     */
    update: function (dt) {

        this.animate();  // определяем нужную позицию в спрайте

        var wasleft = this.dx < 0;    // движется влево
        var wasright = this.dx > 0;   // движется вправо
        var falling = this.falling;   // падает
        var friction = this.friction * (this.falling ? 0.5 : 1);               // замедляется
        var accel = this.accel * (this.falling || this.climbing ? 0.5 : 1);    // ускоряется

        this.ddx = 0;
        this.ddy = falling ? -this.gravity : 0;

        // идет (как по ступенькам)
        if (this.stepping) {
            return this.stepUp();
        }

        // падает
        else if (this.hurting) {
            return this.hurt(dt);
        }

        // движение по лестнице
        if (this.climbing) {
            this.ddy = 0;
            if (this.input.up)
                this.dy = this.climbdy;
            else if (this.input.down)
                this.dy = -this.climbdy;
            else
                this.dy = 0;
        }

        // движется влево
        if (this.input.left) {
            this.ddx = this.ddx - accel;
        } else if (wasleft) {
            this.ddx = this.ddx + friction;
        }

        // движется вправо
        if (this.input.right) {
            this.ddx = this.ddx + accel;
        } else if (wasright) {
            this.ddx = this.ddx - friction;
        }

        // прыжок
        if (this.input.jump && (!falling || this.fallingJump)) {
            this.performJump();
        }

        this.updatePosition(dt);

        while (this.checkCollision()) {
        }

        if ((wasleft && (this.dx > 0)) || (wasright && (this.dx < 0))) {
            this.dx = 0;
        }

        if (this.falling && (this.fallingJump > 0))
            this.fallingJump = this.fallingJump - 1;

    },


    /**
     * Обновление позиции игрока
     * @param dt - промежуток времени
     */
    updatePosition: function (dt) {
        this.x = this.x + (dt * this.dx);
        this.y = this.y + (dt * this.dy);
        this.dx = Utils.math.bound(this.dx + (dt * this.ddx), -this.maxdx, this.maxdx);
        this.dy = Utils.math.bound(this.dy + (dt * this.ddy), -this.maxdy, this.maxdy);
    },

    /**
     * Падение
     * @param dt
     */
    hurt: function (dt) {
        if (this.hurting === true) {
            this.dx = -this.dx / 2;
            this.ddx = 0;
            this.ddy = this.impulse / 2;
            this.hurting = 60;
            this.hurtLeft = this.input.left;
        }
        else {
            this.ddy = -this.gravity;
            this.hurting = this.hurting - 1;
        }
        this.updatePosition(dt);
        if (this.y <= 0) {
            this.hurting = false;
            this.falling = false;
            this.y = 0;
            this.dy = 0;
        }
    },

    /**
     * Анимация игрока
      */
    animate: function () {
        // падение
        if (this.hurting) {
            GameApp.Game.animate(this, this.hurtLeft ? GameApp.Const.PLAYER.HURTL : GameApp.Const.PLAYER.HURTR);
        }

        // идет на лестнице
        else if (this.climbing && (this.input.up || this.input.down || this.input.left || this.input.right)) {
            GameApp.Game.animate(this, GameApp.Const.PLAYER.CLIMB);
        }

        // стоит на лестнице
        else if (this.climbing) {
            GameApp.Game.animate(this, GameApp.Const.PLAYER.BACK);
        }

        // идет влево
        else if (this.input.left || (this.stepping === GameApp.Const.DIR.LEFT)) {
            GameApp.Game.animate(this, GameApp.Const.PLAYER.LEFT);
        }

        // идет вправо
        else if (this.input.right || (this.stepping === GameApp.Const.DIR.RIGHT)) {
            GameApp.Game.animate(this, GameApp.Const.PLAYER.RIGHT);
        }

        else {
            GameApp.Game.animate(this, GameApp.Const.PLAYER.STAND);
        }
    },

    /**
     * Проверка столкновений
     * @returns {*}
     */
    checkCollision: function () {
        var player = GameApp.Game.getPlayer();

        var falling = this.falling,
            fallingUp = this.falling && (this.dy > 0),
            fallingDown = this.falling && (this.dy <= 0),
            climbing = this.climbing,
            climbingUp = this.climbing && this.input.up,
            climbingDown = this.climbing && this.input.down,
            runningLeft = this.dx < 0,
            runningRight = this.dx > 0,
            tl = this.collision.topLeft,
            tr = this.collision.topRight,
            ml = this.collision.middleLeft,
            mr = this.collision.middleRight,
            bl = this.collision.bottomLeft,
            br = this.collision.bottomRight,
            ul = this.collision.underLeft,
            ur = this.collision.underRight,
            ld = this.collision.ladderDown,
            lu = this.collision.ladderUp;


        //обновление точек столкновения
        this.updateCollisionPoint(tl);
        this.updateCollisionPoint(tr);
        this.updateCollisionPoint(ml);
        this.updateCollisionPoint(mr);
        this.updateCollisionPoint(bl);
        this.updateCollisionPoint(br);
        this.updateCollisionPoint(ul);
        this.updateCollisionPoint(ur);
        this.updateCollisionPoint(ld);
        this.updateCollisionPoint(lu);

        // собирать монеты
        if (tl.coin) return this.collectCoin(tl);
        else if (tr.coin) return this.collectCoin(tr);
        else if (ml.coin) return this.collectCoin(ml);
        else if (mr.coin) return this.collectCoin(mr);
        else if (bl.coin) return this.collectCoin(bl);
        else if (br.coin) return this.collectCoin(br);

        //описание столкновений
        if (fallingDown && bl.blocked && !ml.blocked && !tl.blocked && Utils.data.nearRowSurface(this.y + bl.y, bl.row))
            return this.collideDown(bl);

        if (player.x < 20 && (this.input.left || (this.stepping === GameApp.Const.DIR.LEFT)))
            return player.dx = 0;

        if (player.x > (GameApp.Game.getArena().w - 20) && (this.input.right || (this.stepping === GameApp.Const.DIR.RIGHT)))
            return player.dx = 0;

        if (fallingDown && br.blocked && !mr.blocked && !tr.blocked && Utils.data.nearRowSurface(this.y + br.y, br.row))
            return this.collideDown(br);

        if (fallingDown && ld.ladder && !lu.ladder)
            return this.collideDown(ld);

        if (fallingUp && tl.blocked && !ml.blocked && !bl.blocked)
            return this.collideUp(tl);

        if (fallingUp && tr.blocked && !mr.blocked && !br.blocked)
            return this.collideUp(tr);

        if (climbingDown && ld.blocked)
            return this.stopClimbing(ld);

        if (runningRight && tr.blocked && !tl.blocked)
            return this.collide(tr);

        if (runningRight && mr.blocked && !ml.blocked)
            return this.collide(mr);

        if (runningRight && br.blocked && !bl.blocked) {
            if (falling)
                return this.collide(br);
            else
                return this.startSteppingUp(GameApp.Const.DIR.RIGHT);
        }

        if (runningLeft && tl.blocked && !tr.blocked)
            return this.collide(tl, true);

        if (runningLeft && ml.blocked && !mr.blocked)
            return this.collide(ml, true);

        if (runningLeft && bl.blocked && !br.blocked) {
            if (falling)
                return this.collide(bl, true);
            else
                return this.startSteppingUp(GameApp.Const.DIR.LEFT);
        }

        var onLadder = (lu.ladder || ld.ladder) && Utils.data.nearColCenter(this.x, lu.col, GameApp.Const.LADDER_EDGE);

        if (!climbing && onLadder && ((lu.ladder && this.input.up) || (ld.ladder && this.input.down)))
            return this.startClimbing();
        else if (!climbing && !falling && !ul.blocked && !ur.blocked && !onLadder)
            return this.startFalling(true);

        if (climbing && !onLadder)
            return this.stopClimbing();

        // удар с монстром
        if (!this.hurting && (tl.enemy || tr.enemy || ml.enemy || mr.enemy || bl.enemy || br.enemy || lu.enemy || ld.enemy)) {
            return this.hitEnemy();
        }

        return false;
    },

    /**
     * Обновляем точку столкновения
     * @param point
     */
    updateCollisionPoint: function (point) {
        point.row = Utils.data.y2row(this.y + point.y);
        point.col = Utils.data.x2col(this.x + point.x);
        point.cell = GameApp.Game.getArena().getCell(point.row, point.col);
        point.blocked = point.cell.platform;
        point.platform = point.cell.platform;
        point.ladder = point.cell.ladder;
        point.enemy = false;
        point.coin = false;
        if (point.cell.enemy) {
            var enemy = point.cell.enemy;
            if (Utils.math.between(this.x + point.x, enemy.x + enemy.nx, enemy.x + enemy.nx + enemy.w) &&
                Utils.math.between(this.y + point.y, enemy.y + enemy.ny, enemy.y + enemy.ny + enemy.h)) {
                point.enemy = point.cell.enemy;
            }
        }
        if (point.cell.coin) {
            if (Utils.math.between(this.x + point.x, Utils.data.col2x(point.col + 0.5) - GameApp.Const.COIN.W / 2, Utils.data.col2x(point.col + 0.5) + GameApp.Const.COIN.W / 2) && +
                    Utils.math.between(this.y + point.y, Utils.data.row2y(point.row), Utils.data.row2y(point.row + 1))) {
                point.coin = true;
            }
        }
    },

    /**
     * Собираем монеты
     * @param point - ячейка
     */
    collectCoin: function (point) {
        point.cell.coin = false;
        this.score = this.score + 1;
    },

    /**
     * Падение
     * @param allowFallingJump  - возможность прыгать при падении
     */
    startFalling: function (allowFallingJump) {
        this.falling = true;
        this.fallingJump = allowFallingJump ? GameApp.Const.FALLING_JUMP : 0;
    },

    /**
     * Столкновение слева
     * @param point
     * @param left
     * @returns {boolean}
     */
    collide: function (point, left) {
        this.x = Utils.data.col2x(point.col + (left ? 1 : 0)) - point.x;
        this.dx = 0;
        return true;
    },

    collideSt: function () {
        this.x = 150;
        this.dx = 0;
        return true;
    },

    /**
     * Столкновение вверх
     * @param point
     */
    collideUp: function (point) {
        this.y = Utils.data.row2y(point.row) - point.y;
        this.dy = 0;
        return true;
    },

    /**
     * Столкновение снизу
     * @param point
     */
    collideDown: function (point) {
        this.y = Utils.data.row2y(point.row + 1);
        this.dy = 0;
        this.falling = false;
        return true;
    },

    /**
     * Прыжок
     */
    performJump: function () {
        if (this.climbing)
            this.stopClimbing();
        this.dy = 0;
        this.ddy = this.impulse;
        this.startFalling(false);
        this.input.jump = false;
    },

    /**
     * Устанавливаваем направление движения
     * @param dir
     */
    startSteppingUp: function (dir) {
        this.stepping = dir;
        this.stepCount = GameApp.Const.STEP.FRAMES;
        return false;
    },

    /**
     * Шагать
     */
    stepUp: function () {
        var left = (this.stepping === GameApp.Const.DIR.LEFT);
        var dx = GameApp.Const.STEP.W / GameApp.Const.STEP.FRAMES;
        var dy = GameApp.Const.STEP.H / GameApp.Const.STEP.FRAMES;

        this.dx = 0;
        this.dy = 0;
        this.x = this.x + (left ? -dx : dx);
        this.y = this.y + dy;

        if (--(this.stepCount) === 0) {
            this.stepping = GameApp.Const.DIR.NONE;
        }
    },

    /**
     * Начинаем подьем
     */
    startClimbing: function () {
        this.climbing = true;
        this.dx = 0;
    },

    /**
     * Завершаем подьем
     */
    stopClimbing: function (point) {
        this.climbing = false;
        this.dy = 0;
        this.y = point ? Utils.data.row2y(point.row + 1) : this.y;
        return true;
    },

    /**
     * Удар с врагом
     */
    hitEnemy: function () {
        this.hurting = true;
        return true;
    }
};
