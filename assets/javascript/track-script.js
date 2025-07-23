// ===== Track Shipment JavaScript ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeTrackingPage();
});

// ===== Main Initialization ===== //
function initializeTrackingPage() {
    setupTrackingForm();
    setupSampleButtons();
    setupResultActions();
    checkURLParameters();
    
    console.log('Track shipment page initialized successfully');
}

// ===== Form Setup ===== //
function setupTrackingForm() {
    const form = document.getElementById('track-form');
    const trackingInput = document.getElementById('tracking-number');
    const courierSelect = document.getElementById('courier-select');
    
    if (!form || !trackingInput) return;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleTrackingSubmission();
    });
    
    // Input formatting and validation
    trackingInput.addEventListener('input', function(e) {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        e.target.value = value;
        
        // Auto-detect courier based on tracking number pattern
        autoDetectCourier(value);
    });
    
    // Focus animation
    trackingInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    trackingInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

// ===== Auto-detect Courier ===== //
function autoDetectCourier(trackingNumber) {
    const courierSelect = document.getElementById('courier-select');
    if (!courierSelect || !trackingNumber) return;
    
    // Courier detection patterns
    const patterns = {
        'dhl': /^(\d{10,11}|[A-Z]{2}\d{9}[A-Z]{2})$/,
        'fedex': /^(\d{12,14}|FDX\d{9})$/,
        'ups': /^(1Z[A-Z0-9]{16}|[A-Z]\d{10})$/,
        'tnt': /^([A-Z]{2}\d{9}|GD\d{9})$/,
        'aramex': /^(\d{11}|[A-Z]{3}\d{8})$/,
        'ems': /^(E[A-Z]\d{9}[A-Z]{2}|[A-Z]{2}\d{9}[A-Z]{2})$/
    };
    
    for (const [courier, pattern] of Object.entries(patterns)) {
        if (pattern.test(trackingNumber)) {
            courierSelect.value = courier;
            
            // Visual feedback
            courierSelect.style.background = 'var(--success-50)';
            courierSelect.style.borderColor = 'var(--success-300)';
            
            setTimeout(() => {
                courierSelect.style.background = '';
                courierSelect.style.borderColor = '';
            }, 1000);
            
            break;
        }
    }
}

