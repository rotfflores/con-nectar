# Sitio web Con-néctar

Sitio público de Con-néctar, Centro Terapéutico Infantil y Estimulación Temprana en Durango, México.
Cada sección es una página HTML independiente. Está hecho con HTML, CSS y JavaScript, sin dependencias
ni herramientas de compilación.

> **Importante:** los datos y las fotos del centro salen de sus perfiles públicos de Instagram y Facebook.
> En `FUENTES.md` está de dónde viene cada dato y cada foto. Lo que no está publicado (equipo, horarios
> generales, requisitos) no se inventó: la página invita a preguntar al centro.
> El correo, Instagram y Facebook se muestran como íconos enlazados, sin direcciones ni usuarios visibles.

## Cómo abrir el proyecto

1. Abre la carpeta del proyecto.
2. Haz doble clic en `index.html`. Se abre en tu navegador (Chrome, Edge, Safari o Firefox).
3. Navega con el menú: cada opción abre su propia página.
4. Para ver la versión de celular en computadora: clic derecho › **Inspeccionar** › ícono de celular.

Opcional, para probarla como si estuviera en línea: abre una terminal en la carpeta y ejecuta
`python -m http.server 8000`, luego entra a `http://localhost:8000`.

Para publicarla, sube la carpeta completa a cualquier hosting de sitios estáticos
(el hosting del dominio del cliente, Netlify, Cloudflare Pages o GitHub Pages).

## Páginas

| Archivo | Sección |
|---|---|
| `index.html` | Inicio: presentación, guía "¿Qué estás buscando?" y accesos al resto del sitio |
| `nosotros.html` | Conoce Con-néctar |
| `servicios.html` | Servicios terapéuticos |
| `cuidado-y-aprendizaje.html` | Prekínder y ludoteca |
| `talleres-y-actividades.html` | Viernes de CTE, talleres y cursos |
| `equipo.html` | Nuestro equipo |
| `instalaciones.html` | Galería de fotos con visor |
| `preguntas-frecuentes.html` | Preguntas frecuentes |
| `contacto.html` | Contacto y ubicación |
| `agendar-cita.html` | Agendar cita: servicio, calendario, horarios y datos de contacto; registra la cita en el sistema (hoy en modo de prueba) |
| `aviso-de-privacidad.html` | Espacio reservado para el aviso de privacidad (pendiente) |

Otros archivos:

```
├── styles.css          Diseño, colores y animaciones (compartido por todas las páginas)
├── script.js           Datos de contacto (DATOS_CENTRO) y funciones: menú, preguntas, galería, WhatsApp, agenda, logotipo, abeja
├── LEEME.md            Este documento
├── FUENTES.md          De dónde sale cada dato y cada foto del centro
└── img/
    ├── favicon.png     Ícono de la pestaña (la abeja del logotipo)
    ├── logo/           Logotipo con fondo transparente y el archivo original
    ├── centro/         Fotos y carteles publicados por el centro en sus redes
    └── pendiente/      Imágenes provisionales de versiones anteriores (ya no se usan, puedes borrarla)
```

## Dónde se edita cada cosa

| Qué cambiar | Dónde |
|---|---|
| WhatsApp, teléfono, horario, dirección, Google Maps y redes | `script.js`, bloque `DATOS_CENTRO` al inicio. Se actualiza en todas las páginas |
| Agenda de citas: horarios, meses y dirección de la base de datos | `script.js`, bloque `AGENDA` (ver "Agendar cita") |
| Colores | `styles.css`, bloque `:root` al inicio |
| Color de la cabecera de cada página | En cada `.html`, la clase `cabecera--miel`, `cabecera--rosa` o `cabecera--hoja` |
| Frases de la cinta en movimiento del inicio | `index.html`, bloque `cinta` (cada frase está escrita dos veces para que el movimiento no se corte) |
| Menú, encabezado y pie de página | Se repiten en cada archivo `.html`. Si cambias el menú, cámbialo en las 11 páginas |
| Textos, servicios, programas, actividades, equipo y preguntas | En la página de cada sección; hay comentarios `EDITAR` y plantillas para copiar |
| Fotografías | Cambia `src` y `alt` de cada `<img>`; en la galería cambia también `data-grande` |
| Título y descripción para Google | Dentro de `<head>` de cada página (cada una tiene los suyos) |

