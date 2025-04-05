document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha máxima como hoy
    document.getElementById('fecha').max = new Date().toISOString().split('T')[0];
    
    // Validación del formulario
    document.getElementById('invoiceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const folio = document.getElementById('folio').value.trim();
        const total = document.getElementById('total').value.trim();
        const fecha = document.getElementById('fecha').value;
        const rfc = document.getElementById('rfc').value.trim();
        const email = document.getElementById('email').value.trim();
        const terms = document.getElementById('terms').checked;
        
        // Validaciones básicas
        if (!folio || !total || !fecha || !terms) {
            showAlert('Por favor complete todos los campos requeridos y acepte los términos.', 'danger');
            return;
        }
        
        if (rfc && !validateRFC(rfc)) {
            showAlert('El RFC ingresado no tiene un formato válido.', 'danger');
            return;
        }
        
        if (email && !validateEmail(email)) {
            showAlert('El correo electrónico ingresado no es válido.', 'danger');
            return;
        }
        
        // Simular generación de factura
        generateInvoice(folio, total, fecha, rfc, email);
    });
    
    // Botones de la factura generada
    document.getElementById('downloadPdf').addEventListener('click', function() {
        showAlert('La factura se está descargando...', 'success');
    });
    
    document.getElementById('sendEmail').addEventListener('click', function() {
        const email = document.getElementById('email').value.trim();
        if (email) {
            showAlert(`La factura se reenviará a ${email}`, 'success');
        } else {
            showAlert('No se encontró un correo electrónico registrado.', 'warning');
        }
    });
});

// Función para validar RFC
function validateRFC(rfc) {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfc);
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para mostrar alertas
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    const container = document.querySelector('.container');
    container.prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

// Función para generar la factura (simulación)
function generateInvoice(folio, total, fecha, rfc, email) {
    // Mostrar loading
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    submitBtn.disabled = true;
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
        // Ocultar formulario y mostrar resultado
        document.getElementById('invoiceForm').reset();
        document.querySelector('.invoice-card').classList.add('d-none');
        
        // Rellenar datos de la factura
        document.getElementById('resultFolio').textContent = folio;
        document.getElementById('resultFecha').textContent = new Date(fecha).toLocaleDateString('es-MX');
        document.getElementById('resultRfc').textContent = rfc || 'No especificado';
        document.getElementById('resultTotal').textContent = '$' + parseFloat(total).toFixed(2);
        document.getElementById('resultNumFactura').textContent = 'FACT-' + Math.floor(Math.random() * 10000);
        
        // Mostrar resultado con animación
        const resultDiv = document.getElementById('invoiceResult');
        resultDiv.classList.remove('d-none');
        resultDiv.classList.add('fade-in');
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Mostrar mensaje de éxito
        showAlert('Factura generada correctamente', 'success');
        
        // Scroll al resultado
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
}