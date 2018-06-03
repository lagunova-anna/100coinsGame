GameApp.Const = {

    ajaxHandlerScript: "http://fe.it-academy.by/AjaxStringStorage2.php",  //переменная с адресом Ajax запросов
    ajaxUserName: "LAGUNOVA_TESTGAME",  //переменная с именем пользователя

    IMAGES: ['ground', 'ladder', 'sky', 'platform', 'player', 'enemy', 'coins'],   // спрайты изображений для загрузки

    WIDTH: 720,                      // ширина камеры (видимого поля игры)
    HEIGHT: 540,                     // высота камеры
    METER: 36,                       // метр - "единица измерения для игры", HEIGHT / 20
    COL_WIDTH: 108,                  // ширина колонки, METER * 3
    ROW_HEIGHT: 36,                  // высота колонки, METER
    GROUND: 108,                     // высота земли, HEIGHT / 5
    PLAYER_WIDTH: 54,                // ширина игрока, METER * 1.5
    PLAYER_HEIGHT: 72,               // высота игрока, METER * 2
    GROUND_SPEED: 2.3,               //
    GRAVITY: 9.8 * 4,                // сила тяжести (увеличена на 4)
    MAXDX: 10,                       // максмальная скорость игрока по горизонтали
    MAXDY: 18,                       // максмальная скорость игрока по вертикали
    CLIMBDY: 8,                      // скорость набора высоты игрока
    ACCEL: 1 / 4,                    // горизонтальное ускорение
    FRICTION: 0,                     // горизонтальное трение
    IMPULSE: 900,                    // импульс при прыжке игрока
    FALLING_JUMP: 60 / 5,            // параметр отвечает за возможность прыгать при падении
    LADDER_EDGE: 0.6,                // край лестницы
    ROW_SURFACE: 10.8,               // параметр для двойного прыжка, ROW_HEIGHT * 0.3

    COIN: {W: 36, H: 36},                                            // размеры монеты  (ROW_HEIGHT, ROW_HEIGHT)
    DIR: {NONE: 0, LEFT: 1, RIGHT: 2, UP: 3, DOWN: 4},               // возможные направления
    STEP: {FRAMES: 8, W: 10.8, H: 36},                               // передвижение игрока, W: COL_WIDTH / 10, H: ROW_HEIGHT
    KEY: {SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40},         // коды клавиш для управления

    // спрайты для анимации игрока
    PLAYER: {
        RIGHT: {x: 0, y: 0, w: 72, h: 96, frames: 5},
        STAND: {x: 1090, y: 0, w: 72, h: 96, frames: 1},
        LEFT: {x: 433, y: 0, w: 72, h: 96, frames: 5},
        BACK: {x: 795, y: 0, w: 72, h: 96, frames: 1},
        CLIMB: {x: 795, y: 0, w: 72, h: 96, frames: 2},
        HURTL: {x: 939, y: 0, w: 72, h: 96, frames: 1},    // падение влево
        HURTR: {x: 1011, y: 0, w: 72, h: 96, frames: 1}    // падение вправо
    },

    // размеры и свойства для анимации врагов (4 вида врагов)
    ENEMIES: [
        //паук по вертикали
        {
            name: "SPIDER_V",
            nx: -0.5,
            ny: -0.5,
            w: 1.2 * 36,   // 1.2 * METER
            h: 1.2 * 36,   // 1.2 * METER
            speed: 4 * 36, // 4 * METER
            dir: 'up',
            vertical: true,
            horizontal: false,
            animation: {
                up: {x: 0, y: 0, w: 50, h: 50, frames: 2},
                down: {x: 0, y: 0, w: 50, h: 50, frames: 2}
            }
        },
        //мышь
        {
            name: "FLY_MOUSE",
            nx: -0.5,
            ny: -0.5,
            w: 2 * 36,         // 2 * METER
            h: 1.7 * 36,       // 1.7 * METER
            speed: 2 * 36,     // 2 * METER
            dir: 'down',
            vertical: true,
            horizontal: false,
            animation: {
                up: {x: 112, y: 0, w: 67, h: 57, frames: 4},
                down: {x: 112, y: 0, w: 67, h: 57, frames: 4}
            }
        },
        //лягушка
        {
            name: "ANURAN",
            nx: -0.5,
            ny: 0.0,
            w: 1.5 * 36,      // 1.5 * METER
            h: 36,            // METER
            speed: 4 * 36,    // 4 * METER
            dir: 'right',
            vertical: false,
            horizontal: true,
            animation: {
                left: {x: 504, y: 11, w: 50, h: 28, frames: 2},
                right: {x: 504, y: 11, w: 50, h: 28, frames: 2}
            }
        },
        //паук по горизонтали
        {
            name: "SPIDER_G",
            nx: -0.5,
            ny: 0.0,
            w: 1.5 * 36,   // 1.5 * METER
            h: 36,         // METER
            speed: 2 * 36, // 2 * METER
            dir: 'left',
            vertical: false,
            horizontal: true,
            animation: {
                left: {x: 720, y: 9, w: 58, h: 32, frames: 2},
                right: {x: 720, y: 9, w: 58, h: 32, frames: 2}
            }
        }
    ]
};