### Logotipo

- `img/logo/con-nectar-marca.png`: abeja y nombre juntos (referencia; el encabezado ya usa las tres capas de abajo).
- Logotipo animado del encabezado, en tres capas del mismo tamaño que la marca:
  `con-nectar-nombre.png` (solo las letras), `con-nectar-estela.png` (solo la estela punteada) y
  `con-nectar-abeja-logo.png` (solo la abejita). Quietas se ven igual que el logotipo original.
- `img/logo/con-nectar-logo.png`: logotipo completo con la leyenda, para el pie de página.
- `img/logo/logo-original.jpg`: el archivo tal como se recibió.

Se recortaron del JPG recibido (500 × 500 px) y se les quitó el fondo blanco. Se ven bien en pantalla,
pero si el cliente tiene el logotipo en **SVG o PNG de alta resolución** conviene reemplazarlos con el
mismo nombre de archivo. Si cambia el dibujo del logotipo, también hay que volver a separar las tres capas
y ajustar el recorrido de la estela (atributo `d` del `<path>` dentro de `logo-mascara` y `path` del
`<animateMotion>` en el encabezado de cada página).

**Animación del logotipo:** al abrir cada página, la abejita sale de la "n" y recorre su estela punteada
mientras la estela se va dibujando detrás de ella. Se repite cada 15 segundos y al dar clic en el logotipo:
en el inicio el clic repite el vuelo (y sube al principio de la página); en las demás páginas lleva al
inicio, donde vuelve a volar. Para cambiar el tiempo, edita `CADA = 15000` (milisegundos) en `script.js`,
sección "Logotipo". Con movimiento reducido el logotipo queda quieto.

### Diseño y animaciones

- Paleta tomada del logotipo: amarillo miel `#F9D458`, negro `#1D1B16` y blanco. Para dar vida y distinguir
  las áreas se agregaron dos tonos de jardín: rosa (como la mejilla de la abeja) y verde hoja.
- Tipografías: Fredoka en títulos (redondeada, como las letras del logotipo) y Nunito en textos. Se cargan
  desde Google Fonts; sin internet se usa la tipografía del sistema y todo sigue funcionando.
- **Inicio:** fondo miel con patrón de panal, foto principal inclinada sobre un bloque rosa, flores que se
  mecen y una abeja que sale de la flor, recorre su estela punteada (como en el logotipo) y se queda flotando.
  Debajo hay un borde ondulado y una cinta negra con las frases del logotipo en movimiento.
- **Páginas interiores:** cada cabecera tiene su color (miel, rosa o verde hoja), patrón de panal, una flor y
  una abeja que dibuja su estela al abrir la página.
- Tarjetas tipo calcomanía: contorno negro y sombra de color que se alterna entre miel, rosa y verde.
  Algunas palabras de los títulos llevan un subrayado ondulado.
- Las tarjetas que están más abajo aparecen suavemente al desplazarse. Lo que se ve al abrir la página
  nunca se oculta.
- La banda "¿Tienes dudas?" es negra con panal y el pie de página es color miel claro, ambos con borde ondulado.

#### Al tocar, abrir y cerrar

- **Botones y tarjetas:** al presionarlos se hunden en su sombra, como una calcomanía, y rebotan al soltarlos.
  Desde el punto que se toca sale una onda suave. En el celular los efectos de cursor no se quedan
  "pegados" después de tocar.
