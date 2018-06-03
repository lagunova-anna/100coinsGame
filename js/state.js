//  модуль управляет состояниями игры - создаем SPA

GameApp.State = (function() {

    // отслеживаем изменение закладки в УРЛе (оно происходит при любом виде навигации в т.ч. при нажатии кнопок браузера ВПЕРЁД/НАЗАД)
    window.onhashchange = switchToStateFromURLHash;

    // текущее состояние приложения
    var SPAStateH = {};
    
    /**
     * Устанавливает полученное состояние приложения как текущее и обновляет нужную часть страницы
     */
    function updateToState(newStateH) {
        SPAStateH = newStateH;  // устанавливаем - это теперь текущее состояние

        var pageHTML = "";   // изменяемая часть страницы

        Utils.styles.toggleClass(Utils.dom.getByClass('active')[0], 'active');

        switch (SPAStateH.pagename) {

            case 'Main':  //главная, описание игры
                Utils.styles.toggleClass(Utils.dom.get('mainPage'), 'active');
                Utils.styles.toggleClass(Utils.dom.getByTagName('body')[0], 'bodyGame', false);
                pageHTML = GameApp.Templates.mainTemplate;
                break;

            case 'Game':  //игра
                Utils.styles.toggleClass(Utils.dom.get('gamePage'), 'active');
                Utils.styles.toggleClass(Utils.dom.getByTagName('body')[0], 'bodyGame', true);
                pageHTML = GameApp.Templates.gameTemplate;
                break;

            case 'Winners':
                Utils.styles.toggleClass(Utils.dom.get('resultPage'), 'active');
                Utils.styles.toggleClass(Utils.dom.getByTagName('body')[0], 'bodyGame', false);
                GameApp.Server.getWinners(setWinnerTable);
                break;
        }

        //вставляем новое содержимое для блока iPage
        document.getElementById('iPage').innerHTML = pageHTML;

        if (SPAStateH.pagename === 'Game') {
            document.getElementById("btnStart").style.display = "block";
            document.getElementById("startGame").style.display = "block";
            document.getElementById("hud").style.display = "none";
        }
    }

    /**
     *  Вызывается при изменении закладки УРЛа, а также при первом открытии страницы, читает нужное состояние приложения из закладки УРЛа
     *  и устанавливает+отображает его
     */
    function switchToStateFromURLHash() {
        var URLHash = window.location.hash;

        // убираем из закладки УРЛа решётку
        var stateStr = URLHash.substr(1);

        if (stateStr !== "") {   // если закладка непустая, читаем из неё состояние и отображаем
            var PartsA = stateStr.split("_");
            var NewStateH = {pagename: PartsA[0]}; // первая часть закладки - номер страницы
            updateToState(NewStateH);
        }
        else
            updateToState({pagename: 'Main'}); // иначе показываем главную страницу
    }

    /**
     *  Устанавливает в закладке УРЛа новое состояние приложения  и отображает его
     */
    function switchToState(newStateH) {
        var stateStr = newStateH.pagename;
        location.hash = stateStr;
    }

    function switchToMainPage() {
        switchToState({pagename: 'Main'});
        GameApp.Main.cancelGame();
    }

    function switchToWinnersPage() {
        switchToState({pagename: 'Winners'});
        GameApp.Main.cancelGame();
    }

    function switchToGame() {
        switchToState({pagename: 'Game'});
    }


    /**
     * Передаем сообщения в таблицу победителей
     */
    function setWinnerTable(resultH) {
        var tableWinners = [];
        if (resultH.error)
            alert("Извините, таблицы рекордов временно недоступны.\n" + resultH.error);
        else {
            if (resultH.result) {
                tableWinners = JSON.parse(resultH.result);
            }
            showTable(tableWinners);
        }
    }

    /**
     * Отображаем таблицу победителей
     */
    function showTable(tableWinners) {
        var pageHTML = "";
        pageHTML = GameApp.Templates.winnersTemplate(tableWinners);
        document.getElementById('iPage').innerHTML = pageHTML;
    }

    switchToStateFromURLHash(); //переключает в состояние, которое сейчас прописано в закладках УРЛа

    return {
        switchToMainPage: switchToMainPage,
        switchToGame: switchToGame,
        switchToWinnersPage: switchToWinnersPage
    }
})();