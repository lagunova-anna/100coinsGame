// Камера (экран, видимая часть игрового поля)
GameApp.Camera = {
    initialize: function () {
        this.x = GameApp.Game.getPlayer().x;
        this.y = GameApp.Game.getPlayer().y;
        this.dx = 0;
        this.dy = 0;
        this.miny = 0;
        this.maxy = GameApp.Game.getArena().h;
    },

    update: function (dt) {
        this.x = GameApp.Game.getPlayer().x;
        this.y = GameApp.Game.getPlayer().y;
        this.dx = GameApp.Game.getPlayer().dx;
        this.dy = GameApp.Game.getPlayer().dy;
    }
};