- **Cambio de página:** el encabezado se queda fijo, la página anterior se desvanece y la nueva sube suavemente.
  En computadora, la marca amarilla del menú se desliza hasta la nueva sección. Funciona en Chrome, Edge y
  Safari recientes; en Firefox la página cambia sin animación.
- **Menú del celular:** se despliega hacia abajo y las opciones entran en cascada; al cerrarlo se recoge.
- **Preguntas frecuentes:** la respuesta se despliega y se recoge suavemente, y el botón + gira hasta formar una ×.
- **Galería:** la foto crece desde su miniatura y regresa a ella al cerrar. En el celular se desliza a los lados
  para cambiar de foto y hacia abajo para cerrar (si no se desliza lo suficiente, regresa a su lugar). En
  computadora funciona con las flechas, con el teclado o arrastrando con el mouse.
- La abejita del botón **Solicitar información** zumba al tocarlo.

#### Abeja y flores

- **La abeja** tiene más detalle (brillo, alas transparentes, ojo con destello y mejillas) y está viva: las
  alas zumban, las antenas se mecen, parpadea, flota y de vez en cuando da una pirueta en el aire.
- Al **tocarla** (o pasarle el mouse encima) da una vuelta de alegría y suelta corazones.
- En el inicio, después de llegar por su estela, cada 9 a 15 segundos **regresa a la flor rosa**: se voltea,
  mete la cabeza para tomar néctar, la flor rebota y suelta corazones, y la abeja vuelve a su lugar.
- **Las flores** ahora sonríen, brotan al aparecer en pantalla y se mecen en su lugar. Al tocarlas giran y
  sueltan pétalos de su color. Las de la cinta negra giran despacio.
- El dibujo está en `styles.css` (sección "Abejas y flores juguetonas") y `script.js` (misma sección). Las abejas
  grandes van dibujadas dentro de cada página (`<svg class="abeja-viva">`) para poder mover sus partes; la
  abejita del botón y las flores usan los símbolos `#i-abeja` e `#i-flor` del inicio de cada página.

- Si la persona tiene activada la opción de **reducir movimiento** en su dispositivo, no hay animaciones:
  la abeja y las flores aparecen quietas (y no reaccionan al tocarlas), la cinta no se mueve, todo el
  contenido se muestra desde el inicio y los menús, preguntas y fotos se abren y cierran al instante.
- No se usan bibliotecas externas: todo está hecho con HTML, CSS y JavaScript propios, por eso el sitio
  abre con doble clic y carga rápido.

### WhatsApp

`DATOS_CENTRO.whatsapp` tiene el celular público del centro (618 234 5266). Si se deja vacío, todos los
botones **Solicitar información** llevan a `contacto.html` y no se genera ningún enlace falso.

Con el número a 10 dígitos:

- Todos los botones de información abren WhatsApp con un mensaje inicial. En las tarjetas de servicio
  el mensaje incluye el nombre de la terapia; en prekínder, ludoteca y CTE ya trae un texto propio.
- Aparece el número y el botón **Escribir por WhatsApp** en Contacto.
- Aparece un botón flotante de WhatsApp en la esquina (se desactiva con `botonFlotanteWhatsApp: false`).

El teléfono y el enlace de Google Maps funcionan igual: solo se muestran cuando tienen dato.

### Agendar cita

`agendar-cita.html` tiene cuatro pasos: servicio, día, hora y datos de contacto. Al final, el botón
**Registrar cita** guarda la cita en el sistema y muestra un recuadro con el resumen y un folio. Ya no usa
WhatsApp. Todo se configura en `script.js`, sección "Agendar cita", bloque `AGENDA`.

- **Datos que se piden:** nombre de la mamá, el papá o tutor, teléfono de 10 dígitos, edad de la niña o el
  niño (opcional) y la casilla de aceptación del aviso de privacidad. No se piden diagnósticos ni
  información clínica; no agregues campos de ese tipo.
- **Horarios de cada día de la semana y meses que se pueden ver:** `AGENDA.horarios` y `AGENDA.meses`.
  Son de ejemplo hasta que el centro confirme los suyos.
