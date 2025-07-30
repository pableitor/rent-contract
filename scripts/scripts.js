// --- Signature Pad Logic ---
const signaturePads = {};
['firmaArrendadora', 'firmaArrendataria'].forEach(id => {
  const canvas = document.getElementById(id);
  canvas.signaturePad = new SignaturePad(canvas, { backgroundColor: 'rgba(252, 252, 252, 1)' });
  signaturePads[id] = canvas.signaturePad;
});
document.querySelectorAll('.clear-signature-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const canvasId = event.target.dataset.canvasId;
    if (signaturePads[canvasId]) { signaturePads[canvasId].clear(); }
  });
});

// --- Logic para mostrar/ocultar el campo "Otros" ---
const purposeRadios = document.querySelectorAll('input[name="purpose"]');
const otrosDetailsInput = document.getElementById('purpose-otros-details');
purposeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (document.getElementById('purpose-otros').checked) {
      otrosDetailsInput.style.display = 'inline-block';
    } else {
      otrosDetailsInput.style.display = 'none';
      otrosDetailsInput.value = '';
    }
  });
});

function resizeCanvas(canvas) {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
}
function clearAndResize() {
  document.querySelectorAll('canvas').forEach(canvas => {
    if (canvas.signaturePad) {
      const data = canvas.signaturePad.toData();
      resizeCanvas(canvas);
      canvas.signaturePad.fromData(data);
    }
  });
}
window.addEventListener("resize", clearAndResize);
document.querySelectorAll('canvas').forEach(resizeCanvas);

// --- Lógica para impresión compatible con móviles ---
window.addEventListener('beforeprint', () => {
  const checkedRadio = document.querySelector('input[name="purpose"]:checked');
  if (checkedRadio) {
    const label = document.querySelector(`label[for="${checkedRadio.id}"]`);
    if (label) {
      label.classList.add('selected-for-print');
    }
  }
});
window.addEventListener('afterprint', () => {
  const printedLabel = document.querySelector('.selected-for-print');
  if (printedLabel) {
    printedLabel.classList.remove('selected-for-print');
  }
});

// --- AWS PDF Upload ---
AWS.config.region = 'eu-south-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'eu-south-2:e70e5ae2-2635-4445-9bb6-abd20a1264b4'
});
function copiarLink() {
  const urlInput = document.getElementById('urlPdf');
  urlInput.select();
  document.execCommand('copy');
  alert('📋 Enlace copiado al portapapeles');
}
function subirPDFaS3() {
  const element = document.getElementById('contrato');

  const options = {
    margin: 0.5,
    filename: 'contrato.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(element).set(options).outputPdf('blob').then(function (blob) {
    const guest = document.getElementById('guestname').value.trim().replace(/ /g, "_");
    const fileName = 'contrato-' + guest + Date.now() + '.pdf';

    const s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: 'contratos-pdf-pablo' }
    });

    const params = {
      Key: fileName,
      ContentType: 'application/pdf',
      Body: blob,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.error('❌ Error al subir:', err);
        alert("❌ Error al subir el PDF.");
      } else {
        console.log('✅ PDF subido a S3:', data.Location);
        const urlInput = document.getElementById('urlPdf');
        urlInput.value = data.Location;
        const resultado = document.getElementById('resultado');
        resultado.style.display = 'block';
      }
    });
  });
}
function compartirWhatsApp() {
  const url = document.getElementById('urlPdf').value;
  const mensaje = encodeURIComponent("📄 Aquí tienes el contrato:\n" + url);
  const enlace = `https://wa.me/?text=${mensaje}`;
  window.open(enlace, '_blank');
}

function abrirReserva() {
  const reserva = document.getElementById('reservaId').value.trim();
  if (!reserva) {
    alert("Introduce un número de reserva válido.");
    return;
  }
  const url = `https://www.airbnb.es/hosting/stay/${reserva}`;
  window.open(url, '_blank');
}

async function importarDesdeClipboard() {
  try {
    const texto = await navigator.clipboard.readText();
    const nombreMatch = texto.match(/👤 Inquilino:\s*(.+)/);
    const alojamientoMatch = texto.match(/🏠 Alojamiento:\s*(.+)/);
    const fechasMatch = texto.match(/📅 Fechas:\s*(.+)/);

    if (!nombreMatch || !alojamientoMatch || !fechasMatch) {
      alert("❌ No se encontraron datos válidos en el portapapeles.");
      return;
    }

    const nombre = nombreMatch[1];
    const alojamiento = alojamientoMatch[1];
    const fechas = fechasMatch[1];

    document.getElementById("guestname").value = nombre;
    document.getElementById("alojamiento").value = alojamiento;

    const fechasRegex = /(\d{1,2})\s(\w+)\s[–-]\s(\d{1,2})\s(\w+)/;
    const match = fechas.match(fechasRegex);
    if (match) {
      const diaInicio = match[1];
      const mesInicio = match[2];
      const diaFin = match[3];
      const mesFin = match[4];

      const meses = {
        "ene": "01", "feb": "02", "mar": "03", "abr": "04",
        "may": "05", "jun": "06", "jul": "07", "ago": "08",
        "sept": "09", "oct": "10", "nov": "11", "dic": "12"
      };

      const añoActual = new Date().getFullYear();

      const fechaInicio = `${añoActual}-${meses[mesInicio.toLowerCase().slice(0, 3)]}-${diaInicio.padStart(2, '0')}`;
      const fechaFin = `${añoActual}-${meses[mesFin.toLowerCase().slice(0, 3)]}-${diaFin.padStart(2, '0')}`;

      document.getElementById("fechaInicio").value = fechaInicio;
      document.getElementById("fechaFin").value = fechaFin;
    }

    alert("✅ Datos pegados desde el portapapeles");

  } catch (err) {
    console.error(err);
    alert("❌ Error al leer desde el portapapeles");
  }
}

// === Editor Toggle Logic ===
const toggleButton = document.getElementById("editorToggle");
const htmlEditor = document.getElementById("htmlEditor");
const contratoDiv = document.getElementById("contrato");

let modoEdicion = false;

// Al iniciar, cargamos el HTML del contrato
fetch("contract-content.html")
  .then(response => response.text())
  .then(html => {
    contratoDiv.innerHTML = html;
  });

toggleButton.addEventListener("click", () => {
  if (!modoEdicion) {
    // Activar modo edición
    htmlEditor.value = contratoDiv.innerHTML.trim();
    contratoDiv.style.display = "none";
    htmlEditor.style.display = "block";
    toggleButton.textContent = "✅ Guardar cambios";
    modoEdicion = true;
  } else {
    // Desactivar modo edición
    contratoDiv.innerHTML = htmlEditor.value;
    contratoDiv.style.display = "block";
    htmlEditor.style.display = "none";
    toggleButton.textContent = "✏️ Editar HTML";
    modoEdicion = false;
  }
});
