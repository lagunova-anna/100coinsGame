var Utils = {

    class: {
        create: function (prototype) {
            var ctor = function () {
                if (this.initialize)
                    return this.initialize.apply(this, arguments);
            };
            ctor.prototype = prototype || {};
            return ctor;
        }
    },

    // утилиты для работы с DOM
    dom: {
        get:
            function (id) {
                return ((id instanceof HTMLElement) || (id === document)) ? id : document.getElementById(id);
            },
        getByClass:
            function (className) {
                return document.getElementsByClassName(className)
            },
        getByTagName:
            function (tagName) {
                return document.getElementsByTagName(tagName)
            },
        set:
            function (id, html) {
                this.get(id).innerHTML = html;
            },
        on:
            function (elem, type, fn, capture) {

                console.log('addEventListener ', type);

                this.get(elem).addEventListener(type, fn, capture);
            },
        un:
            function (elem, type, fn, capture) {

            console.log('removeEventListener ', type);

                this.get(elem).removeEventListener(type, fn, capture);
            },
        show:
            function (elem, type) {
                this.get(elem).style.display = (type || 'block');
            }
    },

    // утилиты для работы с стилями
    styles: {
        toggleClass:
            function (elem, className, force) {
                if (elem) {
                    elem.classList.toggle(className, force);
                }
            },

        setBorders:
            function (ctx, color, x, y, w, h) {
                if (GameApp.Main.debugMode) {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, w, h);
                }
            },

        setDashedBorders:
            function (ctx, color, x, y, w, h) {
                if (GameApp.Main.debugMode) {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 0.3;
                    ctx.strokeRect(x, y, w, h);
                }
            }
    },

    //  Функциии нормализации (чтобы не выходили за пределы игрового поля)
    //  и конвертирования (координату в номер строки, столбца и наоборот)
    data: {
        normalizex : function normalizex(x) {
                return Utils.math.normalize(x, 0, GameApp.Game.getArena().w);
            },

        normalizeColumn: function normalizeColumn(col) {
                return Utils.math.normalize(col, 0, GameApp.Game.getArena().cols);
            },

        x2col: function x2col(x) {
                return Math.floor(this.normalizex(x) / GameApp.Const.COL_WIDTH);
            },

        y2row: function y2row(y) {
                return Math.floor(y / GameApp.Const.ROW_HEIGHT);
            },

        col2x: function col2x(col) {
                return col * GameApp.Const.COL_WIDTH;
            },

        row2y:  function row2y(row) {
                return row * GameApp.Const.ROW_HEIGHT;
            },

        tx: function tx(x) {
                x = this.normalizex(x - GameApp.Game.getCamera().rx);
                if (x > (GameApp.Game.getArena().w / 2)) {
                    x = -(GameApp.Game.getArena().w - x);
                }
                return x;
            },

        ty: function ty(y) {
                return GameApp.Const.HEIGHT - GameApp.Const.GROUND - (y - GameApp.Game.getCamera().ry);
            },

        nearColCenter: function nearColCenter(x, col, limit) {
                return limit > Math.abs(x - Utils.data.col2x(col + 0.5)) / (GameApp.Const.COL_WIDTH / 2);
            },

        nearRowSurface: function nearRowSurface(y, row) {
                return y > (Utils.data.row2y(row + 1) - GameApp.Const.ROW_SURFACE);
           }
    },

    // математические функции
    math: {
        lerp: function (n, dn, dt) {
            return n + (dn * dt);
        },

        timestamp: function () {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        },

        bound: function (x, min, max) {
            return Math.max(min, Math.min(max, x));
        },

        between: function (n, min, max) {
            return ((n >= min) && (n <= max));
        },

        normalize: function (n, min, max) {
            while (n < min)
                n += (max - min);
            while (n >= max)
                n -= (max - min);
            return n;
        }
    }
};

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
}





