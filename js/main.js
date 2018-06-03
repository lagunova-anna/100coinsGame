GameApp.Main = (function() {

    var flagGame;     //флаг - игра идет

    var debugMode = false;  // режим дебага

    /**
     * Запуск игры
     */
    var start = function () {
        flagGame = true;
        GameApp.Control.run();
        document.getElementById("btnStart").style.display = "none";
        document.getElementById("startGame").style.display = "none";
        document.getElementById("timer").style.display = "block";
        document.getElementById("hud").style.display = "block";
        GameApp.Timer.startTimer();
    };

    /**
     * Завершение игры (если собрано 100 монет)
     */
    var end = function () {
        cancelGame();
        var winnerNew;
        alert("Ура!!! Вы собрали 100 монет!");
        document.getElementById("endGame").style.display = "block";
        alert("Ваше время - " + GameApp.Timer.getTime());

        var userName = prompt('Игра завершена!\n Введите Ваше имя:', '');
        //проверка на ввод имени пользователем, отсутствие имени равносильно отказу занесения в таблицу рекордов
        if ((userName === null) || (userName === '')) return;

        //собираем информацию о прошедшей игре для нового участника для добавления в таблицу победителей
        winnerNew = {userName: userName, time: GameApp.Timer.getTime(), t: GameApp.Timer.getT()};
        addWinner(winnerNew);

    };

    var addWinner = function (winner) {
        var tableWinners;

        GameApp.Server.getWinnersForUpdate(function(resultH) {
            tableWinners = JSON.parse(resultH.result);

            //добавляем нового победителя
            tableWinners.push(winner);
            //сортируем таблицу по очкам
            tableWinners.sort(function(A, B) { return A.t - B.t;});

            //вызываем функцию добавления в таблицу победителей
            GameApp.Server.addWinner(tableWinners, function() {
                //переходим на закладку с таблицей победителей
                GameApp.State.switchToWinnersPage();
            });
        });
    };

    /**
     *  Проверяем, что игра завершена
     */
    var checkEndGame = function () {
        if (GameApp.Game.getRenderer().vscore > 99) {
            end();
        }
    };

    /**
     *  Завершаем игру
     */
    var cancelGame = function () {
        if(flagGame) {
            GameApp.Timer.endTimer();
            flagGame = false;

            Utils.dom.on(document, 'keydown', GameApp.Control.onKeyDownHandler, false);
            Utils.dom.on(document, 'keyup', GameApp.Control.onKeyUpHandler, false);
        }
    };

    return {
        debugMode: debugMode,
        getFlagGame: function() { return flagGame},
        start: start,
        checkEndGame: checkEndGame,
        cancelGame: cancelGame
    }

})();