- **Servicios:** son las opciones del paso 1 en `agendar-cita.html` (cada `<label class="opcion">`). El
  atributo `data-clave` es lo que se guarda en el sistema.
- **Llegar con un servicio elegido:** `agendar-cita.html?servicio=terapia-de-lenguaje` (se usa desde las
  tarjetas de Terapias y de Cuidado infantil).
- El botón amarillo del encabezado dice **Agendar cita** y lleva a esta página. "Solicitar información"
  sigue en el inicio, en cada sección y en el botón flotante de WhatsApp.

#### Modo de prueba (como está hoy)

Mientras `AGENDA.urlCitas` esté vacía, la agenda funciona en modo de prueba y la página lo dice con la
etiqueta **Modo de prueba**:

- Los horarios ocupados son un ejemplo que se calcula con `AGENDA_EJEMPLO` (cada fecha sale siempre igual).
- Las citas se guardan solo en el navegador de quien las hace (`localStorage`, llave
  `con-nectar-citas-prueba`) y **no llegan al centro**. Solo se guarda servicio, día, hora y folio; el
  nombre y el teléfono no se guardan.
- El horario registrado aparece ocupado al volver a abrir ese día, también después de recargar.
- El aviso muestra cuántas citas de prueba hay y un botón **Borrar citas de prueba**.

#### Conectar la base de datos

Cuando exista el servicio que guarda las citas, escribe su dirección en `AGENDA.urlCitas`, por ejemplo
`urlCitas: 'https://api.tu-dominio.mx/citas'`. Con eso se oculta el aviso de prueba, se deja de usar
`AGENDA_EJEMPLO` y la página usa esa dirección así:

1. **Consultar horarios ocupados** al abrir la página:
   `GET {urlCitas}?desde=2026-10-23&hasta=2026-12-31`
   Debe responder `{ "ocupados": [ { "fecha": "2026-10-26", "hora": "09:00" } ] }`.
   Si falla, la página no muestra horarios e invita a escribir por la página de Contacto.
2. **Registrar una cita:** `POST {urlCitas}` con este JSON:
   ```json
   { "servicio": "terapia-de-lenguaje", "fecha": "2026-10-28", "hora": "16:00",
     "nombre": "Ana López", "telefono": "6181234567", "edad": "3 años", "aceptaAvisoPrivacidad": true }
   ```
   - Si se guardó: código 200 o 201 y, si se quiere mostrar folio, `{ "folio": "CN-0001" }`.
   - Si ese horario ya lo tomó otra persona: código **409**. La página lo marca ocupado y pide otra hora.
   - Cualquier otro error: la página dice que no se pudo registrar y no muestra la confirmación.

El servicio debe revisar otra vez que el horario esté libre antes de guardar, validar los datos y, si está
en otro dominio, permitir las peticiones del sitio (CORS). Para ver y confirmar las citas, el centro
necesitará un acceso privado al sistema; queda para cuando se abra la base de datos.

### Viernes de CTE, talleres y cursos

- La convocatoria **El bosque mágico** tiene `data-fecha="2026-10-30"`. Al día siguiente (hora del centro
  de México) la tarjeta se marca sola como **Realizado** y el botón cambia a "Preguntar por el próximo".
  Para anunciar el siguiente viernes de CTE, cambia el cartel, los textos y la fecha.
- Si se borran todas las tarjetas de una lista, aparece un aviso que invita a preguntar por las próximas
  actividades.

## Datos confirmados (publicados por el centro)

Detalle y enlaces en `FUENTES.md`.

- Nombre y leyenda: Con-néctar, Centro Terapéutico Infantil y Estimulación Temprana.
- Atención grupal e individual para niñas y niños de 2 a 6 años.
- Servicios: estimulación temprana, terapia de lenguaje, terapia física, prekínder (adaptación al
  preescolar), ludoteca, viernes de CTE y cursos de verano, Pascua e invierno.
