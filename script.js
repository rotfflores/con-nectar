/* ==========================================================================
   Con-néctar · Interacciones de la página
   ========================================================================== */

/* --------------------------------------------------------------------------
   DATOS DEL CENTRO: edita aquí la información de contacto.
   Deja una cadena vacía ('') en lo que aún no esté confirmado: la página
   mostrará el texto pendiente y no creará enlaces para ese dato.
   -------------------------------------------------------------------------- */
const DATOS_CENTRO = {
  // WhatsApp a 10 dígitos, sin espacios (formato: '618XXXXXXX').
  // Se convierte en un enlace de WhatsApp con la lada de México (52).
  // Es el celular público del centro en Facebook (ver FUENTES.md). Confirma que tenga WhatsApp.
  whatsapp: '6182345266',

  // Mensaje con el que se abre la conversación cuando el botón no indica otro.
  mensajeWhatsApp: 'Hola, me gustaría recibir información sobre Con-néctar.',

  // Muestra un botón redondo de WhatsApp en la esquina inferior (solo si hay número).
  botonFlotanteWhatsApp: true,

  // Teléfono a 10 dígitos (formato: '618XXXXXXX').
  telefono: '6182345266',

  // Horario de atención tal como debe leerse (formato: 'Lunes a viernes, 00:00 a 00:00 h').
  horario: '',

  // Calle, número, colonia y código postal. La ciudad ya aparece en la página.
  // Falta el código postal.
  direccion: 'Calle Río Aguanaval 506, Col. Valle del Sur',

  // Enlace de "Compartir" de Google Maps con la ubicación exacta del centro.
  // Es el que el centro comparte en su biografía de Instagram.
  googleMaps: 'https://maps.app.goo.gl/7ZmX6gkZZQZbut3L6',

  // Redes sociales confirmadas.
  instagram: 'https://www.instagram.com/con.nectar.dgo/',
  facebook: 'https://www.facebook.com/profile.php?id=61568894422427',
};

