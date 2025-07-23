// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Get current page
    const isSignup = window.location.pathname.includes('signup');
    const isLogin = window.location.pathname.includes('login');
    
    // Password toggle functionality
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }
    
    // Password strength checker (for signup page)
    if (isSignup) {
        const passwordStrengthDiv = document.getElementById('password-strength');
        
        passwordInput?.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            passwordStrengthDiv.className = 'password-strength';
            
            if (password.length > 0) {
                if (strength < 30) {
                    passwordStrengthDiv.classList.add('weak');
                } else if (strength < 60) {
                    passwordStrengthDiv.classList.add('medium');
                } else {
                    passwordStrengthDiv.classList.add('strong');
                }
            }
        });
        
        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        confirmPasswordInput?.addEventListener('blur', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                this.classList.add('error');
                showFieldError(this, 'Passwords do not match');
            } else {
                this.classList.remove('error');
                this.classList.add('success');
                hideFieldError(this);
            }
        });
        
        // Signup form submission
        const signupForm = document.getElementById('signup-form');
        
        signupForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSignupForm()) {
                const formData = new FormData(this);
                const userData = Object.fromEntries(formData);
                handleSignup(userData);
            }
        });
    }
    
    // Login form submission
    if (isLogin) {
        const loginForm = document.getElementById('login-form');
        const demoButton = document.getElementById('demo-login');
        
        loginForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm()) {
                const formData = new FormData(this);
                const loginData = Object.fromEntries(formData);
                handleLogin(loginData);
            }
        });
        

    }
    
    // Email validation for all forms
    const emailInput = document.getElementById('email');
    
    emailInput?.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.classList.add('error');
            showFieldError(this, 'Please enter a valid email address');
        } else if (email) {
            this.classList.remove('error');
            this.classList.add('success');
            hideFieldError(this);
        }
    });
    
    // Google authentication buttons
    document.querySelectorAll('.btn-google').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Google authentication coming soon!', 'info');
        });
    });
    
    // Form input animations
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});

// Password strength calculator
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Character variety
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
}

// Form validation functions
function validateSignupForm() {
    const requiredFields = ['first-name', 'last-name', 'email', 'company', 'country', 'password', 'confirm-password'];
    const termsCheckbox = document.getElementById('terms');
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.classList.add('error');
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            field.classList.remove('error');
            hideFieldError(field);
        }
    });
    
    // Check terms agreement
    if (!termsCheckbox.checked) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        isValid = false;
    }
    
    // Check password match
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        document.getElementById('confirm-password').classList.add('error');
        showFieldError(document.getElementById('confirm-password'), 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

function validateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;
    
    if (!email.value.trim()) {
        email.classList.add('error');
        showFieldError(email, 'Email is required');
        isValid = false;
    }
    
    if (!password.value.trim()) {
        password.classList.add('error');
        showFieldError(password, 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

// Auth handlers
function handleSignup(userData) {
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success
        showNotification('Account created successfully! Redirecting to dashboard...', 'success');
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        console.log('Signup data:', userData);
    }, 2000);
}

function handleLogin(loginData) {
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        console.log('Login data:', loginData);
    }, 1500);
}



// Field error handling
function showFieldError(field, message) {
    hideFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
}

function hideFieldError(field) {
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #10B981, #059669)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #EF4444, #DC2626)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #F59E0B, #D97706)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #8B5CF6, #7C3AED)';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Handle close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'exclamation-circle';
        case 'warning':
            return 'exclamation-triangle';
        default:
            return 'info-circle';
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // Handle Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
    
    // Handle Escape key to close notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            removeNotification(notification);
        }
    }
});

// Form auto-save (optional feature)
function autoSaveForm() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], select');
        
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                const formId = form.id;
                const fieldId = input.id;
                const value = input.value;
                
                // Save to localStorage (optional)
                if (fieldId !== 'password' && fieldId !== 'confirm-password') {
                    localStorage.setItem(`${formId}-${fieldId}`, value);
                }
            }, 1000));
        });
    });
}

// Initialize auto-save (commented out by default)
// autoSaveForm();

// Smooth page transitions (optional)
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip external links
            if (href.startsWith('http') || href.includes('://')) {
                return;
            }
            
            e.preventDefault();
            
            // Add fade out effect
            document.body.style.opacity = '0.7';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Initialize page transitions
initPageTransitions();

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Here you would integrate with your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track form interactions
document.addEventListener('submit', function(e) {
    const formId = e.target.id;
    trackEvent('form_submission', { form_id: formId });
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', { 
            button_text: e.target.textContent.trim(),
            button_class: e.target.className 
        });
    }
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Track performance
    trackEvent('page_load_time', { 
        load_time: Math.round(loadTime),
        page: window.location.pathname 
    });
});