const INSCRIPCIONES_API_URL =
  'https://script.google.com/macros/s/AKfycby45jCs6TP0tICWt439Iv-uBLtGoM7CZmmYsDLZ9Gejsl2koOewU1bgQJMpRo5TFthPkQ/exec';

const talleresList =
  document.getElementById('talleres-list');

const inscripcionPanel =
  document.getElementById('inscripcion-panel');

const inscripcionForm =
  document.getElementById('inscripcion-form');

const inscripcionTaller =
  document.getElementById('inscripcion-taller');

const inscripcionTallerInput =
  document.getElementById('inscripcion-taller-input');

const inscripcionNombre =
  document.getElementById('inscripcion-nombre');

const inscripcionMensaje =
  document.getElementById('inscripcion-mensaje');

const inscripcionCancelar =
  document.getElementById('inscripcion-cancelar');

let estadoActual = null;
let tallerSeleccionado = null;
let enviando = false;


/* =====================================================
   CARGAR ESTADO DE INSCRIPCIONES
===================================================== */

function cargarEstadoInscripciones() {

  const callbackName =
    'avivaInscripcionesCallback_' + Date.now();

  const script =
    document.createElement('script');

  window[callbackName] =
    function (data) {

      console.log(
        'Inscripciones recibidas:',
        data
      );

      estadoActual = data;

      actualizarTalleres(data);

      delete window[callbackName];

      script.remove();
    };

  script.src =
    INSCRIPCIONES_API_URL +
    '?action=inscripciones&callback=' +
    encodeURIComponent(callbackName);

  script.onerror =
    function () {

      console.error(
        'No se pudo obtener el estado de inscripciones.'
      );

      delete window[callbackName];

      script.remove();

      mostrarErrorGeneral();
    };

  document.body.appendChild(script);
}


/* =====================================================
   ACTUALIZAR TALLERES
===================================================== */

function actualizarTalleres(data) {

  if (
    !data ||
    !Array.isArray(data.talleres)
  ) {
    return;
  }

  const bloques =
    document.querySelectorAll(
      '.taller-block'
    );

  bloques.forEach(
    function (bloque) {

      const nombre =
        bloque.dataset.taller;

      const taller =
        data.talleres.find(
          function (item) {

            return (
              item.nombre.toLowerCase() ===
              nombre.toLowerCase()
            );

          }
        );

      if (!taller) {
        return;
      }

      const cupos =
        bloque.querySelector(
          '.taller-cupos'
        );

      const boton =
        bloque.querySelector(
          '.taller-button'
        );

      if (
        taller.disponibles <= 0
      ) {

        cupos.textContent =
          'Cupo completo';

        cupos.classList.add(
          'full'
        );

        boton.disabled = true;

        boton.textContent =
          'Cupo completo →';

      } else {

        cupos.textContent =
          taller.disponibles +
          (
            taller.disponibles === 1
              ? ' cupo disponible'
              : ' cupos disponibles'
          );

        cupos.classList.remove(
          'full'
        );

        boton.disabled =
          data.inscripcionesActivas !== true;

        boton.textContent =
          'Anotarme →';
      }

    }
  );


  if (
    data.inscripcionesActivas !== true
  ) {

    document
      .querySelectorAll(
        '.taller-button'
      )
      .forEach(
        function (boton) {

          boton.disabled = true;

          boton.textContent =
            'Inscripciones cerradas';

        }
      );

  }
}


/* =====================================================
   ABRIR FORMULARIO
===================================================== */

function abrirFormulario(taller) {

  if (
    !estadoActual ||
    estadoActual.inscripcionesActivas !== true
  ) {

    mostrarMensaje(
      'Las inscripciones están cerradas.',
      'error'
    );

    return;
  }


  const datosTaller =
    estadoActual.talleres.find(
      function (item) {

        return (
          item.nombre.toLowerCase() ===
          taller.toLowerCase()
        );

      }
    );


  if (
    !datosTaller ||
    datosTaller.disponibles <= 0
  ) {

    mostrarMensaje(
      'Este taller ya está completo.',
      'error'
    );

    cargarEstadoInscripciones();

    return;
  }


  tallerSeleccionado =
    datosTaller.nombre;

  inscripcionTaller.textContent =
    datosTaller.nombre;

  inscripcionTallerInput.value =
    datosTaller.nombre;

  inscripcionPanel.hidden = false;

  inscripcionMensaje.textContent = '';

  inscripcionMensaje.className =
    'inscripcion-mensaje';

  inscripcionNombre.focus();

  inscripcionPanel.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


/* =====================================================
   CERRAR FORMULARIO
===================================================== */

function cerrarFormulario() {

  inscripcionPanel.hidden = true;

  tallerSeleccionado = null;

  inscripcionForm.reset();

  inscripcionMensaje.textContent = '';

  inscripcionMensaje.className =
    'inscripcion-mensaje';
}


/* =====================================================
   BOTONES ANOTARME
===================================================== */

document
  .querySelectorAll('.taller-button')
  .forEach(
    function (boton) {

      boton.addEventListener(
        'click',
        function () {

          const bloque =
            this.closest(
              '.taller-block'
            );

          if (!bloque) {
            return;
          }

          abrirFormulario(
            bloque.dataset.taller
          );

        }
      );

    }
  );


/* =====================================================
   CANCELAR
===================================================== */

if (inscripcionCancelar) {

  inscripcionCancelar.addEventListener(
    'click',
    cerrarFormulario
  );

}


/* =====================================================
   ENVÍO
===================================================== */

inscripcionForm.addEventListener(
  'submit',
  function () {

    if (enviando) {
      return;
    }

    enviando = true;

    const boton =
      inscripcionForm.querySelector(
        '.inscripcion-submit'
      );

    boton.disabled = true;

    boton.textContent =
      'ENVIANDO...';

    mostrarMensaje(
      'Procesando inscripción...',
      ''
    );


    /*
      El formulario se envía al iframe.
      Luego actualizamos los cupos.
    */

    setTimeout(
      function () {

        cargarEstadoInscripciones();

      },
      1500
    );


    setTimeout(
      function () {

        if (!enviando) {
          return;
        }

        enviando = false;

        boton.disabled = false;

        boton.textContent =
          'INSCRIBIRME';

        mostrarMensaje(
          '¡Felicitaciones! Te inscribiste a ' +
          tallerSeleccionado +
          '.',
          'ok'
        );

        cargarEstadoInscripciones();

      },
      2500
    );

  }
);


/* =====================================================
   MENSAJES
===================================================== */

function mostrarMensaje(
  texto,
  tipo
) {

  inscripcionMensaje.textContent =
    texto;

  inscripcionMensaje.className =
    'inscripcion-mensaje';

  if (tipo) {

    inscripcionMensaje.classList.add(
      tipo
    );

  }
}


/* =====================================================
   ERROR GENERAL
===================================================== */

function mostrarErrorGeneral() {

  document
    .querySelectorAll(
      '.taller-cupos'
    )
    .forEach(
      function (elemento) {

        elemento.textContent =
          'No se pudieron cargar los cupos';

      }
    );
}


/* =====================================================
   INICIO
===================================================== */

cargarEstadoInscripciones();