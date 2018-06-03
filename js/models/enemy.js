GameApp.Enemy = {

    initialize: function (row, col, type) {

        this.row = row;
        this.col = col;
        this.x = Utils.data.col2x(col + 0.5);
        this.y = Utils.data.row2y(row);
        this.dx = 0;
        this.dy = 0;
        this.w = type.w;
        this.h = type.h;
        this.nx = type.nx * type.w;
        this.ny = type.ny * type.h;
        this.type = type;
        this[type.dir] = true;
        this.animation = type.animation[type.dir];

        //движется от возможной стенки сверху до возможной стенки снизу
        if (type.vertical) {
            this.minrow = row;
            this.maxrow = row;

            while ((this.minrow > 0) &&
                    !GameApp.Game.getArena().map[this.minrow - 1][col].platform &&
                    !GameApp.Game.getArena().map[this.minrow - 1][col].ladder)
                this.minrow--;

            while ((this.maxrow < GameApp.Game.getArena().rows - 1) &&
                    !GameApp.Game.getArena().map[this.maxrow + 1][col].platform  &&
                    !GameApp.Game.getArena().map[this.maxrow + 1][col].ladder)
                this.maxrow++;

            this.miny = Utils.data.row2y(this.minrow) + this.ny;
            this.maxy = Utils.data.row2y(this.maxrow + 1) + this.ny - this.h;
        }

        if (type.horizontal) {
            this.mincol = col;
            this.maxcol = col;

            while ((this.mincol !== Utils.data.normalizeColumn(col + 1)) &&
                   !GameApp.Game.getArena().getCell(row, this.mincol - 1).platform &&
                   !GameApp.Game.getArena().getCell(row, this.mincol - 1).ladder &&
                    GameApp.Game.getArena().getCell(row - 1, this.mincol - 1).platform)
                this.mincol = Utils.data.normalizeColumn(this.mincol - 1);

            while ((this.maxcol !== Utils.data.normalizeColumn(col - 1)) &&
                    !GameApp.Game.getArena().getCell(row, this.maxcol + 1).platform &&
                    !GameApp.Game.getArena().getCell(row, this.maxcol + 1).ladder &&
                     GameApp.Game.getArena().getCell(row - 1, this.maxcol + 1).platform)
                this.maxcol = Utils.data.normalizeColumn(this.maxcol + 1);

            this.minx = Utils.data.col2x(this.mincol) - this.nx;
            this.maxx = Utils.data.col2x(this.maxcol + 1) - this.nx - this.w;
            this.wrapx = this.minx > this.maxx;
        }

    },

    update: function (dt) {

        if (this.left)
            this.dx = -this.type.speed;
        else if (this.right)
            this.dx = this.type.speed;
        else
            this.dx = 0;

        if (this.up)
            this.dy = this.type.speed;
        else if (this.down)
            this.dy = -this.type.speed;
        else
            this.dy = 0;

        this.x = this.x + (dt * this.dx);
        this.y = this.y + (dt * this.dy);

        if (this.up && (this.y > this.maxy)) {
            this.y = this.maxy;
            this.up = false;
            this.down = true;
            this.animation = this.type.animation.down;
        }
        else if (this.down && (this.y < this.miny)) {
            this.y = this.miny;
            this.down = false;
            this.up = true;
            this.animation = this.type.animation.up;
        }

        if (this.left && (this.x < this.minx) && (!this.wrapx || this.x > this.maxx)) {
            this.x = this.minx;
            this.left = false;
            this.right = true;
            this.animation = this.type.animation.right;
        }
        else if (this.right && (this.x > this.maxx) && (!this.wrapx || this.x < this.minx)) {
            this.x = this.maxx;
            this.right = false;
            this.left = true;
            this.animation = this.type.animation.left;
        }

        var row = Utils.data.y2row(this.y - this.ny),
            col = Utils.data.x2col(this.x - this.nx);

        if ((row !== this.row) || (col !== this.col)) {
            GameApp.Game.getArena().map[this.row][this.col].enemy = null;
            GameApp.Game.getArena().map[row][col].enemy = this;
            this.row = row;
            this.col = col;
        }

        GameApp.Game.animate(this);
    }

};