// ===== Shipment Details JavaScript ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeShipmentDetails();
});

// ===== Main Initialization ===== //
function initializeShipmentDetails() {
    setupActionButtons();
    loadShipmentData();
    loadTimeline();
    
    console.log('Shipment details page initialized successfully');
}

// ===== Load Shipment Data ===== //
function loadShipmentData() {
    // Get shipment ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const shipmentId = urlParams.get('id') || 'TRK123456789';
    
    // Generate mock shipment data
    const shipmentData = generateMockShipmentData(shipmentId);
    
    // Update page content
    updateShipmentContent(shipmentData);
}

function generateMockShipmentData(shipmentId) {
    const statuses = ['in-transit', 'delivered', 'out-for-delivery', 'delayed'];
    const couriers = ['DHL Express', 'FedEx', 'UPS', 'TNT', 'Aramex'];
    const origins = ['Lagos, Nigeria', 'Nairobi, Kenya', 'Cape Town, South Africa', 'Accra, Ghana'];
    const destinations = ['Cairo, Egypt', 'Casablanca, Morocco', 'Addis Ababa, Ethiopia', 'Dar es Salaam, Tanzania'];
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const courier = couriers[Math.floor(Math.random() * couriers.length)];
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    
    // Calculate dates
    const shipDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const deliveryDate = new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000);
    const daysInTransit = Math.ceil((Date.now() - shipDate.getTime()) / (24 * 60 * 60 * 1000));
    
    return {
        trackingNumber: shipmentId,
        status,
        courier,
        estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        daysInTransit: `${daysInTransit} days`,
        serviceType: 'Express Delivery',
        weight: `${(Math.random() * 10 + 0.5).toFixed(1)} kg`,
        packageType: ['Document', 'Electronics', 'Clothing', 'Medical Supplies'][Math.floor(Math.random() * 4)],
        origin,
        destination,
        recipient: 'John Doe',
        contact: '+233 XX XXX XXXX'
    };
}

function updateShipmentContent(data) {
    // Update header information
    document.getElementById('shipment-id').textContent = data.trackingNumber;
    
    const statusBadge = document.getElementById('shipment-status');
    statusBadge.textContent = formatStatusText(data.status);
    statusBadge.className = `status-badge ${data.status}`;
    applyStatusStyling(statusBadge, data.status);
    
    document.getElementById('courier-info').innerHTML = `
        <i class="fas fa-truck"></i>
        ${data.courier}
    `;
    
    document.getElementById('estimated-delivery').textContent = data.estimatedDelivery;
    document.getElementById('days-transit').textContent = data.daysInTransit;
    
    // Update info cards
    document.getElementById('info-tracking').textContent = data.trackingNumber;
    document.getElementById('info-service').textContent = data.serviceType;
    document.getElementById('info-weight').textContent = data.weight;
    document.getElementById('info-package').textContent = data.packageType;
    document.getElementById('info-origin').textContent = data.origin;
    document.getElementById('info-destination').textContent = data.destination;
    document.getElementById('info-recipient').textContent = data.recipient;
    document.getElementById('info-contact').textContent = data.contact;
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

// ===== Timeline Functions ===== //
function loadTimeline() {
    const timelineContainer = document.getElementById('shipment-timeline');
    
    if (!timelineContainer) return;
    
    // Show loading state
    timelineContainer.innerHTML = `
        <div class="timeline-loading">
            <div class="spinner"></div>
        </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const timelineData = generateMockTimelineData();
        renderTimeline(timelineData);
    }, 1500);
}

function generateMockTimelineData() {
    const events = [
        {
            title: 'Package Delivered',
            description: 'Package has been delivered successfully to the recipient',
            location: 'Accra, Ghana',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            status: 'pending'
        },
        {
            title: 'Out for Delivery',
            description: 'Package is out for delivery and will arrive today',
            location: 'Accra Distribution Center',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: 'current'
        },
        {
            title: 'Arrived at Destination Hub',
            description: 'Package has arrived at the destination sorting facility',
            location: 'Accra International Hub',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: 'completed'
        },
        {
            title: 'In Transit',
            description: 'Package is in transit to destination country',
            location: 'International Transit',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'completed'
        },
        {
            title: 'Departed Origin Hub',
            description: 'Package has left the origin sorting facility',
            location: 'Lagos International Hub',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'completed'
        },
        {
            title: 'Package Collected',
            description: 'Package has been collected from sender',
            location: 'Lagos, Nigeria',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            status: 'completed'
        }
    ];
    
    return events;
}

function renderTimeline(events) {
    const timelineContainer = document.getElementById('shipment-timeline');
    
    if (!timelineContainer) return;
    
    const timelineHTML = events.map(event => `
        <div class="timeline-item ${event.status}">
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4 class="timeline-title">${event.title}</h4>
                    <span class="timeline-date">${formatTimelineDate(event.date)}</span>
                </div>
                <p class="timeline-description">${event.description}</p>
                <div class="timeline-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${event.location}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    timelineContainer.innerHTML = timelineHTML;
}

function formatTimelineDate(date) {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return `Today, ${date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else if (diffDays === -1) {
        return `Yesterday, ${date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else if (diffDays === 1) {
        return `Tomorrow, ${date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else if (diffDays < 0) {
        return `${Math.abs(diffDays)} days ago, ${date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

// ===== Action Buttons Setup ===== //
function setupActionButtons() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            handleRefresh();
        });
    }
    
    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            handleShare();
        });
    }
}

