const tribus = ['NEFTALÍ', 'JUDÁ', 'MANASÉS', 'BENJAMÍN'];

(function () {

  const clasifList = document.getElementById('clasif-list');
  const clasifBtn = document.getElementById('clasif-btn');

  if (!clasifList) return;

  const clasifData = tribus.map((tribu, index) => ({
    name: `Tribu ${tribu}`,
    pts: [125, 110, 98, 85][index]
  }));

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

  function updateClasif(mutateFn) {
    const rows = [...clasifList.querySelectorAll('.clasif-row')];
    const beforeRects = {};

    rows.forEach(row => {
      beforeRects[row.dataset.name] = row.getBoundingClientRect();
    });

    mutateFn();
    renderClasif();
    animateReorder(beforeRects);
  }

  renderClasif();

  if (clasifBtn) {
    clasifBtn.addEventListener('click', () => {
      updateClasif(() => {
        clasifData.forEach(team => {
          team.pts = Math.max(
            0,
            team.pts + (Math.floor(Math.random() * 23) - 11)
          );
        });
      });
    });
  }

})();