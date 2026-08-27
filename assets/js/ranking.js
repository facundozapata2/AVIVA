const API_URL = 'https://script.google.com/macros/s/AKfycbxPIY_mK71CaRRPHKh0BopxaDWwJ7KGQMdu454Q17E5zCrbED6T2OsoF7WOAneiFmgb4w/exec';

(function () {

  const clasifList = document.getElementById('clasif-list');
  const clasifBtn = document.getElementById('clasif-btn');

  if (!clasifList) return;

  let clasifData = [];

  function renderClasif() {
    const sorted = [...clasifData].sort((a, b) => b.pts - a.pts);

    clasifList.innerHTML = '';

    sorted.forEach((team, i) => {
      const li = document.createElement('li');

      li.className = 'clasif-row';
      li.dataset.name = team.name;

      li.innerHTML =
        `<span class="clasif-pos">${String(i + 1).padStart(2, '0')}</span>` +
        `<span class="clasif-name">${team.name}</span>` +
        `<span class="clasif-pts">${team.pts} pts</span>`;

      clasifList.appendChild(li);
    });
  }

  function animateReorder(beforeRects) {
    const newRows = [...clasifList.querySelectorAll('.clasif-row')];

    newRows.forEach(row => {
      const first = beforeRects[row.dataset.name];
      const last = row.getBoundingClientRect();

      if (!first) return;

      const deltaY = first.top - last.top;

      if (deltaY) {
        row.style.transform = `translateY(${deltaY}px)`;
        row.style.transition = 'none';

        requestAnimationFrame(() => {
          row.style.transition = 'transform .5s cubic-bezier(.3,.8,.3,1)';
          row.style.transform = 'translateY(0)';
        });
      }
    });
  }

  async function cargarClasificacion() {

    const rows = [...clasifList.querySelectorAll('.clasif-row')];
    const beforeRects = {};

    rows.forEach(row => {
      beforeRects[row.dataset.name] = row.getBoundingClientRect();
    });

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      clasifData = data.map(team => ({
        name: `Tribu ${team.tribu}`,
        pts: Number(team.puntos) || 0
      }));

      renderClasif();
      animateReorder(beforeRects);

    } catch (error) {
      console.error('Error cargando la clasificación:', error);

      clasifList.innerHTML =
        '<li class="clasif-error">No se pudo cargar la clasificación.</li>';
    }
  }

  cargarClasificacion();

  if (clasifBtn) {
    clasifBtn.addEventListener('click', cargarClasificacion);
  }

})();