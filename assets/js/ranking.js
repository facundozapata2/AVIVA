/* ============================================================
   ranking.js — AVIVA
   Clasificación dinámica de tribus, con animación FLIP al
   reordenarse (para simular una actualización en vivo).

   Requiere en el HTML:
     #clasif-list (ul vacío), #clasif-btn (botón de demo)

   Para conectar datos reales: reemplazar clasifData por los
   puntajes reales (por ejemplo, cargados desde un backend/API)
   y llamar a renderClasif() cada vez que cambien.
   ============================================================ */
(function () {

  var clasifList = document.getElementById('clasif-list');
  var clasifBtn = document.getElementById('clasif-btn');

  if (!clasifList) return;

  var clasifData = [
    { name: 'Tribu A', pts: 125 },
    { name: 'Tribu B', pts: 110 },
    { name: 'Tribu C', pts: 98 },
    { name: 'Tribu D', pts: 85 }
  ];

  function renderClasif() {
    var sorted = clasifData.slice().sort(function (a, b) {
      return b.pts - a.pts;
    });

    clasifList.innerHTML = '';

    sorted.forEach(function (team, i) {
      var li = document.createElement('li');
      li.className = 'clasif-row';
      li.dataset.name = team.name;
      li.innerHTML =
        '<span class="clasif-pos">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="clasif-name">' + team.name + '</span>' +
        '<span class="clasif-pts">' + team.pts + ' pts</span>';
      clasifList.appendChild(li);
    });
  }

  function animateReorder(beforeRects) {
    var newRows = Array.prototype.slice.call(clasifList.querySelectorAll('.clasif-row'));

    newRows.forEach(function (row) {
      var first = beforeRects[row.dataset.name];
      var last = row.getBoundingClientRect();
      if (!first) return;

      var deltaY = first.top - last.top;
      if (deltaY) {
        row.style.transform = 'translateY(' + deltaY + 'px)';
        row.style.transition = 'none';

        requestAnimationFrame(function () {
          row.style.transition = 'transform .5s cubic-bezier(.3,.8,.3,1)';
          row.style.transform = 'translateY(0)';
        });
      }
    });
  }

  function updateClasif(mutateFn) {
    var rows = Array.prototype.slice.call(clasifList.querySelectorAll('.clasif-row'));
    var beforeRects = {};
    rows.forEach(function (row) {
      beforeRects[row.dataset.name] = row.getBoundingClientRect();
    });

    mutateFn();
    renderClasif();
    animateReorder(beforeRects);
  }

  renderClasif();

  if (clasifBtn) {
    clasifBtn.addEventListener('click', function () {
      updateClasif(function () {
        // Simula una actualización de puntos en vivo.
        clasifData.forEach(function (team) {
          team.pts = Math.max(0, team.pts + (Math.floor(Math.random() * 23) - 11));
        });
      });
    });
  }

})();