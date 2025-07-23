// ===== Dashboard JavaScript ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// ===== Main Initialization ===== //
function initializeDashboard() {
    // Initialize components
    setupUserDropdown();
    setupMobileMenu();
    setupNotifications();
    setupAnimations();
    loadShipments();
    updateSummaryCards();
    
    // Add event listeners
    addEventListeners();
    
    console.log('Dashboard initialized successfully');
}

// ===== User Dropdown Menu ===== //
function setupUserDropdown() {
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    
    if (!userBtn || !dropdown) return;
    
    // Toggle dropdown on button click
    userBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target) && !userBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdown.classList.remove('show');
        }
    });
}

// ===== Mobile Menu ===== //
function setupMobileMenu() {
    // Create mobile menu toggle if it doesn't exist
    const header = document.querySelector('.dashboard-header .header-container');
    const nav = document.querySelector('.header-nav');
    
    if (!header || !nav) return;
    
    // Check if mobile toggle already exists
    let mobileToggle = header.querySelector('.mobile-menu-toggle');
    
    if (!mobileToggle) {
        mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        
        // Insert before header-right
        const headerRight = header.querySelector('.header-right');
        header.insertBefore(mobileToggle, headerRight);
    }
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        nav.classList.toggle('show');
        const icon = mobileToggle.querySelector('i');
        
        if (nav.classList.contains('show')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.classList.remove('show');
            mobileToggle.querySelector('i').className = 'fas fa-bars';
        }
    });
}

// ===== Notifications ===== //
function setupNotifications() {
    const notificationBtn = document.getElementById('notifications');
    
    if (!notificationBtn) return;
    
    notificationBtn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Show notification panel (placeholder)
        showNotificationPanel();
    });
}

function showNotificationPanel() {
    // Create a simple notification panel
    const existingPanel = document.querySelector('.notification-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }
    
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.innerHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            <button class="close-btn" onclick="this.closest('.notification-panel').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <div class="notification-icon">
                    <i class="fas fa-truck"></i>
                </div>
                <div class="notification-content">
                    <h4>Shipment Update</h4>
                    <p>Your package NX123456 is out for delivery</p>
                    <span class="notification-time">2 minutes ago</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon delivered">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="notification-content">
                    <h4>Delivery Completed</h4>
                    <p>Package NX789012 has been delivered successfully</p>
                    <span class="notification-time">1 hour ago</span>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="notification-content">
                    <h4>Delivery Delayed</h4>
                    <p>Package NX345678 is experiencing delays</p>
                    <span class="notification-time">3 hours ago</span>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for notification panel
    const styles = `
        .notification-panel {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            max-height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            border: 1px solid var(--gray-200);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            overflow: hidden;
        }
        
        .notification-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--gray-200);
            background: var(--gray-50);
        }
        
        .notification-header h3 {
            margin: 0;
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--gray-800);
        }
        
        .close-btn {
            background: none;
            border: none;
            padding: 4px;
            border-radius: 4px;
            color: var(--gray-500);
            cursor: pointer;
            transition: all 0.15s ease;
        }
        
        .close-btn:hover {
            background: var(--gray-200);
            color: var(--gray-700);
        }
        
        .notification-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--gray-100);
            transition: background 0.15s ease;
        }
        
        .notification-item:hover {
            background: var(--gray-50);
        }
        
        .notification-item:last-child {
            border-bottom: none;
        }
        
        .notification-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--info-100);
            color: var(--info-600);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .notification-icon.delivered {
            background: var(--success-100);
            color: var(--success-600);
        }
        
        .notification-icon.warning {
            background: var(--warning-100);
            color: var(--warning-600);
        }
        
        .notification-content h4 {
            margin: 0 0 4px 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--gray-800);
        }
        
        .notification-content p {
            margin: 0 0 4px 0;
            font-size: 0.8125rem;
            color: var(--gray-600);
            line-height: 1.4;
        }
        
        .notification-time {
            font-size: 0.75rem;
            color: var(--gray-500);
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 480px) {
            .notification-panel {
                right: 10px;
                left: 10px;
                width: auto;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(panel);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (panel && panel.parentNode) {
            panel.remove();
        }
    }, 10000);
}

// ===== Animations ===== //
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.summary-card, .action-card, .shipment-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add staggered animation delay
    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ===== Load Shipments ===== //
function loadShipments() {
    const shipmentsList = document.getElementById('shipments-list');
    
    if (!shipmentsList) return;
    
    // Show loading state
    shipmentsList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Simulate API call with setTimeout
    setTimeout(() => {
        const shipments = generateMockShipments();
        renderShipments(shipments);
    }, 1000);
}

function generateMockShipments() {
    const statuses = ['in-transit', 'delivered', 'delayed'];
    const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];
    const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];
    
    return Array.from({ length: 6 }, (_, i) => ({
        id: `NX${String(Math.floor(Math.random() * 900000) + 100000)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        carrier: carriers[Math.floor(Math.random() * carriers.length)],
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        description: ['Electronics Package', 'Document Envelope', 'Clothing Items', 'Medical Supplies'][Math.floor(Math.random() * 4)]
    }));
}

