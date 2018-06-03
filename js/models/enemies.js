GameApp.Enemies = {

    initialize: function () {
        this.all = this.createEnemies(mapLevel);
    },

    update: function (dt) {
        var n, max, all = this.all;
        for (n = 0, max = all.length; n < max; n++)
            all[n].update(dt);
    },

    createEnemies: function (source) {
        var row;
        var col;
        var type;
        var enemy;
        var all = [];
        for (row = 0; row < GameApp.Game.getArena().rows; row++) {
            for (col = 0; col < GameApp.Game.getArena().cols; col++) {
                type = parseInt(source[row][col], 10);
                if (!isNaN(type)) {
                    var Enemy = Utils.class.create(GameApp.Enemy);
                    enemy = new Enemy(row, col, GameApp.Const.ENEMIES[type]);
                    all.push(enemy);
                    GameApp.Game.getArena().map[row][col].enemy = enemy;
                }
            }
        }
        return all;
    }
};