(function () {
  'use strict';

  const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Utilidades ---------- */
  const SUAVE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  // true si se pueden usar animaciones (el dispositivo no pide reducir movimiento)
  function animar() {
    return !reduceMovimiento.matches && typeof Element.prototype.animate === 'function';
  }

  function soloDigitos(valor) {
    return String(valor || '').replace(/\D/g, '');
  }

  // Devuelve el número en formato internacional para wa.me (52 + 10 dígitos) o null.
  function numeroWhatsApp(valor) {
    const d = soloDigitos(valor);
    if (d.length === 10) return '52' + d;
    if (d.length === 12 && d.startsWith('52')) return d;
    if (d.length === 13 && d.startsWith('521')) return '52' + d.slice(3);
    if (d) console.warn('Con-néctar: el número de WhatsApp debe tener 10 dígitos. Revisa DATOS_CENTRO.whatsapp.');
    return null;
  }

  function formatoTelefono(valor) {
    const d = soloDigitos(valor).slice(-10);
    if (d.length !== 10) return String(valor).trim();
    return d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6);
  }

  function enlaceWhatsApp(numero, mensaje) {
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
  }

  /* ---------- Datos de contacto ---------- */
  const wa = numeroWhatsApp(DATOS_CENTRO.whatsapp);
  const tel = soloDigitos(DATOS_CENTRO.telefono).length >= 10 ? DATOS_CENTRO.telefono : '';

  const valores = {
    whatsapp: wa ? formatoTelefono(DATOS_CENTRO.whatsapp) : '',
    telefono: tel ? formatoTelefono(tel) : '',
    horario: String(DATOS_CENTRO.horario || '').trim(),
    direccion: String(DATOS_CENTRO.direccion || '').trim(),
    googleMaps: String(DATOS_CENTRO.googleMaps || '').trim(),
    instagram: String(DATOS_CENTRO.instagram || '').trim(),
    facebook: String(DATOS_CENTRO.facebook || '').trim(),
  };

  const enlaces = {
    telefono: tel ? 'tel:+52' + soloDigitos(tel).slice(-10) : '',
    googleMaps: /^https:\/\//.test(valores.googleMaps) ? valores.googleMaps : '',
    instagram: /^https:\/\//.test(valores.instagram) ? valores.instagram : '',
    facebook: /^https:\/\//.test(valores.facebook) ? valores.facebook : '',
  };

  document.querySelectorAll('[data-dato]').forEach(function (el) {
    const valor = valores[el.dataset.dato];
    if (valor) el.textContent = valor;
  });

  document.querySelectorAll('[data-enlace]').forEach(function (el) {
    const clave = el.dataset.enlace;
    const href = enlaces[clave];
    if (href) {
      el.href = href;
      if (/^https:/.test(href)) {
        el.target = '_blank';
        el.rel = 'noopener';
      }
    } else if (clave === 'instagram' || clave === 'facebook') {
      // Si se borra una red social de DATOS_CENTRO, se oculta su enlace.
      el.hidden = true;
    }
  });

  document.querySelectorAll('[data-mostrar-si]').forEach(function (el) {
    el.hidden = !valores[el.dataset.mostrarSi];
  });

  document.querySelectorAll('[data-mostrar-si-falta]').forEach(function (el) {
    el.hidden = Boolean(valores[el.dataset.mostrarSiFalta]);
  });

  /* ---------- Convocatorias con fecha ----------
     Una actividad con data-fecha="AAAA-MM-DD" se marca como realizada al día
     siguiente de esa fecha, con la hora del centro de México. */
  const hoyMexico = (function () {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date());
    } catch (e) {
      return new Date().toISOString().slice(0, 10);
    }
  })();

  document.querySelectorAll('[data-fecha]').forEach(function (evento) {
    if (evento.dataset.fecha >= hoyMexico) return;
    evento.classList.add('actividad--realizada');
    const estado = evento.querySelector('.estado');
    if (estado) {
      estado.className = 'estado estado--realizado';
      estado.textContent = 'Realizado';
    }
    const boton = evento.querySelector('[data-whatsapp]');
    if (boton) {
      boton.textContent = 'Preguntar por el próximo';
      boton.className = 'boton boton--contorno';
      boton.dataset.whatsapp = 'Hola, me gustaría saber cuándo es el próximo viernes de CTE.';
    }
  });

  /* ---------- Botones de WhatsApp ----------
     Todo enlace con data-whatsapp lleva a contacto.html mientras no haya número.
     Con número, abre WhatsApp con un mensaje: el del atributo, o uno armado
     con el título de la tarjeta donde está el botón. */
  if (wa) {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
      let mensaje = el.dataset.whatsapp;
      if (!mensaje) {
        const tarjeta = el.closest('article');
        const titulo = tarjeta && tarjeta.querySelector('h2, h3, h4');
        mensaje = titulo
          ? 'Hola, me gustaría recibir información sobre ' + titulo.textContent.trim() + '.'
          : DATOS_CENTRO.mensajeWhatsApp;
      }
      el.href = enlaceWhatsApp(wa, mensaje);
      el.target = '_blank';
      el.rel = 'noopener';
      const aviso = document.createElement('span');
      aviso.className = 'sr-only';
      aviso.textContent = ' (abre WhatsApp)';
      el.appendChild(aviso);
    });

    if (DATOS_CENTRO.botonFlotanteWhatsApp) {
      const flotante = document.createElement('a');
      flotante.className = 'whatsapp-flotante';
      flotante.href = enlaceWhatsApp(wa, DATOS_CENTRO.mensajeWhatsApp);
      flotante.target = '_blank';
      flotante.rel = 'noopener';
      flotante.setAttribute('aria-label', 'Escribir por WhatsApp');
      flotante.innerHTML = '<svg class="icono" aria-hidden="true"><use href="#i-mensaje"/></svg>';
      document.body.appendChild(flotante);
    }
  }

  /* ---------- Año del pie de página ---------- */
  document.querySelectorAll('[data-anio]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Encabezado con borde al desplazarse ---------- */
  const encabezado = document.querySelector('[data-encabezado]');
  if (encabezado) {
    const actualizarBorde = function () {
      encabezado.classList.toggle('encabezado--con-borde', window.scrollY > 8);
    };
    actualizarBorde();
    window.addEventListener('scroll', actualizarBorde, { passive: true });
  }

  /* ---------- Menú móvil ---------- */
  const nav = document.querySelector('[data-nav]');
  const botonMenu = document.querySelector('[data-nav-boton]');
  const escritorio = window.matchMedia('(min-width: 1240px)');

  function abrirMenu(abrir) {
    if (!nav || !botonMenu) return;
    nav.classList.toggle('nav--abierta', abrir);
    botonMenu.setAttribute('aria-expanded', String(abrir));
  }

  if (nav && botonMenu) {
    botonMenu.addEventListener('click', function () {
      abrirMenu(botonMenu.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        abrirMenu(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--abierta')) {
        abrirMenu(false);
        botonMenu.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (nav.classList.contains('nav--abierta') && !nav.contains(e.target)) {
        abrirMenu(false);
      }
    });

    // Al pasar a vista de escritorio, el menú se cierra.
    escritorio.addEventListener('change', function () {
      abrirMenu(false);
    });
  }

  /* ---------- Acordeón de preguntas ----------
     La respuesta se despliega y se recoge suavemente. */
  function moverPanel(panel, abrir) {
    if (panel.animacion) {
      panel.animacion.cancel();
      panel.animacion = null;
    }
    if (!animar()) {
      panel.hidden = !abrir;
      return;
    }
    panel.hidden = false;
    const alto = panel.offsetHeight + 'px';
    const relleno = window.getComputedStyle(panel).paddingBottom;
    const cerrado = { height: '0px', paddingBottom: '0px', opacity: 0, transform: 'translateY(-6px)' };
    const abierto = { height: alto, paddingBottom: relleno, opacity: 1, transform: 'none' };
    panel.style.overflow = 'hidden';
    const animacion = panel.animate(abrir ? [cerrado, abierto] : [abierto, cerrado], {
      duration: abrir ? 380 : 260,
      easing: abrir ? SUAVE : 'cubic-bezier(0.4, 0, 1, 1)',
    });
    panel.animacion = animacion;
    animacion.onfinish = function () {
      panel.animacion = null;
      panel.style.overflow = '';
      if (!abrir) panel.hidden = true;
    };
  }

  document.querySelectorAll('[data-acordeon] .acordeon__boton').forEach(function (boton) {
    const panel = document.getElementById(boton.getAttribute('aria-controls'));
    if (!panel) return;
    panel.hidden = boton.getAttribute('aria-expanded') !== 'true';

    boton.addEventListener('click', function () {
      const abierto = boton.getAttribute('aria-expanded') === 'true';
      boton.setAttribute('aria-expanded', String(!abierto));
      moverPanel(panel, !abierto);
    });
  });

  /* ---------- Talleres y actividades: aviso cuando no hay tarjetas ---------- */
  document.querySelectorAll('[data-lista-actividades]').forEach(function (lista) {
    const vacio = lista.nextElementSibling;
    if (!vacio || !vacio.hasAttribute('data-estado-vacio')) return;
    vacio.hidden = lista.querySelector('.actividad') !== null;
  });

  /* ---------- Galería con visor ----------
     La foto crece desde su miniatura y regresa a ella al cerrar. En pantallas
     táctiles se cambia de foto deslizando a los lados y se cierra deslizando
     hacia abajo; también funciona con las flechas y el teclado. */
  const visor = document.querySelector('[data-visor]');
  const botonesGaleria = Array.from(document.querySelectorAll('[data-galeria] .galeria__boton'));

  if (visor && typeof visor.showModal === 'function' && botonesGaleria.length) {
    const imagen = visor.querySelector('[data-visor-imagen]');
    const pie = visor.querySelector('[data-visor-pie]');
    const contador = visor.querySelector('[data-visor-contador]');
    const btnAnterior = visor.querySelector('[data-visor-anterior]');
    const btnSiguiente = visor.querySelector('[data-visor-siguiente]');
    const btnCerrar = visor.querySelector('[data-visor-cerrar]');
    let actual = 0;
    let ocupado = false;
    let cerrando = false;
    let arrastre = null;

    const mostrar = function (indice) {
      actual = (indice + botonesGaleria.length) % botonesGaleria.length;
      const boton = botonesGaleria[actual];
      const miniatura = boton.querySelector('img');
      const leyenda = boton.closest('figure') && boton.closest('figure').querySelector('figcaption');
      imagen.src = boton.dataset.grande || miniatura.currentSrc || miniatura.src;
      imagen.alt = miniatura.alt;
      pie.textContent = leyenda ? leyenda.textContent.trim() : '';
      contador.textContent = (actual + 1) + ' de ' + botonesGaleria.length;
    };

    const cargada = function () {
      return typeof imagen.decode === 'function' ? imagen.decode().catch(function () {}) : Promise.resolve();
    };

    // Transformación que lleva la foto grande al lugar y tamaño de su miniatura
    const haciaMiniatura = function (indice) {
      const caja = imagen.getBoundingClientRect();
      const mini = botonesGaleria[indice].querySelector('img').getBoundingClientRect();
      if (!caja.width || !mini.width) return null;
      const escala = mini.width / caja.width;
      const dx = mini.left + mini.width / 2 - (caja.left + caja.width / 2);
      const dy = mini.top + mini.height / 2 - (caja.top + caja.height / 2);
      return 'translate(' + dx + 'px, ' + dy + 'px) scale(' + escala + ')';
    };

    const abrir = function (indice) {
      mostrar(indice);
      visor.classList.remove('visor--cerrando');
      visor.style.removeProperty('--fondo-visor');
      visor.showModal();
      btnCerrar.focus();
      if (!animar()) return;
      imagen.style.opacity = '0';
      cargada().then(function () {
        imagen.style.opacity = '';
        const desde = haciaMiniatura(indice);
        if (!desde) return;
        imagen.animate([{ transform: desde }, { transform: 'none' }], { duration: 460, easing: SUAVE });
      });
    };

    // Cambia de foto: la actual sale hacia un lado y la nueva entra por el otro
    const cambiar = function (paso, desde) {
      if (ocupado || cerrando) return;
      imagen.style.transform = '';
      if (!animar()) {
        mostrar(actual + paso);
        return;
      }
      ocupado = true;
      const salida = imagen.animate([
        { transform: desde || 'none', opacity: 1 },
        { transform: 'translateX(' + (-paso * 90) + 'px)', opacity: 0 }
      ], { duration: desde ? 140 : 170, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' });
      salida.onfinish = function () {
        mostrar(actual + paso);
        cargada().then(function () {
          salida.cancel();
          const entrada = imagen.animate([
            { transform: 'translateX(' + (paso * 90) + 'px)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], { duration: 320, easing: SUAVE });
          entrada.onfinish = entrada.oncancel = function () { ocupado = false; };
        });
      };
    };

    const cerrar = function (desdeAbajo) {
      if (cerrando || !visor.open) return;
      if (!animar()) {
        visor.close();
        return;
      }
      cerrando = true;
      visor.classList.add('visor--cerrando');
      const inicio = imagen.style.transform || 'none';
      imagen.style.transform = '';
      let fotogramas;
      if (desdeAbajo) {
        fotogramas = [{ transform: inicio, opacity: 1 }, { transform: 'translateY(60vh) scale(0.7)', opacity: 0 }];
      } else {
        // Si la miniatura quedó fuera de la pantalla, se acerca sin animación antes de regresar a ella
        const raiz = document.documentElement;
        raiz.style.scrollBehavior = 'auto';
        botonesGaleria[actual].scrollIntoView({ block: 'nearest' });
        raiz.style.scrollBehavior = '';
        const hacia = haciaMiniatura(actual);
        fotogramas = hacia
          ? [{ transform: inicio, opacity: 1 }, { transform: hacia, opacity: 1 }]
          : [{ transform: inicio, opacity: 1 }, { transform: 'scale(0.9)', opacity: 0 }];
      }
      const salida = imagen.animate(fotogramas, { duration: 340, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
      salida.onfinish = function () { visor.close(); };
    };

    botonesGaleria.forEach(function (boton, i) {
      boton.addEventListener('click', function () { abrir(i); });
    });

    btnAnterior.addEventListener('click', function () { cambiar(-1); });
    btnSiguiente.addEventListener('click', function () { cambiar(1); });
    btnCerrar.addEventListener('click', function () { cerrar(); });

    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); cambiar(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); cambiar(1); }
    });

    // Escape: cierra con la misma animación que el botón
    visor.addEventListener('cancel', function (e) {
      if (!animar()) return;
      e.preventDefault();
      cerrar();
    });

    // Cierra al tocar el fondo oscuro fuera de la imagen y los controles.
    visor.addEventListener('click', function (e) {
      if (e.target === visor || e.target.classList.contains('visor__contenido')) cerrar();
    });

    visor.addEventListener('close', function () {
      imagen.getAnimations().forEach(function (a) { a.cancel(); });
      imagen.style.transform = '';
      imagen.style.opacity = '';
      imagen.removeAttribute('src');
      visor.classList.remove('visor--cerrando');
      visor.style.removeProperty('--fondo-visor');
      cerrando = false;
      ocupado = false;
      arrastre = null;
      botonesGaleria[actual].focus({ preventScroll: true });
    });

    /* Deslizar con el dedo (o arrastrar con el mouse) */
    imagen.addEventListener('dragstart', function (e) { e.preventDefault(); });

    imagen.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || ocupado || cerrando || arrastre) return;
      arrastre = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, eje: null };
      imagen.setPointerCapture(e.pointerId);
    });

    imagen.addEventListener('pointermove', function (e) {
      if (!arrastre || e.pointerId !== arrastre.id) return;
      const dx = e.clientX - arrastre.x;
      const dy = e.clientY - arrastre.y;
      arrastre.dx = dx;
      arrastre.dy = dy;
      if (!arrastre.eje && Math.hypot(dx, dy) > 8) arrastre.eje = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (arrastre.eje === 'x' && botonesGaleria.length > 1) {
        imagen.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 40) + 'deg)';
      } else if (arrastre.eje === 'y' && dy > 0) {
        imagen.style.transform = 'translateY(' + dy + 'px) scale(' + (1 - Math.min(dy, 400) / 1600) + ')';
        visor.style.setProperty('--fondo-visor', String(1 - Math.min(dy / 500, 0.6)));
      }
    });

    const soltar = function (e) {
      if (!arrastre || e.pointerId !== arrastre.id) return;
      const datos = arrastre;
      arrastre = null;
      const inicio = imagen.style.transform;
      if (datos.eje === 'x' && Math.abs(datos.dx) > 60 && botonesGaleria.length > 1 && e.type === 'pointerup') {
        cambiar(datos.dx < 0 ? 1 : -1, inicio);
      } else if (datos.eje === 'y' && datos.dy > 110 && e.type === 'pointerup') {
        cerrar(true);
      } else if (inicio) {
        // No llegó lejos: la foto regresa a su lugar con un rebote
        imagen.style.transform = '';
        visor.style.removeProperty('--fondo-visor');
        if (animar()) {
          imagen.animate([{ transform: inicio }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
        }
      }
    };

    imagen.addEventListener('pointerup', soltar);
    imagen.addEventListener('pointercancel', soltar);
  }

  /* ---------- Respuesta al tocar ----------
     Una onda suave se expande desde el punto donde se toca un botón o una
     tarjeta. El hundimiento de los botones está en styles.css (:active). */
  // Safari en iPhone solo aplica :active si la página escucha toques.
  document.addEventListener('touchstart', function () {}, { passive: true });

  if (animar()) {
    const conOnda = [
      '.boton', '.guia__opcion', '.explora__enlace', '.galeria__boton', '.acordeon__boton',
      '.red', '.nav__boton', '.visor__flecha', '.visor__cerrar'
    ].join(', ');

    document.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      const elemento = e.target.closest(conOnda);
      if (!elemento) return;
      if (window.getComputedStyle(elemento).position === 'static') elemento.style.position = 'relative';
      let capa = elemento.querySelector(':scope > .onda-capa');
      if (!capa) {
        capa = document.createElement('span');
        capa.className = 'onda-capa';
        capa.setAttribute('aria-hidden', 'true');
        elemento.appendChild(capa);
      }
      const caja = elemento.getBoundingClientRect();
      const tam = Math.hypot(caja.width, caja.height) * 2;
      const onda = document.createElement('span');
      onda.className = 'onda';
      onda.style.width = tam + 'px';
      onda.style.height = tam + 'px';
      onda.style.left = (e.clientX - caja.left - tam / 2) + 'px';
      onda.style.top = (e.clientY - caja.top - tam / 2) + 'px';
      capa.appendChild(onda);
      onda.addEventListener('animationend', function () { onda.remove(); });
    }, { passive: true });
  }

  /* ---------- Aparición al desplazarse ----------
     Las tarjetas que están más abajo aparecen suavemente al llegar a ellas.
     Lo que ya se ve al abrir la página no se oculta nunca. Sin JavaScript,
     o con movimiento reducido, todo se muestra desde el inicio. */
  if (!reduceMovimiento.matches && 'IntersectionObserver' in window) {
    const selector = [
      '.guia__opcion', '.tarjeta', '.programa', '.actividad', '.persona', '.galeria > li',
      '.explora > li', '.acordeon__item', '.bloques > div', '.llamado', '.estado-vacio',
      '.presentacion__imagen', '.presentacion__texto', '.contacto > *', '.encabezado-seccion'
    ].join(', ');

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('revelado');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll(selector).forEach(function (elemento) {
      if (elemento.getBoundingClientRect().top < window.innerHeight) return;
      const posicion = Array.prototype.indexOf.call(elemento.parentElement.children, elemento);
      elemento.style.setProperty('--retraso', (posicion % 4) * 90 + 'ms');
      elemento.classList.add('revelar');
      observador.observe(elemento);
    });
  }

  /* ---------- Logotipo ----------
     La abejita del logotipo recorre su estela punteada al abrir la página, cada
     15 segundos y al dar clic en el logotipo. En el inicio, el clic repite el
     vuelo (y regresa al principio de la página); en las demás páginas lleva al
     inicio, donde vuelve a volar. Con movimiento reducido el logotipo queda quieto. */
  const logo = document.querySelector('[data-logo]');
  if (logo && animar()) {
    const revelarEstela = logo.querySelector('[data-logo-estela]');
    const recorrido = logo.querySelector('[data-logo-abeja]');
    const abejaLogo = logo.querySelector('.logo__abeja');
    const estelaLogo = logo.querySelector('.logo__estela');
    const DURACION_VUELO = 2600;
    const CADA = 15000;
    let siguienteVuelo = null;
    let volando = false;

    if (revelarEstela && recorrido && abejaLogo && estelaLogo && typeof recorrido.beginElement === 'function') {
      // Aparece al principio de la estela y la recorre; la estela se dibuja detrás de ella
      const despegar = function () {
        logo.classList.add('logo--volando');
        revelarEstela.beginElement();
        recorrido.beginElement();
        abejaLogo.animate({ scale: ['0', '1.2', '1'], offset: [0, 0.6, 1] }, { duration: 320, easing: 'ease-out' });
        window.setTimeout(function () {
          logo.classList.remove('logo--volando');
          abejaLogo.animate({ scale: ['1 1', '1.18 0.84', '0.94 1.06', '1 1'] }, { duration: 500, easing: 'ease-out' });
          volando = false;
        }, DURACION_VUELO);
      };

      const volar = function (primeraVez) {
        window.clearTimeout(siguienteVuelo);
        siguienteVuelo = window.setTimeout(repetir, CADA);
        if (volando) return;
        volando = true;
        if (primeraVez) {
          despegar();
          return;
        }
        // Antes de repetir, la abejita desaparece con un saltito y la estela se borra
        const salida = abejaLogo.animate({ scale: ['1', '1.25', '0'], offset: [0, 0.4, 1] }, { duration: 260, easing: 'ease-in', fill: 'forwards' });
        const borrado = estelaLogo.animate({ opacity: [1, 0] }, { duration: 260, fill: 'forwards' });
        salida.onfinish = function () {
          despegar();
          salida.cancel();
          borrado.cancel();
        };
      };

      const repetir = function () {
        if (document.hidden) {
          siguienteVuelo = window.setTimeout(repetir, CADA);
          return;
        }
        volar(false);
      };

      volar(true);

      logo.addEventListener('click', function (evento) {
        const sinIndice = function (ruta) { return ruta.replace(/index\.html$/, ''); };
        if (sinIndice(new URL(logo.href, window.location.href).pathname) !== sinIndice(window.location.pathname)) return;
        evento.preventDefault();
        if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
        volar(false);
      });
    }
  }

  /* ---------- Abejas y flores juguetonas ----------
     Al tocar una abeja (o pasarle el mouse encima) da una vuelta de alegría y
     suelta corazones. Las flores brotan cuando aparecen en pantalla y, al
     tocarlas, giran y sueltan pétalos. Con movimiento reducido no se mueven. */
  const CORAZON = '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.7-8-10.3A4.4 4.4 0 0 1 12 7.8a4.4 4.4 0 0 1 8 2.4c0 5.6-8 10.3-8 10.3Z" fill="#F4A9B8" stroke="#1D1B16" stroke-width="2" stroke-linejoin="round"/></svg>';

  function dibujoPetalo(color) {
    const relleno = /^#[0-9a-f]{3,8}$/i.test(color) ? color : '#FFFFFF';
    return '<svg viewBox="0 0 12 18"><ellipse cx="6" cy="9" rx="4.6" ry="7.6" fill="' + relleno + '" stroke="#1D1B16" stroke-width="1.6"/></svg>';
  }

  // Lanza figuritas desde un elemento: hacia arriba (corazones) o alrededor (pétalos)
  function lanzar(origen, dibujo, cantidad, clase, haciaArriba) {
    const caja = origen.getBoundingClientRect();
    const x = caja.left + caja.width / 2;
    const y = caja.top + caja.height * 0.4;
    for (let i = 0; i < cantidad; i++) {
      const figura = document.createElement('span');
      figura.className = 'particula ' + clase;
      figura.setAttribute('aria-hidden', 'true');
      figura.innerHTML = dibujo;
      figura.style.left = x + 'px';
      figura.style.top = y + 'px';
      document.body.appendChild(figura);

      let dx;
      let dy;
      let giro;
      if (haciaArriba) {
        dx = (i - (cantidad - 1) / 2) * 22 + (Math.random() - 0.5) * 14;
        dy = -60 - Math.random() * 40;
        giro = (Math.random() - 0.5) * 50;
      } else {
        const angulo = (i / cantidad) * Math.PI * 2 + Math.random() * 0.6;
        const distancia = 40 + Math.random() * 24;
        dx = Math.cos(angulo) * distancia;
        dy = Math.sin(angulo) * distancia + 20;
        giro = (Math.random() - 0.5) * 400;
      }
      figura.animate([
        { transform: 'translate(0px, 0px) scale(0.3) rotate(0deg)', opacity: 0 },
        { transform: 'translate(' + dx * 0.45 + 'px, ' + dy * 0.45 + 'px) scale(1.1) rotate(' + giro / 2 + 'deg)', opacity: 1, offset: 0.3 },
        { transform: 'translate(' + dx + 'px, ' + dy + 'px) scale(0.8) rotate(' + giro + 'deg)', opacity: 0 }
      ], {
        duration: 900 + Math.random() * 300,
        delay: i * 60,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'both'
      }).onfinish = function () { figura.remove(); };
    }
  }

  // Responde al toque y, con mouse, al pasar encima (sin repetir mientras se mueve)
  function alTocar(elemento, accion) {
    let ocupado = false;
    function jugar() {
      if (ocupado) return;
      ocupado = true;
      accion().onfinish = function () { ocupado = false; };
    }
    elemento.addEventListener('click', jugar);
    elemento.addEventListener('pointerenter', function (evento) {
      if (evento.pointerType === 'mouse') jugar();
    });
  }

  if (animar()) {
    document.querySelectorAll('[data-abeja-juguetona]').forEach(function (abeja) {
      const cuerpo = abeja.querySelector('.abeja__pirueta');
      if (!cuerpo) return;
      alTocar(abeja, function () {
        lanzar(abeja, CORAZON, 4, 'particula--corazon', true);
        return cuerpo.animate({
          translate: ['0px 0px', '0px -18px', '0px -20px', '0px 0px', '0px 0px'],
          rotate: ['0deg', '-200deg', '-360deg', '-360deg', '-360deg'],
          scale: ['1', '1.12', '1.12', '1.16 0.84', '1'],
          offset: [0, 0.35, 0.6, 0.8, 1]
        }, { duration: 950, easing: 'ease-in-out' });
      });
    });

    const flores = document.querySelectorAll('.flor');
    flores.forEach(function (flor) {
      alTocar(flor, function () {
        lanzar(flor, dibujoPetalo(flor.style.getPropertyValue('--petalo').trim()), 6, 'particula--petalo', false);
        return flor.animate([
          { transform: 'rotate(0deg) scale(1)' },
          { transform: 'rotate(180deg) scale(1.3)', offset: 0.45 },
          { transform: 'rotate(360deg) scale(1)' }
        ], { duration: 800, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)' });
      });
    });

    // Las flores brotan (de chiquitas a su tamaño) cuando llegan a la pantalla
    if ('IntersectionObserver' in window) {
      const brotes = new Map();
      flores.forEach(function (flor) {
        const brote = flor.animate({ scale: ['0', '1.2', '1'], offset: [0, 0.6, 1] }, { duration: 700, easing: 'ease-out' });
        brote.pause();
        brotes.set(flor, brote);
      });
      const observadorFlores = new IntersectionObserver(function (entradas) {
        let orden = 0;
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          observadorFlores.unobserve(entrada.target);
          const brote = brotes.get(entrada.target);
          window.setTimeout(function () { brote.play(); }, 150 + orden * 160);
          orden += 1;
        });
      });
      flores.forEach(function (flor) { observadorFlores.observe(flor); });
    }
  }

  /* ---------- Agendar cita ----------
     Servicio, día, hora y datos de contacto en agendar-cita.html. La cita se
     registra en el sistema (base de datos) a través de AGENDA.urlCitas.
     Mientras urlCitas esté vacía, la agenda funciona en MODO DE PRUEBA: los
     horarios ocupados son un ejemplo (AGENDA_EJEMPLO) y las citas se guardan
     solo en el navegador de quien las hace, sin nombre ni teléfono; no llegan
     al centro. Qué recibe y qué responde la base de datos: ver LEEME.md. */
  const AGENDA = {
    // Dirección del servicio que guarda las citas, por ejemplo 'https://api.tu-dominio.mx/citas'.
    // Vacía = modo de prueba.
    urlCitas: '',
    // Horarios por día de la semana (0 = domingo … 6 = sábado). Lista vacía = sin citas.
    // POR CONFIRMAR con el centro: estos son de ejemplo.
    horarios: {
      0: [],
      1: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      2: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      3: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      4: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      5: ['09:00', '10:00', '11:00', '12:00', '16:00', '17:00'],
      6: []
    },
    // Meses que se pueden consultar, contando el actual
    meses: 3
  };

  // Solo en modo de prueba, para que la agenda no se vea vacía (cada fecha siempre sale igual)
  const AGENDA_EJEMPLO = {
    // De cada 100 horarios, cuántos salen ocupados
    ocupados: 35,
    // De cada 100 días con citas, cuántos salen llenos
    diasLlenos: 10,
    // Los próximos días se ven más llenos, como en una agenda real
    diasCercanos: 10
  };

  const agenda = document.querySelector('[data-agenda]');
  if (agenda) {
    const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const conectada = Boolean(String(AGENDA.urlCitas || '').trim());
    const sinJs = document.querySelector('[data-agenda-sin-js]');
    const contenedorDias = agenda.querySelector('[data-dias]');
    const tituloMes = agenda.querySelector('[data-mes-titulo]');
    const flechaAnterior = agenda.querySelector('[data-mes="-1"]');
    const flechaSiguiente = agenda.querySelector('[data-mes="1"]');
    const contenedorHoras = agenda.querySelector('[data-horas]');
    const indicacionHoras = agenda.querySelector('[data-horas-vacio]');
    const enviar = agenda.querySelector('[data-agenda-enviar]');
    const textoEnviar = agenda.querySelector('[data-enviar-texto]');
    const aviso = agenda.querySelector('[data-agenda-mensaje]');
    const lista = document.querySelector('[data-agenda-lista]');
    const pasos = {
      servicio: agenda.querySelector('[data-paso="servicio"]'),
      dia: agenda.querySelector('[data-paso="dia"]'),
      hora: agenda.querySelector('[data-paso="hora"]'),
      datos: agenda.querySelector('[data-paso="datos"]')
    };
    const resumen = {
      servicio: agenda.querySelector('[data-resumen="servicio"]'),
      dia: agenda.querySelector('[data-resumen="dia"]'),
      hora: agenda.querySelector('[data-resumen="hora"]')
    };
    const campos = {
      nombre: agenda.querySelector('[name="nombre"]'),
      telefono: agenda.querySelector('[name="telefono"]'),
      edad: agenda.querySelector('[name="edad"]'),
      aviso: agenda.querySelector('[name="aviso"]')
    };
    const eleccion = { servicio: null, dia: null, hora: null };

    // Las fechas se manejan en UTC para que no las mueva la zona horaria del dispositivo
    const partesHoy = hoyMexico.split('-').map(Number);
    const hoy = Date.UTC(partesHoy[0], partesHoy[1] - 1, partesHoy[2]);
    const claveFecha = function (fecha) { return new Date(fecha).toISOString().slice(0, 10); };
    const fechaDeClave = function (clave) { return Date.parse(clave + 'T00:00:00Z'); };

    const textoFecha = function (fecha) {
      const f = new Date(fecha);
      return DIAS[f.getUTCDay()] + ' ' + f.getUTCDate() + ' de ' + MESES[f.getUTCMonth()];
    };
    const textoHora = function (hora) {
      const partes = hora.split(':').map(Number);
      return ((partes[0] + 11) % 12 + 1) + ':' + String(partes[1]).padStart(2, '0') + (partes[0] < 12 ? ' a. m.' : ' p. m.');
    };
    const mayuscula = function (texto) { return texto.charAt(0).toUpperCase() + texto.slice(1); };

    /* Sistema de citas: base de datos si hay urlCitas; si no, modo de prueba */
    const LLAVE_PRUEBA = 'con-nectar-citas-prueba';
    // Horarios que ya tienen cita en el sistema, como 'AAAA-MM-DD HH:MM'
    let ocupadosSistema = new Set();

    const leerPrueba = function () {
      try {
        const guardadas = JSON.parse(window.localStorage.getItem(LLAVE_PRUEBA) || '[]');
        return Array.isArray(guardadas) ? guardadas : [];
      } catch (error) {
        return [];
      }
    };
    const guardarPrueba = function (citas) {
      try {
        if (citas.length) window.localStorage.setItem(LLAVE_PRUEBA, JSON.stringify(citas));
        else window.localStorage.removeItem(LLAVE_PRUEBA);
        return true;
      } catch (error) {
        return false;
      }
    };
    const errorConEstado = function (estado) {
      const error = new Error('El sistema de citas respondió ' + estado);
      error.estado = estado;
      return error;
    };

    const sistema = {
      // Horarios ocupados entre dos fechas (AAAA-MM-DD): [{ fecha, hora }]
      ocupados: function (desde, hasta) {
        if (!conectada) {
          return Promise.resolve(leerPrueba().concat(Array.from(ocupadosSistema, function (clave) {
            return { fecha: clave.slice(0, 10), hora: clave.slice(11) };
          })));
        }
        const url = new URL(AGENDA.urlCitas, window.location.href);
        url.searchParams.set('desde', desde);
        url.searchParams.set('hasta', hasta);
        return fetch(url, { headers: { Accept: 'application/json' } }).then(function (respuesta) {
          if (!respuesta.ok) throw errorConEstado(respuesta.status);
          return respuesta.json();
        }).then(function (datos) {
          return Array.isArray(datos && datos.ocupados) ? datos.ocupados : [];
        });
      },
      // Registra la cita. Responde { folio }; si el horario ya se ocupó, falla con estado 409.
      registrar: function (cita) {
        if (!conectada) {
          // En la prueba no se guardan nombre ni teléfono: solo lo necesario para marcar el horario
          const citas = leerPrueba();
          const repetida = citas.some(function (c) { return c.fecha === cita.fecha && c.hora === cita.hora; });
          if (repetida) return Promise.reject(errorConEstado(409));
          const folio = 'PRUEBA-' + Date.now().toString(36).slice(-5).toUpperCase();
          citas.push({ folio: folio, servicio: cita.servicio, fecha: cita.fecha, hora: cita.hora });
          const guardada = guardarPrueba(citas);
          return new Promise(function (listo) {
            window.setTimeout(function () { listo({ folio: folio, guardada: guardada }); }, 450);
          });
        }
        return fetch(new URL(AGENDA.urlCitas, window.location.href), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(cita)
        }).then(function (respuesta) {
          if (!respuesta.ok) throw errorConEstado(respuesta.status);
          return respuesta.json().catch(function () { return {}; });
        });
      }
    };

    // Número fijo entre 0 y 99 para cada texto: el ejemplo no cambia al recargar
    const sorteo = function (texto) {
      let h = 2166136261;
      for (let i = 0; i < texto.length; i++) {
        h ^= texto.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return (h >>> 0) % 100;
    };

    // Solo en modo de prueba: horarios ocupados de ejemplo
    const ocupadoDeEjemplo = function (fecha, hora) {
      if (conectada) return false;
      const clave = claveFecha(fecha);
      const faltan = Math.round((fecha - hoy) / 86400000);
      const cercania = Math.max(0, AGENDA_EJEMPLO.diasCercanos - faltan) / AGENDA_EJEMPLO.diasCercanos;
      if (sorteo(clave + ' lleno') < AGENDA_EJEMPLO.diasLlenos + 35 * cercania) return true;
      return sorteo(clave + ' ' + hora) < AGENDA_EJEMPLO.ocupados + 35 * cercania;
    };

    const horariosDe = function (fecha) {
      const clave = claveFecha(fecha);
      return (AGENDA.horarios[new Date(fecha).getUTCDay()] || []).map(function (hora) {
        return { hora: hora, libre: !ocupadosSistema.has(clave + ' ' + hora) && !ocupadoDeEjemplo(fecha, hora) };
      });
    };

    const estadoDe = function (fecha) {
      if (fecha <= hoy) return { estado: 'pasado', libres: 0 };
      const horarios = horariosDe(fecha);
      if (!horarios.length) return { estado: 'cerrado', libres: 0 };
      const libres = horarios.filter(function (h) { return h.libre; }).length;
      if (!libres) return { estado: 'lleno', libres: 0 };
      return { estado: libres <= 2 ? 'pocos' : 'disponible', libres: libres };
    };

    const lectura = function (fecha, info) {
      const libres = info.libres === 1 ? '1 horario libre' : info.libres + ' horarios libres';
      const textos = {
        disponible: 'disponible, ' + libres,
        pocos: 'pocos lugares, ' + libres,
        lleno: 'lleno',
        cerrado: 'sin citas',
        pasado: fecha === hoy ? 'hoy, elige a partir de mañana' : 'ya pasó'
      };
      return textoFecha(fecha) + ', ' + textos[info.estado];
    };

    // Meses: el actual y los siguientes. Si este mes ya no tiene lugares, empieza en el siguiente.
    let mesVisible = 0;
    const mesDe = function (desplazamiento) {
      const f = new Date(Date.UTC(partesHoy[0], partesHoy[1] - 1 + desplazamiento, 1));
      return { anio: f.getUTCFullYear(), mes: f.getUTCMonth() };
    };
    const tieneLugares = function (desplazamiento) {
      const m = mesDe(desplazamiento);
      const total = new Date(Date.UTC(m.anio, m.mes + 1, 0)).getUTCDate();
      for (let d = 1; d <= total; d++) {
        const estado = estadoDe(Date.UTC(m.anio, m.mes, d)).estado;
        if (estado === 'disponible' || estado === 'pocos') return true;
      }
      return false;
    };

    const pintarMes = function (direccion) {
      const m = mesDe(mesVisible);
      tituloMes.textContent = mayuscula(MESES[m.mes]) + ' ' + m.anio;
      flechaAnterior.disabled = mesVisible <= 0;
      flechaSiguiente.disabled = mesVisible >= AGENDA.meses - 1;

      const total = new Date(Date.UTC(m.anio, m.mes + 1, 0)).getUTCDate();
      const huecos = (new Date(Date.UTC(m.anio, m.mes, 1)).getUTCDay() + 6) % 7; // la semana empieza en lunes
      const piezas = document.createDocumentFragment();
      for (let i = 0; i < huecos; i++) {
        const hueco = document.createElement('span');
        hueco.className = 'dia dia--vacio';
        hueco.setAttribute('aria-hidden', 'true');
        piezas.appendChild(hueco);
      }
      for (let d = 1; d <= total; d++) {
        const fecha = Date.UTC(m.anio, m.mes, d);
        const clave = claveFecha(fecha);
        const info = estadoDe(fecha);
        const celda = document.createElement('label');
        celda.className = 'dia dia--' + info.estado + (fecha === hoy ? ' dia--hoy' : '') + (eleccion.dia === clave ? ' dia--elegido' : '');
        const entrada = document.createElement('input');
        entrada.className = 'dia__entrada';
        entrada.type = 'radio';
        entrada.name = 'dia';
        entrada.value = clave;
        entrada.disabled = info.estado !== 'disponible' && info.estado !== 'pocos';
        entrada.checked = eleccion.dia === clave;
        const numero = document.createElement('span');
        numero.className = 'dia__numero';
        numero.setAttribute('aria-hidden', 'true');
        numero.textContent = d;
        const punto = document.createElement('span');
        punto.className = 'dia__punto';
        punto.setAttribute('aria-hidden', 'true');
        const texto = document.createElement('span');
        texto.className = 'sr-only';
        texto.textContent = lectura(fecha, info);
        celda.append(entrada, numero, punto, texto);
        piezas.appendChild(celda);
      }
      contenedorDias.replaceChildren(piezas);
      if (direccion && animar()) {
        contenedorDias.animate([
          { opacity: 0, transform: 'translateX(' + direccion * 32 + 'px)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 320, easing: SUAVE });
      }
    };

    const pintarHoras = function () {
      if (!eleccion.dia) {
        indicacionHoras.textContent = 'Primero elige un día en el calendario.';
        contenedorHoras.replaceChildren();
        return;
      }
      const fecha = fechaDeClave(eleccion.dia);
      indicacionHoras.textContent = 'Horarios del ' + textoFecha(fecha) + ':';
      const piezas = document.createDocumentFragment();
      horariosDe(fecha).forEach(function (h) {
        const opcion = document.createElement('label');
        opcion.className = 'hora' + (h.libre ? '' : ' hora--ocupada') + (h.hora === eleccion.hora ? ' hora--elegida' : '');
        const entrada = document.createElement('input');
        entrada.type = 'radio';
        entrada.name = 'hora';
        entrada.value = h.hora;
        entrada.disabled = !h.libre;
        entrada.checked = h.hora === eleccion.hora;
        const texto = document.createElement('span');
        texto.className = 'hora__texto';
        texto.textContent = textoHora(h.hora);
        opcion.append(entrada, texto);
        const estado = document.createElement('span');
        estado.className = h.libre ? 'sr-only' : 'hora__estado';
        estado.textContent = h.libre ? ', libre' : 'Ocupado';
        opcion.appendChild(estado);
        piezas.appendChild(opcion);
      });
      contenedorHoras.replaceChildren(piezas);
      if (animar()) {
        Array.prototype.forEach.call(contenedorHoras.children, function (opcion, i) {
          opcion.animate([
            { opacity: 0, transform: 'translateY(10px) scale(0.92)' },
            { opacity: 1, transform: 'none' }
          ], { duration: 340, delay: i * 45, easing: SUAVE, fill: 'backwards' });
        });
      }
    };

    // Rebote pequeño al elegir algo
    const rebotar = function (elemento) {
      if (elemento && animar()) {
        elemento.animate({ scale: ['1', '1.12', '0.97', '1'] }, { duration: 420, easing: 'ease-out' });
      }
    };

    /* Datos de contacto: solo nombre, teléfono y, si quieren, la edad */
    const digitosTelefono = function () {
      const d = soloDigitos(campos.telefono.value);
      return d.length === 12 && d.startsWith('52') ? d.slice(2) : d;
    };
    const ERRORES = {
      nombre: function () { return campos.nombre.value.trim().length < 2 ? 'Escribe tu nombre.' : ''; },
      telefono: function () {
        const d = digitosTelefono();
        if (!d) return 'Escribe un teléfono para confirmarte la cita.';
        return d.length === 10 ? '' : 'El teléfono debe tener 10 dígitos.';
      },
      aviso: function () { return campos.aviso.checked ? '' : 'Para registrar la cita, acepta el aviso de privacidad.'; }
    };
    const marcarCampo = function (nombre, mensaje) {
      const salida = agenda.querySelector('[data-error-de="' + nombre + '"]');
      salida.textContent = mensaje;
      salida.hidden = !mensaje;
      if (mensaje) campos[nombre].setAttribute('aria-invalid', 'true');
      else campos[nombre].removeAttribute('aria-invalid');
    };
    // Devuelve el primer campo con error (o null). Con mostrar = true, enseña los mensajes.
    const revisarDatos = function (mostrar) {
      let primero = null;
      Object.keys(ERRORES).forEach(function (nombre) {
        const mensaje = ERRORES[nombre]();
        if (mostrar) marcarCampo(nombre, mensaje);
        if (mensaje && !primero) primero = campos[nombre];
      });
      return primero;
    };

    let estabaCompleto = false;
    const actualizar = function () {
      const valores = {
        servicio: eleccion.servicio ? eleccion.servicio.value : '',
        dia: eleccion.dia ? mayuscula(textoFecha(fechaDeClave(eleccion.dia))) : '',
        hora: eleccion.hora ? textoHora(eleccion.hora) : ''
      };
      Object.keys(resumen).forEach(function (clave) {
        resumen[clave].textContent = valores[clave] || 'Sin elegir';
        resumen[clave].classList.toggle('resumen__vacio', !valores[clave]);
        pasos[clave].classList.toggle('agenda__paso--listo', Boolean(valores[clave]));
      });
      const datosListos = !revisarDatos(false);
      pasos.datos.classList.toggle('agenda__paso--listo', datosListos);

      const completo = Boolean(eleccion.servicio && eleccion.dia && eleccion.hora) && datosListos;
      enviar.classList.toggle('resumen__enviar--listo', completo);
      if (completo && !estabaCompleto) {
        aviso.textContent = '';
        if (animar()) {
          enviar.animate({ scale: ['1', '1.08', '0.98', '1.03', '1'] }, { duration: 600, easing: 'ease-out' });
        }
      }
      estabaCompleto = completo;
    };

    // Lleva a un paso (o campo) con un mensaje y una pequeña sacudida
    const irAPaso = function (paso, mensaje, campo) {
      aviso.textContent = mensaje;
      const elemento = pasos[paso];
      elemento.scrollIntoView({ behavior: animar() ? 'smooth' : 'auto', block: 'center' });
      const destino = campo || elemento.querySelector('input:not(:disabled)');
      if (destino) destino.focus({ preventScroll: true });
      if (animar()) {
        elemento.animate({ translate: ['0px', '-10px', '10px', '-6px', '6px', '0px'] }, { duration: 450, easing: 'ease-in-out' });
      }
    };

    // Paso 1: servicio (se puede preseleccionar con ?servicio=terapia-de-lenguaje)
    const servicios = agenda.querySelectorAll('input[name="servicio"]');
    const pedido = new URLSearchParams(window.location.search).get('servicio');
    servicios.forEach(function (entrada) {
      if (pedido && entrada.dataset.clave === pedido) {
        entrada.checked = true;
        eleccion.servicio = entrada;
      }
      entrada.addEventListener('change', function () {
        eleccion.servicio = entrada;
        rebotar(entrada.nextElementSibling);
        actualizar();
      });
    });

    // Paso 2: día
    contenedorDias.addEventListener('change', function (evento) {
      const entrada = evento.target;
      if (entrada.name !== 'dia') return;
      eleccion.dia = entrada.value;
      eleccion.hora = null;
      contenedorDias.querySelectorAll('.dia--elegido').forEach(function (celda) { celda.classList.remove('dia--elegido'); });
      const celda = entrada.closest('.dia');
      celda.classList.add('dia--elegido');
      rebotar(celda);
      pintarHoras();
      actualizar();
      // En el celular, los horarios quedan debajo del calendario: se acercan a la vista
      if (window.matchMedia('(max-width: 899px)').matches) {
        pasos.hora.scrollIntoView({ behavior: animar() ? 'smooth' : 'auto', block: 'nearest' });
      }
    });

    [flechaAnterior, flechaSiguiente].forEach(function (flecha) {
      flecha.addEventListener('click', function () {
        const direccion = Number(flecha.dataset.mes);
        const siguiente = mesVisible + direccion;
        if (siguiente < 0 || siguiente > AGENDA.meses - 1) return;
        mesVisible = siguiente;
        pintarMes(direccion);
      });
    });

    // Paso 3: hora
    contenedorHoras.addEventListener('change', function (evento) {
      const entrada = evento.target;
      if (entrada.name !== 'hora') return;
      eleccion.hora = entrada.value;
      contenedorHoras.querySelectorAll('.hora--elegida').forEach(function (opcion) { opcion.classList.remove('hora--elegida'); });
      const opcion = entrada.closest('.hora');
      opcion.classList.add('hora--elegida');
      rebotar(opcion);
      actualizar();
    });

    // Paso 4: datos. Los errores aparecen al salir del campo o al registrar, y se quitan al corregir.
    Object.keys(ERRORES).forEach(function (nombre) {
      const campo = campos[nombre];
      campo.addEventListener('input', function () {
        if (campo.hasAttribute('aria-invalid') && !ERRORES[nombre]()) marcarCampo(nombre, '');
        actualizar();
      });
      campo.addEventListener('change', function () {
        if (nombre === 'aviso' ? campo.hasAttribute('aria-invalid') : campo.value.trim()) marcarCampo(nombre, ERRORES[nombre]());
        actualizar();
      });
    });

    /* Registro de la cita */
    const FALTA = {
      servicio: 'Falta elegir el servicio.',
      dia: 'Falta elegir el día.',
      hora: 'Falta elegir la hora.'
    };
    const pintarTodo = function () {
      pintarMes(0);
      pintarHoras();
      actualizar();
    };
    const avisoPrueba = document.querySelector('[data-citas-prueba]');
    const textoPrueba = document.querySelector('[data-citas-prueba-texto]');
    const contarPrueba = function () {
      if (!avisoPrueba || conectada) return;
      const total = ocupadosSistema.size;
      avisoPrueba.hidden = !total;
      textoPrueba.textContent = total === 1 ? 'Tienes 1 cita de prueba en este navegador.' : 'Tienes ' + total + ' citas de prueba en este navegador.';
    };

    const mostrarLista = function (cita, respuesta) {
      lista.querySelector('[data-lista-titulo]').textContent = conectada ? '¡Listo! Registramos tu solicitud de cita' : 'Cita de prueba registrada';
      let texto = 'El centro te contactará al ' + formatoTelefono(cita.telefono) + ' para confirmarla.';
      if (!conectada) {
        texto = respuesta.guardada
          ? 'Se guardó solo en este navegador para mostrar cómo funcionará la agenda; todavía no llega al centro. Si vuelves a abrir ese día, verás ese horario ocupado.'
          : 'Es solo una prueba y no llega al centro. Este navegador no permite guardarla, así que se borrará al cerrar la página.';
      }
      lista.querySelector('[data-lista-texto]').textContent = texto;
      lista.querySelector('[data-lista="servicio"]').textContent = eleccion.servicio.value;
      lista.querySelector('[data-lista="dia"]').textContent = mayuscula(textoFecha(fechaDeClave(cita.fecha)));
      lista.querySelector('[data-lista="hora"]').textContent = textoHora(cita.hora);
      const folio = respuesta && respuesta.folio ? String(respuesta.folio) : '';
      lista.querySelector('[data-lista="folio"]').textContent = folio;
      lista.querySelector('[data-lista-fila-folio]').hidden = !folio;

      agenda.hidden = true;
      lista.hidden = false;
      contarPrueba();
      lista.scrollIntoView({ behavior: 'auto', block: 'start' });
      lista.focus({ preventScroll: true });
      if (animar()) {
        lista.animate([
          { opacity: 0, transform: 'translateY(16px) scale(0.96)' },
          { opacity: 1, transform: 'none' }
        ], { duration: 420, easing: SUAVE });
        // Corazones cuando termina el desplazamiento, para que salgan del ícono
        const icono = lista.querySelector('.agenda-lista__icono');
        let lanzados = false;
        const corazones = function () {
          if (lanzados) return;
          lanzados = true;
          lanzar(icono, CORAZON, 6, 'particula--corazon', true);
        };
        window.addEventListener('scrollend', corazones, { once: true });
        window.setTimeout(corazones, 900);
      }
    };

    let registrando = false;
    agenda.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (registrando) return;
      const falta = !eleccion.servicio ? 'servicio' : (!eleccion.dia ? 'dia' : (!eleccion.hora ? 'hora' : ''));
      if (falta) {
        irAPaso(falta, FALTA[falta]);
        return;
      }
      const campoConError = revisarDatos(true);
      if (campoConError) {
        irAPaso('datos', 'Revisa tus datos de contacto.', campoConError);
        return;
      }

      const cita = {
        servicio: eleccion.servicio.dataset.clave,
        fecha: eleccion.dia,
        hora: eleccion.hora,
        nombre: campos.nombre.value.trim().replace(/\s+/g, ' '),
        telefono: digitosTelefono(),
        edad: campos.edad.value,
        aceptaAvisoPrivacidad: true
      };
      registrando = true;
      enviar.setAttribute('aria-disabled', 'true');
      textoEnviar.textContent = 'Registrando…';
      aviso.textContent = '';

      sistema.registrar(cita).then(function (respuesta) {
        ocupadosSistema.add(cita.fecha + ' ' + cita.hora);
        mostrarLista(cita, respuesta || {});
      }, function (error) {
        if (error && error.estado === 409) {
          // Alguien más tomó ese horario: se marca ocupado y se pide otra hora
          ocupadosSistema.add(cita.fecha + ' ' + cita.hora);
          eleccion.hora = null;
          pintarTodo();
          irAPaso('hora', 'Ese horario se acaba de ocupar. Elige otra hora, por favor.');
          return;
        }
        aviso.textContent = 'No pudimos registrar tu cita. Revisa tu conexión e inténtalo de nuevo, o escríbenos desde la página de contacto.';
      }).then(function () {
        registrando = false;
        enviar.removeAttribute('aria-disabled');
        textoEnviar.textContent = 'Registrar cita';
      });
    });

    // Después de registrar: otra cita con los mismos datos de contacto
    lista.querySelector('[data-agenda-otra]').addEventListener('click', function () {
      eleccion.dia = null;
      eleccion.hora = null;
      estabaCompleto = false;
      pintarTodo();
      lista.hidden = true;
      agenda.hidden = false;
      pasos.servicio.scrollIntoView({ behavior: 'auto', block: 'start' });
      const elegido = agenda.querySelector('input[name="servicio"]:checked') || servicios[0];
      elegido.focus({ preventScroll: true });
    });

    // Modo de prueba: borrar las citas guardadas en este navegador
    const borrarPrueba = document.querySelector('[data-borrar-prueba]');
    if (borrarPrueba) {
      borrarPrueba.addEventListener('click', function () {
        guardarPrueba([]);
        ocupadosSistema = new Set();
        pintarTodo();
        contarPrueba();
        const destino = agenda.hidden ? lista : pasos.servicio.querySelector('input');
        destino.focus({ preventScroll: true });
      });
    }

    // Arranque: se consultan los horarios ocupados y luego aparece la agenda
    document.querySelectorAll('[data-agenda-prueba]').forEach(function (el) { el.hidden = conectada; });
    if (conectada) sinJs.textContent = 'Consultando la agenda…';
    const ultimoMes = mesDe(AGENDA.meses - 1);
    sistema.ocupados(claveFecha(hoy + 86400000), claveFecha(Date.UTC(ultimoMes.anio, ultimoMes.mes + 1, 0))).then(function (ocupados) {
      ocupadosSistema = new Set(ocupados.map(function (o) { return o.fecha + ' ' + o.hora; }));
      if (!tieneLugares(0) && AGENDA.meses > 1) mesVisible = 1;
      sinJs.hidden = true;
      agenda.hidden = false;
      pintarTodo();
      contarPrueba();
    }, function () {
      sinJs.innerHTML = 'No pudimos consultar la agenda en este momento. Intenta más tarde o <a href="contacto.html">escríbenos</a> para pedir tu cita.';
    });
  }

  /* ---------- Abeja del inicio ----------
     Vuela una vez por la estela punteada y se queda flotando en su lugar.
     Cada 9 a 15 segundos regresa por la estela a la flor rosa, toma néctar
     y vuelve. Sin JavaScript, o con movimiento reducido, aparece quieta. */
  const vuelo = document.querySelector('[data-vuelo]');
  if (vuelo && animar()) {
    const abeja = vuelo.querySelector('[data-vuelo-abeja]');
    const ida = vuelo.querySelector('[data-vuelo-ida]');
    const visita = vuelo.querySelector('[data-vuelo-visita]');
    const flor = vuelo.querySelector('[data-flor-visitada]');
    const cuerpo = vuelo.querySelector('[data-vuelo-abeja] .abeja__pirueta');
    let enPantalla = true;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entradas) {
        enPantalla = entradas[0].isIntersecting;
      }).observe(vuelo);
    }

    const despues = function (ms, accion) { window.setTimeout(accion, ms); };

    // Rebote al llegar
    const aterrizar = function () {
      if (cuerpo) cuerpo.animate({ scale: ['1 1', '1.16 0.84', '0.92 1.08', '1 1'] }, { duration: 600, easing: 'ease-out' });
    };

    // En la flor: mete la cabeza dos veces, la flor rebota y salen corazones
    const tomarNectar = function () {
      if (cuerpo) {
        cuerpo.animate({
          translate: ['0px 0px', '0px 5px', '0px 0px', '0px 5px', '0px 0px'],
          rotate: ['0deg', '12deg', '0deg', '12deg', '0deg']
        }, { duration: 1300, easing: 'ease-in-out' });
      }
      if (flor) {
        flor.animate([
          { transform: 'scale(1, 1)' },
          { transform: 'scale(1.18, 0.84)' },
          { transform: 'scale(0.92, 1.1)' },
          { transform: 'scale(1, 1)' }
        ], { duration: 700, delay: 150, easing: 'ease-in-out' });
        lanzar(flor, CORAZON, 3, 'particula--corazon', true);
      }
    };

    // La visita dura 7 s: 2.8 s de ida, 1.4 s en la flor y 2.8 s de regreso
    const programarVisita = function () {
      despues(9000 + Math.random() * 6000, function () {
        if (document.hidden || !enPantalla) {
          programarVisita();
          return;
        }
        vuelo.classList.add('vuelo--viajando', 'vuelo--de-ida');
        visita.beginElement();
        despues(2800, function () {
          vuelo.classList.remove('vuelo--viajando');
          tomarNectar();
        });
        despues(4200, function () {
          vuelo.classList.remove('vuelo--de-ida');
          vuelo.classList.add('vuelo--viajando');
        });
        despues(7000, function () {
          vuelo.classList.remove('vuelo--viajando');
          aterrizar();
          programarVisita();
        });
      });
    };

    if (abeja && ida && typeof ida.beginElement === 'function') {
      abeja.removeAttribute('transform');
      vuelo.classList.add('vuelo--animado', 'vuelo--viajando');
      ida.beginElement();
      despues(3400, function () {
        vuelo.classList.remove('vuelo--viajando');
        vuelo.classList.add('vuelo--posada');
        aterrizar();
        if (visita && typeof visita.beginElement === 'function') programarVisita();
      });
    }
  }
})();
