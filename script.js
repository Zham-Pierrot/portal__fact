document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha máxima como hoy
    document.getElementById('fecha').max = new Date().toISOString().split('T')[0];
    
    // Paso 1: Validación del Ticket
    document.getElementById('ticketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const folio = document.getElementById('folio').value.trim();
        const total = document.getElementById('total').value.trim();
        const fecha = document.getElementById('fecha').value;
        
        if (!folio || !total || !fecha) {
            showAlert('Por favor complete todos los campos requeridos.', 'danger');
            return;
        }
        
        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...';
        submitBtn.disabled = true;
        
        // Simular validación del ticket (2 segundos)
        setTimeout(() => {
            // Mostrar datos del ticket en el paso 2
            document.getElementById('displayFolio').textContent = folio;
            document.getElementById('displayFecha').textContent = new Date(fecha).toLocaleDateString('es-MX');
            document.getElementById('displayTotal').textContent = '$' + parseFloat(total).toFixed(2);
            
            // Ocultar paso 1 y mostrar paso 2
            document.getElementById('ticketValidation').classList.add('d-none');
            document.getElementById('billingData').classList.remove('d-none');
            document.getElementById('billingData').classList.add('fade-in');
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    });
    
    // Botón para regresar al paso 1
    document.getElementById('backToTicket').addEventListener('click', function() {
        document.getElementById('billingData').classList.add('d-none');
        document.getElementById('ticketValidation').classList.remove('d-none');
        document.getElementById('ticketValidation').classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Paso 2: Datos de Facturación
    document.getElementById('billingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const rfc = document.getElementById('rfc').value.trim();
        const razonSocial = document.getElementById('razonSocial').value.trim();
        const regimenFiscal = document.getElementById('regimenFiscal').value;
        const codigoPostal = document.getElementById('codigoPostal').value.trim();
        const email = document.getElementById('email').value.trim();
        const usoCFDI = document.getElementById('usoCFDI').value;
        const terms = document.getElementById('terms').checked;
        
        if (!rfc || !razonSocial || !regimenFiscal || !codigoPostal || !email || !usoCFDI || !terms) {
            showAlert('Por favor complete todos los campos requeridos y acepte los términos.', 'danger');
            return;
        }
        
        if (!validateRFC(rfc)) {
            showAlert('El RFC ingresado no tiene un formato válido.', 'danger');
            return;
        }
        
        if (!validateEmail(email)) {
            showAlert('El correo electrónico ingresado no es válido.', 'danger');
            return;
        }
        
        if (!validateCP(codigoPostal)) {
            showAlert('El código postal debe tener 5 dígitos.', 'danger');
            return;
        }
        
        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generando...';
        submitBtn.disabled = true;
        
        // Simular generación de factura (3 segundos)
        setTimeout(() => {
            // Obtener datos del ticket
            const folio = document.getElementById('folio').value.trim();
            const total = document.getElementById('total').value.trim();
            const fecha = document.getElementById('fecha').value;
            
            // Obtener texto de selects
            const regimenText = document.getElementById('regimenFiscal').options[document.getElementById('regimenFiscal').selectedIndex].text;
            const usoCFDIText = document.getElementById('usoCFDI').options[document.getElementById('usoCFDI').selectedIndex].text;
            
            // Rellenar datos en el resultado
            document.getElementById('resultFolio').textContent = folio;
            document.getElementById('resultFecha').textContent = new Date().toLocaleDateString('es-MX', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            document.getElementById('resultRazonSocial').textContent = razonSocial;
            document.getElementById('resultRfc').textContent = rfc;
            document.getElementById('resultTotal').textContent = '$' + parseFloat(total).toFixed(2);
            document.getElementById('resultNumFactura').textContent = 'FACT-' + Math.floor(1000 + Math.random() * 9000);
            document.getElementById('resultUuid').textContent = generateUUID();
            document.getElementById('resultRegimen').textContent = `${regimenFiscal} - ${regimenText}`;
            document.getElementById('resultUsoCFDI').textContent = `${usoCFDI} - ${usoCFDIText}`;
            document.getElementById('resultEmail').textContent = email;
            
            // Ocultar paso 2 y mostrar paso 3
            document.getElementById('billingData').classList.add('d-none');
            document.getElementById('invoiceResult').classList.remove('d-none');
            document.getElementById('invoiceResult').classList.add('fade-in');
            
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Hacer scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
    });
    
    // Botones del paso 3
    document.getElementById('downloadPdf').addEventListener('click', function() {
        showAlert('La factura en PDF se está descargando...', 'success');
        // Simular descarga
        setTimeout(() => {
            showAlert('Descarga completada', 'info');
        }, 1500);
    });
    
    document.getElementById('downloadXml').addEventListener('click', function() {
        showAlert('El archivo XML se está descargando...', 'success');
        // Simular descarga
        setTimeout(() => {
            showAlert('Descarga completada', 'info');
        }, 1500);
    });
    
    document.getElementById('sendEmail').addEventListener('click', function() {
        const email = document.getElementById('email').value.trim();
        showAlert(`La factura se ha enviado a ${email}`, 'success');
    });
    
    document.getElementById('newInvoice').addEventListener('click', function() {
        // Resetear formularios
        document.getElementById('ticketForm').reset();
        document.getElementById('billingForm').reset();
        
        // Mostrar paso 1 y ocultar los demás
        document.getElementById('invoiceResult').classList.add('d-none');
        document.getElementById('ticketValidation').classList.remove('d-none');
        document.getElementById('ticketValidation').classList.add('fade-in');
        
        // Hacer scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Función para validar código postal
function validateCP(cp) {
    return /^\d{5}$/.test(cp);
}

// Función para generar UUID (simulación de folio fiscal)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
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