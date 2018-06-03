//  Арена  - все игровое поле, вся арена разбита на ячейки, row- кол-во строк, col - кол-во столбцов
GameApp.Arena = {

    rows: 0,
    cols: 0,
    w: 0,
    h: 0,
    mapLevel: mapLevel.reverse(),
    map: [],
    ground: {},
    air: {},

    initialize: function () {
        this.rows = this.mapLevel.length;
        this.cols = this.mapLevel[0].length;
        this.w = this.cols * GameApp.Const.COL_WIDTH;
        this.h = this.rows * GameApp.Const.ROW_HEIGHT;
        this.map = this.createMap(this.mapLevel);
        this.ground = {platform: true};
        this.air = {platform: false};
    },

    /**
     *   Получаем ячейку арены (по номеру строки и столбца)
     */
    getCell: function (row, col) {
        if (row < 0)
            return this.ground;
        else if (row >= this.rows)
            return this.air;
        else
            return this.map[row][Utils.data.normalizeColumn(col)];
    },

    /**
     * Создаем карту для арены
     */
    createMap: function (source) {
        var row;
        var col;
        var cell;
        var map = [];
        for (row = 0; row < this.rows; row++) {
            map[row] = [];
            for (col = 0; col < this.cols; col++) {
                cell = source[row][col];
                map[row][col] = {
                    platform: (cell === 'X'),   // если в массиве map "X" - рисуем платформу
                    ladder: (cell === 'H'),     // если в массиве map "H" - рисуем лестницу
                    coin: (cell === 'o')        // если в массиве map "o" - рисуем монетку
                };
            }
        }
        return map;
    }
};