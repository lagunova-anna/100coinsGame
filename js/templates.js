GameApp.Templates = {

    mainTemplate:
        "<div class='page-game'>\
            <div class='description'>\
                <h1>Приветствуем!</h1> \
                <div class='content'>\
                    <p>100 монeт - это увлекательная игра, в которой у вас есть возможность побродить по крышам ночного города.</p> \
                    <p>Цель - <span> собрать монеты, ровно 100 </span>. Делать это нужно быстро, т.к. это игра на время. Меньше время - выше рейтинг в таблице победителей.</p>  \
                    <p>Собрать 100 монет не так уж и просто: повсюду подстерегают неприятности. Будьте осторожны. Чем выше вы заберетесь - тем больше монет можно собрать, однако там больше врагов и больше вероятности упасть.</p> \
                    <h3>Успехов!</h3> \
                </div> \
            </div>\
            <div class='contentImg'><img src='images/moon_new.png'></div> \
        </div>",

    gameTemplate:
        "<div class='page-game'> \
            <canvas id='canvas'></canvas> \
            <input type=button value=\"Старт!\" id=\"btnStart\" onclick=\"GameApp.Main.start()\">\
            <div id=\"hud\"> \
                <table>\
                    <tr>\
                        <td><img src=\"images/coin.png\" id=\"imgscore\"></td>\
                        <td><span id=\"score\"></span></td> \
                    </tr>\
                </table>\
            </div>\
            <div id=\"timer\">00:00:00</div>\
            <img id=\"startGame\" src=\"images/startgame_new.png\"> \
            <img id=\"endGame\" src=\"images/endgame_new.png\"> \
        </div>",

    winnersTemplate: function(tableWinner) {
        var pageTemplate =  "<div class='page-game'>\
            <table class=\"tableW\">\
                <tr class=\"tW\">\
                    <th class=\"tW\">Место</th>\
                    <th class=\"tW\">Имя</th>\
                    <th class=\"tW\">Время</th>\
                </tr>";

        for (var i = 0; i < tableWinner.length; i++) {
            pageTemplate +=
                "<tr class=\"tW\">" +
                    "<td class=\"tW\">" + (i + 1) +  "</td>" +
                    "<td class=\"tW\">" + tableWinner[i].userName + "</td>" +
                    "<td class=\"tW\">" + tableWinner[i]['time'] + "</td><" +
                "/tr>";
        }

        pageTemplate += "</table></div>";

        return pageTemplate
    }
};