// ===== Sample Buttons Setup ===== //
function setupSampleButtons() {
    const sampleButtons = document.querySelectorAll('.sample-btn');
    
    sampleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const trackingNumber = this.dataset.tracking;
            const trackingInput = document.getElementById('tracking-number');
            
            if (trackingInput) {
                trackingInput.value = trackingNumber;
                autoDetectCourier(trackingNumber);
                
                // Animate button click
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Focus input and scroll to form
                trackingInput.focus();
                document.querySelector('.track-form-card').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
}

// ===== Form Submission Handler ===== //
function handleTrackingSubmission() {
    const trackingInput = document.getElementById('tracking-number');
    const courierSelect = document.getElementById('courier-select');
    const form = document.getElementById('track-form');
    
    if (!trackingInput || !form) return;
    
    const trackingNumber = trackingInput.value.trim();
    const selectedCourier = courierSelect.value;
    
    if (!trackingNumber) {
        showFormError('Please enter a tracking number');
        return;
    }
    
    // Show loading state
    showLoadingState(true);
    
    // Hide previous results/errors
    hideResults();
    hideError();
    
    // Simulate API call
    setTimeout(() => {
        performTracking(trackingNumber, selectedCourier);
    }, 1500);
}

// ===== Tracking Logic ===== //
function performTracking(trackingNumber, courier) {
    // Mock tracking data - in real app this would be an API call
    const mockTrackingData = generateMockTrackingData(trackingNumber, courier);
    
    showLoadingState(false);
    
    if (mockTrackingData.found) {
        showTrackingResults(mockTrackingData);
    } else {
        showTrackingError(trackingNumber);
    }
}

function generateMockTrackingData(trackingNumber, courier) {
    // Sample tracking numbers that should return results
    const validNumbers = ['TRK123456789', 'DHL987654321', 'FDX456789123', 'UPS555666777'];
    
    if (!validNumbers.includes(trackingNumber)) {
        return { found: false };
    }
    
    const statuses = ['in-transit', 'delivered', 'out-for-delivery', 'delayed'];
    const locations = [
        'Lagos Distribution Center, Nigeria',
        'Nairobi Sorting Facility, Kenya',
        'Cape Town Hub, South Africa',
        'Accra Processing Center, Ghana',
        'Cairo International Hub, Egypt'
    ];
    
    const couriers = {
        'dhl': 'DHL Express',
        'fedex': 'FedEx',
        'ups': 'UPS',
        'tnt': 'TNT',
        'aramex': 'Aramex',
        'ems': 'EMS Post',
        'gig': 'GIG Logistics',
        'jumia': 'Jumia Express'
    };
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const courierName = courier ? couriers[courier] : 'Auto-detected Courier';
    
    return {
        found: true,
        trackingNumber,
        courier: courierName,
        status,
        location,
        lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString(),
        estimatedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        description: getStatusDescription(status)
    };
}

function getStatusDescription(status) {
    const descriptions = {
        'in-transit': 'Your package is on its way',
        'delivered': 'Package delivered successfully',
        'out-for-delivery': 'Out for delivery today',
        'delayed': 'Delivery delayed due to operational issues'
    };
    return descriptions[status] || 'Status update available';
}

// ===== Results Display ===== //
function showTrackingResults(data) {
    const resultsContainer = document.getElementById('tracking-results');
    
    if (!resultsContainer) return;
    
    // Update result content
    updateResultContent(data);
    
    // Show results with animation
    resultsContainer.style.display = 'block';
    setTimeout(() => {
        resultsContainer.classList.add('show');
    }, 100);
    
    // Scroll to results
    setTimeout(() => {
        resultsContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

function updateResultContent(data) {
    // Update tracking number
    const trackingNumberEl = document.getElementById('result-tracking-number');
    if (trackingNumberEl) {
        trackingNumberEl.textContent = data.trackingNumber;
    }
    
    // Update courier
    const courierEl = document.getElementById('result-courier');
    if (courierEl) {
        const span = courierEl.querySelector('span');
        if (span) span.textContent = data.courier;
    }
    
    // Update status
    const statusEl = document.getElementById('result-status');
    if (statusEl) {
        const badge = statusEl.querySelector('.status-badge');
        if (badge) {
            badge.textContent = formatStatusText(data.status);
            badge.className = `status-badge ${data.status}`;
            
            // Apply status-specific styling
            applyStatusStyling(badge, data.status);
        }
    }
    
    // Update location
    const locationEl = document.getElementById('result-location');
    if (locationEl) {
        locationEl.textContent = data.location;
    }
    
    // Update last updated
    const updatedEl = document.getElementById('result-updated');
    if (updatedEl) {
        updatedEl.textContent = data.lastUpdated;
    }
    
    // Update delivery estimate
    const deliveryEl = document.getElementById('result-delivery');
    if (deliveryEl) {
        deliveryEl.textContent = data.estimatedDelivery;
    }
}

function applyStatusStyling(element, status) {
    const statusStyles = {
        'in-transit': {
            background: 'var(--info-100)',
            color: 'var(--info-700)'
        },
        'delivered': {
            background: 'var(--success-100)',
            color: 'var(--success-700)'
        },
        'out-for-delivery': {
            background: 'var(--warning-100)',
            color: 'var(--warning-700)'
        },
        'delayed': {
            background: 'var(--danger-100)',
            color: 'var(--danger-700)'
        }
    };
    
    const styles = statusStyles[status];
    if (styles) {
        element.style.background = styles.background;
        element.style.color = styles.color;
    }
}

function formatStatusText(status) {
    const statusMap = {
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'out-for-delivery': 'Out for Delivery',
        'delayed': 'Delayed'
    };
    return statusMap[status] || status;
}

// ===== Error Display ===== //
function showTrackingError(trackingNumber) {
    const errorContainer = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    
    if (!errorContainer) return;
    
    // Update error message
    if (errorMessage) {
        errorMessage.textContent = `We couldn't find any shipment with tracking number "${trackingNumber}". Please check the number and try again.`;
    }
    
    // Show error with animation
    errorContainer.style.display = 'block';
    setTimeout(() => {
        errorContainer.classList.add('show');
    }, 100);
    
    // Scroll to error
    setTimeout(() => {
        errorContainer.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// ===== Loading States ===== //
function showLoadingState(show) {
    const form = document.querySelector('.track-form-card');
    const submitBtn = document.querySelector('#track-form button[type="submit"]');
    
    if (!form || !submitBtn) return;
    
    if (show) {
        form.classList.add('form-loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Tracking...';
    } else {
        form.classList.remove('form-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-search"></i> Track Shipment';
    }
}

// ===== Utility Functions ===== //
function hideResults() {
    const resultsContainer = document.getElementById('tracking-results');
    if (resultsContainer) {
        resultsContainer.classList.remove('show');
        setTimeout(() => {
            resultsContainer.style.display = 'none';
        }, 300);
    }
}

function hideError() {
    const errorContainer = document.getElementById('error-state');
    if (errorContainer) {
        errorContainer.classList.remove('show');
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 300);
    }
}

function showFormError(message) {
    const trackingInput = document.getElementById('tracking-number');
    if (!trackingInput) return;
    
    // Create or update error message
    let errorEl = trackingInput.parentElement.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        trackingInput.parentElement.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    errorEl.style.cssText = `
        color: var(--danger-600);
        font-size: 0.875rem;
        margin-top: var(--space-xs);
        animation: shake 0.5s ease-in-out;
    `;
    
    // Add shake animation
    if (!document.querySelector('#form-error-styles')) {
        const styles = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            .form-error {
                animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'form-error-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Highlight input
    trackingInput.style.borderColor = 'var(--danger-500)';
    trackingInput.focus();
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorEl && errorEl.parentNode) {
            errorEl.remove();
        }
        trackingInput.style.borderColor = '';
    }, 5000);
}

// ===== Result Actions Setup ===== //
function setupResultActions() {
    // View Details button
    // const viewDetailsBtn = document.getElementById('view-details-btn');
    // if (viewDetailsBtn) {
    //     viewDetailsBtn.addEventListener('click', function() {
    //         console.log('View full details clicked');
    //         // In a real app, this would navigate to a detailed view
    //         showToast('Detailed view would open here', 'info');
    //     });
    // }
    
    // Track Another button
    const trackAnotherBtn = document.getElementById('track-another-btn');
    if (trackAnotherBtn) {
        trackAnotherBtn.addEventListener('click', function() {
            resetForm();
        });
    }
    
    // Try Again button (in error state)
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            resetForm();
        });
    }
}

function resetForm() {
    // Hide results and errors
    hideResults();
    hideError();
    
    // Clear form
    const trackingInput = document.getElementById('tracking-number');
    const courierSelect = document.getElementById('courier-select');
    
    if (trackingInput) {
        trackingInput.value = '';
        trackingInput.focus();
    }
    
    if (courierSelect) {
        courierSelect.value = '';
    }
    
    // Scroll to form
    document.querySelector('.track-form-card').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// ===== URL Parameter Handling ===== //
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingId = urlParams.get('id');
    
    if (trackingId) {
        const trackingInput = document.getElementById('tracking-number');
        if (trackingInput) {
            trackingInput.value = trackingId;
            autoDetectCourier(trackingId);
            
            // Auto-submit after a short delay
            setTimeout(() => {
                handleTrackingSubmission();
            }, 500);
        }
    }
}

// ===== Toast Function (reuse from main dashboard) ===== //
function showToast(message, type = 'success') {
    // Use the existing toast function from dashboard script if available
    if (window.NexusTrackDashboard && window.NexusTrackDashboard.showToast) {
        window.NexusTrackDashboard.showToast(message, type);
        return;
    }
    
    // Fallback toast implementation
    console.log(`Toast: ${message} (${type})`);
    alert(message); // Simple fallback
}

// ===== Export functions for potential use by other scripts ===== //
window.NexusTrackShipment = {
    performTracking,
    resetForm,
    showTrackingResults,
    showTrackingError
};