/* ============================================================
   countdown.js — AVIVA
   Cuenta regresiva en tiempo real hasta el inicio del campamento.

   Requiere en el HTML:
     #cd-days, #cd-hours, #cd-mins, #cd-secs
   ============================================================ */
(function () {

  // FECHA PLACEHOLDER — reemplazar por la fecha/hora real de inicio.
  var TARGET_DATE = new Date('2026-09-04T18:00:00-03:00').getTime();

  var elDays = document.getElementById('cd-days');
  var elHours = document.getElementById('cd-hours');
  var elMins = document.getElementById('cd-mins');
  var elSecs = document.getElementById('cd-secs');

  // Si el contador no está en esta página, no hacemos nada.
  if (!elDays || !elHours || !elMins || !elSecs) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  var countdownTimer;

  function tick() {
    var diff = TARGET_DATE - Date.now();

    if (diff <= 0) {
      elDays.textContent = '00';
      elHours.textContent = '00';
      elMins.textContent = '00';
      elSecs.textContent = '00';
      clearInterval(countdownTimer);
      return;
    }

    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad(d);
    elHours.textContent = pad(h);
    elMins.textContent = pad(m);
    elSecs.textContent = pad(s);
  }

  tick();
  countdownTimer = setInterval(tick, 1000);

})();