function handleRefresh() {
    const refreshBtn = document.getElementById('refresh-btn');
    const refreshIcon = refreshBtn.querySelector('i');
    
    // Add loading state
    refreshIcon.classList.add('refresh-loading');
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt refresh-loading"></i> Refreshing...';
    
    // Simulate refresh
    setTimeout(() => {
        // Reload timeline
        loadTimeline();
        
        // Reset button
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Status';
        
        // Show success message
        showToast('Shipment status updated successfully', 'success');
    }, 2000);
}

function handleShare() {
    const shipmentId = document.getElementById('shipment-id').textContent;
    const shareUrl = `${window.location.origin}/shipment-details.html?id=${shipmentId}`;
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'Nexustrack Shipment Details',
            text: `Track shipment ${shipmentId}`,
            url: shareUrl
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareUrl);
        });
    } else {
        fallbackShare(shareUrl);
    }
}

function fallbackShare(url) {
    // Fallback to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('Tracking link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            showShareModal(url);
        });
    } else {
        showShareModal(url);
    }
}

function showShareModal(url) {
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-modal-content">
            <div class="share-modal-header">
                <h3>Share Tracking Link</h3>
                <button class="close-modal" onclick="this.closest('.share-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="share-modal-body">
                <p>Copy this link to share the tracking information:</p>
                <div class="share-url-container">
                    <input type="text" value="${url}" readonly class="share-url-input">
                    <button class="copy-url-btn" onclick="copyShareUrl(this)">
                        <i class="fas fa-copy"></i>
                        Copy
                    </button>
                </div>
            </div>
        </div>
        <div class="share-modal-overlay" onclick="this.closest('.share-modal').remove()"></div>
    `;
    
    // Add modal styles if not already added
    if (!document.querySelector('#share-modal-styles')) {
        const styles = `
            .share-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease-out;
            }
            
            .share-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }
            
            .share-modal-content {
                background: white;
                border-radius: var(--radius-xl);
                box-shadow: var(--shadow-xl);
                max-width: 500px;
                width: 90%;
                position: relative;
                z-index: 1;
                animation: slideUp 0.3s ease-out;
            }
            
            .share-modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-lg) var(--space-xl);
                border-bottom: 1px solid var(--gray-200);
            }
            
            .share-modal-header h3 {
                margin: 0;
                color: var(--gray-800);
            }
            
            .close-modal {
                background: none;
                border: none;
                padding: var(--space-sm);
                border-radius: var(--radius-md);
                color: var(--gray-500);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .close-modal:hover {
                background: var(--gray-100);
                color: var(--gray-700);
            }
            
            .share-modal-body {
                padding: var(--space-xl);
            }
            
            .share-modal-body p {
                margin-bottom: var(--space-md);
                color: var(--gray-600);
            }
            
            .share-url-container {
                display: flex;
                gap: var(--space-sm);
            }
            
            .share-url-input {
                flex: 1;
                padding: var(--space-md);
                border: 2px solid var(--gray-200);
                border-radius: var(--radius-md);
                font-family: 'Courier New', monospace;
                font-size: 0.875rem;
                background: var(--gray-50);
            }
            
            .copy-url-btn {
                padding: var(--space-md) var(--space-lg);
                background: var(--primary-500);
                color: white;
                border: none;
                border-radius: var(--radius-md);
                font-weight: 500;
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }
            
            .copy-url-btn:hover {
                background: var(--primary-600);
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'share-modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(modal);
}

function copyShareUrl(button) {
    const input = button.parentElement.querySelector('.share-url-input');
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.style.background = 'var(--success-500)';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            button.style.background = 'var(--primary-500)';
        }, 2000);
        
        showToast('Link copied to clipboard!', 'success');
    } catch (err) {
        showToast('Failed to copy link', 'error');
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
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#details-toast-styles')) {
        const styles = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                padding: var(--space-md) var(--space-lg);
                z-index: 1000;
                animation: slideInUp 0.3s ease-out;
                max-width: 400px;
            }
            
            .toast-success {
                border-left: 4px solid var(--success-500);
            }
            
            .toast-error {
                border-left: 4px solid var(--danger-500);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }
            
            .toast-success i {
                color: var(--success-500);
            }
            
            .toast-error i {
                color: var(--danger-500);
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'details-toast-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutDown 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 3000);
}

// ===== Export functions for potential use by other scripts ===== //
window.NexusShipmentDetails = {
    loadShipmentData,
    loadTimeline,
    handleRefresh,
    handleShare
};