GameApp.Server = (function() {

    //переменная для генерации пароля Ajax
    var newPassword;

    /**
     * Получить таблицу победителей
     */
    function getWinners(successCallback) {
        $.ajax(
            {
                url: GameApp.Const.ajaxHandlerScript,
                type: 'POST',
                data: {f: 'READ', n: GameApp.Const.ajaxUserName},
                cache: false,
                success: successCallback,
                error: errorHandler
            }
        );
    }

    /**
     * Получить таблицу победителей (для обновления)
     */
    function getWinnersForUpdate(successCallback) {
        newPassword = Math.random();
        $.ajax(
            {
                url: GameApp.Const.ajaxHandlerScript,
                type: 'POST',
                data: {f: 'LOCKGET', n: GameApp.Const.ajaxUserName, p: newPassword},
                cache: false,
                success: successCallback,
                error: errorHandler
            }
        );
    }

    /**
     * Добавить победителя в таблицу победителей
     */
    function addWinner(tableWinner, successCallback) {
        //отправляем через Ajax обновленную информацию Winners
        $.ajax(
            {
                url: GameApp.Const.ajaxHandlerScript,
                type: 'POST',
                data: {
                    f: 'UPDATE', n: GameApp.Const.ajaxUserName,
                    v: JSON.stringify(tableWinner), p: newPassword
                },
                cache: false,
                //	async : false,
                success: successCallback,
                error: errorHandler
            }
        );

    }

    function errorHandler(jqXHR, StatusStr, ErrorStr) {
        alert("Извините, таблицы рекордов временно недоступны.\n" + StatusStr + ' ' + ErrorStr);
    }

    return {
        addWinner: addWinner,
        getWinners: getWinners,
        getWinnersForUpdate: getWinnersForUpdate
    }
})();