// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active nav link
        navLinks.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding view
        const viewId = this.getAttribute('data-view');
        views.forEach(view => {
            view.classList.remove('active');
            if (view.id === viewId) {
                view.classList.add('active');
            }
        });
    });
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking on close button or outside the modal
closeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal.id);
    });
});

window.addEventListener('click', function(e) {
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Escape key to close modals
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains('active')) {
                closeModal(modal.id);
            }
        });
    }
});

// Project Modal
const addProjectBtn = document.getElementById('addProjectBtn');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');
const projectForm = document.getElementById('projectForm');

if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => openModal('projectModal'));
}

if (cancelProjectBtn) {
    cancelProjectBtn.addEventListener('click', () => closeModal('projectModal'));
}

if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would save the project data here
        alert('Project added successfully!');
        projectForm.reset();
        closeModal('projectModal');
    });
}

// Payment Modal
const recordPaymentBtn = document.getElementById('recordPaymentBtn');
const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
const paymentForm = document.getElementById('paymentForm');

if (recordPaymentBtn) {
    recordPaymentBtn.addEventListener('click', () => openModal('paymentModal'));
}

if (cancelPaymentBtn) {
    cancelPaymentBtn.addEventListener('click', () => closeModal('paymentModal'));
}

if (paymentForm) {
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would save the payment data here
        alert('Payment recorded successfully!');
        paymentForm.reset();
        closeModal('paymentModal');
    });
}

// Invoice Modal
const createInvoiceBtn = document.getElementById('createInvoiceBtn');
const cancelInvoiceBtn = document.getElementById('cancelInvoiceBtn');
const addItemRowBtn = document.getElementById('addItemRow');
const invoiceForm = document.getElementById('invoiceForm');
const invoiceItems = document.querySelector('.invoice-items');

if (createInvoiceBtn) {
    createInvoiceBtn.addEventListener('click', () => openModal('invoiceModal'));
}

if (cancelInvoiceBtn) {
    cancelInvoiceBtn.addEventListener('click', () => closeModal('invoiceModal'));
}

// Add item row to invoice
if (addItemRowBtn) {
    addItemRowBtn.addEventListener('click', function() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <input type="text" placeholder="Description" class="item-desc">
            <input type="number" placeholder="Qty" class="item-qty" min="1" value="1">
            <input type="number" placeholder="Price" class="item-price" min="0" step="0.01">
            <button type="button" class="btn-icon remove-item"><i class="fas fa-times"></i></button>
        `;
        invoiceItems.appendChild(itemRow);
        
        // Add event listener to the new remove button
        const removeBtn = itemRow.querySelector('.remove-item');
        removeBtn.addEventListener('click', function() {
            itemRow.remove();
            calculateInvoiceTotal();
        });
        
        // Add event listeners to the new inputs for calculation
        const qtyInput = itemRow.querySelector('.item-qty');
        const priceInput = itemRow.querySelector('.item-price');
        
        qtyInput.addEventListener('input', calculateInvoiceTotal);
        priceInput.addEventListener('input', calculateInvoiceTotal);
    });
}

// Remove item row from invoice
document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-item')) {
        const itemRow = e.target.closest('.item-row');
        if (itemRow && invoiceItems.children.length > 1) {
            itemRow.remove();
            calculateInvoiceTotal();
        }
    }
});

// Calculate invoice total
function calculateInvoiceTotal() {
    const itemRows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    
    itemRows.forEach(row => {
        const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        subtotal += qty * price;
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Add event listeners to existing invoice item inputs
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('item-qty') || e.target.classList.contains('item-price')) {
        calculateInvoiceTotal();
    }
});

// Initialize invoice total calculation
calculateInvoiceTotal();

if (invoiceForm) {
    invoiceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, you would save the invoice data here
        alert('Invoice created successfully!');
        openModal('invoicePreviewModal');
    });
}

// Invoice Preview Modal
const printInvoiceBtn = document.getElementById('printInvoiceBtn');
const sendInvoiceBtn = document.getElementById('sendInvoiceBtn');

if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener('click', function() {
        window.print();
    });
}

if (sendInvoiceBtn) {
    sendInvoiceBtn.addEventListener('click', function() {
        alert('Invoice sent to client successfully!');
        closeModal('invoicePreviewModal');
    });
}

// Initialize date fields with today's date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    
    // Set today's date for payment date
    const paymentDate = document.getElementById('paymentDate');
    if (paymentDate) {
        paymentDate.value = today;
    }
    
    // Set today's date for invoice date
    const invoiceDate = document.getElementById('invoiceDate');
    if (invoiceDate) {
        invoiceDate.value = today;
    }
    
    // Set due date to 15 days from today
    const dueDate = document.getElementById('invoiceDueDate');
    if (dueDate) {
        const due = new Date();
        due.setDate(due.getDate() + 15);
        dueDate.value = due.toISOString().split('T')[0];
    }
});

// Filter functionality for projects
const statusFilter = document.getElementById('statusFilter');
const clientFilter = document.getElementById('clientFilter');

if (statusFilter) {
    statusFilter.addEventListener('change', filterProjects);
}

if (clientFilter) {
    clientFilter.addEventListener('change', filterProjects);
}

function filterProjects() {
    // In a real app, you would filter the projects based on the selected filters
    console.log('Filtering projects...');
}

// Filter functionality for invoices
const invoiceStatusFilter = document.getElementById('invoiceStatusFilter');

if (invoiceStatusFilter) {
    invoiceStatusFilter.addEventListener('change', filterInvoices);
}

function filterInvoices() {
    // In a real app, you would filter the invoices based on the selected filter
    console.log('Filtering invoices...');
}

// Initialize the dashboard with current date
document.addEventListener('DOMContentLoaded', function() {
    // This would be where you initialize any dashboard data
    console.log('Dashboard initialized');
});