// Portal Fact - Script principal

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('fecha').max = new Date().toISOString().split('T')[0];
    
  
    document.getElementById('ticketForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const folio = document.getElementById('folio').value.trim();
        const total = document.getElementById('total').value.trim();
        const fecha = document.getElementById('fecha').value;
        
        if (!folio || !total || !fecha) {
            showAlert('Por favor complete todos los campos requeridos.', 'danger');
            return;
        }
        
       
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...';
        submitBtn.disabled = true;
        
        
        setTimeout(() => {
         
            document.getElementById('displayFolio').textContent = folio;
            document.getElementById('displayFecha').textContent = new Date(fecha).toLocaleDateString('es-MX');
            document.getElementById('displayTotal').textContent = '$' + parseFloat(total).toFixed(2);
            
            
            document.getElementById('ticketValidation').classList.add('d-none');
            document.getElementById('billingData').classList.remove('d-none');
            document.getElementById('billingData').classList.add('fade-in');
            
           
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
          
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 2000);
    });
    
    
    document.getElementById('backToTicket').addEventListener('click', function() {
        document.getElementById('billingData').classList.add('d-none');
        document.getElementById('ticketValidation').classList.remove('d-none');
        document.getElementById('ticketValidation').classList.add('fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    
    document.getElementById('billingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
       
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
        

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generando...';
        submitBtn.disabled = true;
        
        
        setTimeout(() => {
          
            const folio = document.getElementById('folio').value.trim();
            const total = document.getElementById('total').value.trim();
            const fecha = document.getElementById('fecha').value;
            
            
            const regimenText = document.getElementById('regimenFiscal').options[document.getElementById('regimenFiscal').selectedIndex].text;
            const usoCFDIText = document.getElementById('usoCFDI').options[document.getElementById('usoCFDI').selectedIndex].text;
            
           
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
            
         
            document.getElementById('billingData').classList.add('d-none');
            document.getElementById('invoiceResult').classList.remove('d-none');
            document.getElementById('invoiceResult').classList.add('fade-in');
            
          
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
          
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 3000);
    });
    
 
    document.getElementById('downloadPdf').addEventListener('click', function() {
        showAlert('La factura en PDF se está descargando...', 'success');
      
        setTimeout(() => {
            showAlert('Descarga completada', 'info');
        }, 1500);
    });
    
    document.getElementById('downloadXml').addEventListener('click', function() {
        showAlert('El archivo XML se está descargando...', 'success');
      
        setTimeout(() => {
            showAlert('Descarga completada', 'info');
        }, 1500);
    });
    
    document.getElementById('sendEmail').addEventListener('click', function() {
        const email = document.getElementById('email').value.trim();
        showAlert(`La factura se ha enviado a ${email}`, 'success');
    });
    
    document.getElementById('newInvoice').addEventListener('click', function() {
     
        document.getElementById('ticketForm').reset();
        document.getElementById('billingForm').reset();
        
     
        document.getElementById('invoiceResult').classList.add('d-none');
        document.getElementById('ticketValidation').classList.remove('d-none');
        document.getElementById('ticketValidation').classList.add('fade-in');
        
       
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


// Funciones de validación y utilidades

function validateRFC(rfc) {
    const rfcRegex = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfc);
}


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function validateCP(cp) {
    return /^\d{5}$/.test(cp);
}


function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}


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
    
    document.getElementById('alertContainer').appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            alertDiv.remove();
        }, 300);
    }, 5000);
}