function renderShipments(shipments) {
    const shipmentsList = document.getElementById('shipments-list');
    
    if (!shipmentsList) return;
    
    if (shipments.length === 0) {
        shipmentsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No shipments found</h3>
                <p>Track your first shipment to get started</p>
            </div>
        `;
        return;
    }
    
    const shipmentsHTML = shipments.map(shipment => `
        <div class="shipment-item" data-shipment-id="${shipment.id}">
            <div class="shipment-status ${shipment.status}"></div>
            <div class="shipment-info">
                <h4>${shipment.id}</h4>
                <p>${shipment.description} • ${shipment.carrier}</p>
                <p class="shipment-location">${shipment.location}</p>
            </div>
            <div class="shipment-date">
                <p>${shipment.date}</p>
                <span class="status-badge ${shipment.status}">
                    ${formatStatus(shipment.status)}
                </span>
            </div>
            <div class="shipment-actions">
                <button class="action-btn" onclick="trackShipment('${shipment.id}')" title="Track Shipment">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="shareShipment('${shipment.id}')" title="Share">
                    <i class="fas fa-share"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    shipmentsList.innerHTML = shipmentsHTML;
    
    // Add status badge styles
    addStatusBadgeStyles();
}

function addStatusBadgeStyles() {
    if (document.querySelector('#status-badge-styles')) return;
    
    const styles = `
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-badge.in-transit {
            background: var(--info-100);
            color: var(--info-700);
        }
        
        .status-badge.delivered {
            background: var(--success-100);
            color: var(--success-700);
        }
        
        .status-badge.delayed {
            background: var(--danger-100);
            color: var(--danger-700);
        }
        
        .shipment-location {
            font-size: 0.8125rem;
            color: var(--gray-500);
            margin-top: 4px;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'status-badge-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function formatStatus(status) {
    const statusMap = {
        'in-transit': 'In Transit',
        'delivered': 'Delivered',
        'delayed': 'Delayed'
    };
    return statusMap[status] || status;
}

// ===== Update Summary Cards ===== //
function updateSummaryCards() {
    // Simulate real-time updates
    const cards = [
        { id: 'total-shipments', value: 24 },
        { id: 'in-transit', value: 8 },
        { id: 'delivered', value: 14 },
        { id: 'delayed', value: 2 }
    ];
    
    cards.forEach(card => {
        const element = document.getElementById(card.id);
        if (element) {
            animateCounter(element, card.value);
        }
    });
}

function animateCounter(element, target) {
    const start = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Event Listeners ===== //
function addEventListeners() {
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle scroll for header effects
    window.addEventListener('scroll', handleScroll);
    
    // Handle keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Handle summary card interactions
    setupSummaryCardInteractions();
}

function handleResize() {
    // Update mobile menu state
    const nav = document.querySelector('.header-nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768 && nav) {
        nav.classList.remove('show');
        if (mobileToggle) {
            mobileToggle.querySelector('i').className = 'fas fa-bars';
        }
    }
}

function handleScroll() {
    const header = document.querySelector('.dashboard-header');
    if (!header) return;
    
    if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        header.style.backdropFilter = 'blur(12px)';
    } else {
        header.style.boxShadow = '';
        header.style.backdropFilter = 'blur(10px)';
    }
}

function handleKeyboardNavigation(e) {
    // Close dropdowns on Escape
    if (e.key === 'Escape') {
        document.querySelector('.user-dropdown')?.classList.remove('show');
        document.querySelector('.notification-panel')?.remove();
    }
    
    // Quick actions with keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'k':
                e.preventDefault();
                // Focus on search/track input (if exists)
                break;
            case '/':
                e.preventDefault();
                // Open help/support
                break;
        }
    }
}

function setupSummaryCardInteractions() {
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px) scale(1)';
        });
        
        // Add click handler for detailed view
        card.addEventListener('click', function() {
            const cardType = this.classList[1]; // Get the second class (total, in-transit, etc.)
            showDetailedView(cardType);
        });
    });
}

function showDetailedView(cardType) {
    // Placeholder for detailed view functionality
    console.log(`Showing detailed view for: ${cardType}`);
    
    // Add visual feedback
    const card = document.querySelector(`.summary-card.${cardType}`);
    if (card) {
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'translateY(-4px) scale(1)';
        }, 150);
    }
}

// ===== Utility Functions ===== //
function trackShipment(shipmentId) {
    console.log(`Tracking shipment: ${shipmentId}`);
    
    // Add visual feedback
    const shipmentItem = document.querySelector(`[data-shipment-id="${shipmentId}"]`);
    if (shipmentItem) {
        shipmentItem.style.background = 'var(--primary-50)';
        setTimeout(() => {
            shipmentItem.style.background = '';
        }, 1000);
    }
    
    // Navigate to tracking page (placeholder)
    window.location.href = `track-shipment.html?id=${shipmentId}`;
}

function shareShipment(shipmentId) {
    console.log(`Sharing shipment: ${shipmentId}`);
    
    // Create share URL
    const shareUrl = `${window.location.origin}/track?id=${shipmentId}`;
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'Nexustrack Shipment',
            text: `Track shipment ${shipmentId}`,
            url: shareUrl
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('Share link copied to clipboard!');
        });
    }
}

function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles
    if (!document.querySelector('#toast-styles')) {
        const styles = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                padding: 12px 16px;
                z-index: 1000;
                animation: slideInUp 0.3s ease-out;
            }
            
            .toast-success {
                border-left: 4px solid var(--success-500);
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .toast-success i {
                color: var(--success-500);
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
        styleSheet.id = 'toast-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// ===== Error Handling ===== //
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
    showToast('Something went wrong. Please refresh the page.', 'error');
});

// ===== Performance Monitoring ===== //
window.addEventListener('load', function() {
    // Log performance metrics
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Dashboard loaded in ${loadTime}ms`);
});

// ===== Export functions for potential use by other scripts ===== //
window.NexusTrackDashboard = {
    trackShipment,
    shareShipment,
    showToast,
    loadShipments,
    updateSummaryCards
};