- Teléfono: 618 234 5266. Dirección: Calle Río Aguanaval 506, Col. Valle del Sur, Durango, a una cuadra
  del Blvd. Durango. Ubicación: el enlace de Google Maps de su biografía de Instagram.
- Viernes de CTE «El bosque mágico»: viernes 30 de octubre de 2026, 8:00 a. m. a 2:00 p. m. con
  flexibilidad, de 2 a 5 años, $250 con refrigerio.
- Redes: Instagram @con.nectar.dgo y su página de Facebook.

## Datos y materiales pendientes

### Contacto y ubicación
- [ ] Confirmar que el 618 234 5266 tiene WhatsApp (los botones lo usan como WhatsApp)
- [ ] Correo de contacto (aparece en Facebook; se puede agregar a Contacto)
- [ ] Horario de atención general y de terapias, prekínder y ludoteca (también para la agenda de citas)
- [ ] Base de datos para las citas y su dirección en `AGENDA.urlCitas` (hoy la agenda está en modo de prueba)
- [ ] Cómo verá y confirmará el centro las citas registradas
- [ ] Código postal
- [ ] Dominio donde se publicará el sitio (para la URL canónica y la imagen al compartir)

### Identidad
- [ ] Logotipo en SVG o PNG de alta resolución (el actual se recortó de un JPG de 500 px)
- [ ] Imagen para compartir en redes de 1200 × 630 px

### Contenido por completar
- [ ] **Servicios:** descripción sencilla y edades de cada terapia
- [ ] **Valoración:** en qué consiste, cómo se agenda y si se publica duración o costo
- [ ] **Prekínder y ludoteca:** edades, horario y requisitos de inscripción
- [ ] **Equipo:** por persona, nombre, función, formación, credenciales verificables (por ejemplo, cédula
      profesional) y autorización para publicar sus datos y su foto. Hoy la página muestra las áreas de atención
- [ ] **Preguntas frecuentes:** documentos de inscripción y cómo se da seguimiento a las familias
- [ ] Revisar con el centro todos los textos

### Fotografías
- [ ] Confirmar con el centro que la autorización de las familias para publicar fotos en redes cubre
      también el sitio web (en varias fotos se ve la cara de niñas y niños). Si no, usar fotos sin menores
      o en las que no se les reconozca
- [ ] Fotos en mayor resolución: la mayoría son de 512 × 640 px, tomadas de Instagram
- [ ] Fotos de las instalaciones sin niñas ni niños, si el centro las tiene

Recomendación para las fotos: formato WebP o JPG, de 1600 px de ancho como máximo y menos de 300 KB
cada una. Las imágenes que no se ven al abrir cada página ya tienen carga diferida (`loading="lazy"`).

### Legal
- [ ] Aviso de privacidad entregado y revisado por el cliente o su asesor. Va en `aviso-de-privacidad.html`,
      que hoy solo indica que el documento está pendiente y no se indexa en buscadores. Como el sitio invita
      a las familias a compartir datos de contacto, conviene tenerlo listo antes de publicar. Es
      indispensable antes de conectar la agenda a la base de datos, porque ahí se guardarán nombre y
      teléfono de las familias.

## Antes de publicar

1. Revisa `DATOS_CENTRO` en `script.js` (WhatsApp y horario).
2. Revisa los textos que invitan a preguntar y cámbialos por la información que confirme el centro.
3. El teléfono también aparece escrito en la primera pregunta frecuente; si cambia, actualízalo ahí.
4. Pega el aviso de privacidad y quita la etiqueta "Pendiente" del pie de página en todas las páginas.
5. Si la agenda ya está conectada, revisa que `AGENDA.urlCitas` y `AGENDA.horarios` sean los reales.
6. Borra la carpeta `img/pendiente/`, que ya no se usa.
7. Revisa el sitio en un celular real.
