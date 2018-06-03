GameApp.Timer = (function() {
    var clocktimer, dateObj, dh, dm, ds, t, t0;
    var time = '';
    var h = 1, m = 1, tm = 1, s = 0, ts = 0, ms = 0, show = true, init = 0, ii = 0;

    function startTIME() {
        var cdateObj = new Date();
        t0 = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
        if (t0 > 999) {
            s++;
        }
        if (s >= (m * 60)) {
            ts = 0;
            m++;
        } else {
            ts = parseInt((ms / 100) + s);
            if (ts >= 60) {
                ts = ts - ((m - 1) * 60);
            }
        }
        if (m > (h * 60)) {
            tm = 1;
            h++;
        } else {
            tm = parseInt((ms / 100) + m);
            if (tm >= 60) {
                tm = tm - ((h - 1) * 60);
            }
        }
        if (ts > 0) {
            ds = ts;
            if (ts < 10) {
                ds = '0' + ts;
            }
        } else {
            ds = '00';
        }
        dm = tm - 1;
        if (dm > 0) {
            if (dm < 10) {
                dm = '0' + dm;
            }
        } else {
            dm = '00';
        }
        dh = h - 1;
        if (dh > 0) {
            if (dh < 10) {
                dh = '0' + dh;
            }
        } else {
            dh = '00';
        }
        time = dh + ':' + dm + ':' + ds;
        if (show) {
            document.getElementById("timer").innerHTML = time;
        }
        clocktimer = setTimeout(startTIME, 1);
    }

    var startTimer = function () {
        dateObj = new Date();
        startTIME();
    };

    var endTimer = function () {
        show = false;
        t = dh * 3600 + dm * 60 + ds;
    };

    return {
        startTimer: startTimer,
        endTimer: endTimer,
        getTime: function() {return time},
        getT: function() {return t}
    }
})();




