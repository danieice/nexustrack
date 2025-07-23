// ===== Profile Page JavaScript ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeProfilePage();
});

// ===== Main Initialization ===== //
function initializeProfilePage() {
    setupProfileForm();
    setupPasswordForm();
    setupPasswordToggles();
    setupAvatarUpload();
    setupAccountActions();
    loadUserProfile();
    
    console.log('Profile page initialized successfully');
}

// ===== Profile Form Setup ===== //
function setupProfileForm() {
    const form = document.getElementById('profile-form');
    const cancelBtn = document.getElementById('cancel-btn');
    
    if (!form) return;
    
    // Store original values for cancel functionality
    const originalValues = {};
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        originalValues[input.name] = input.value;
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleProfileSubmission();
    });
    
    // Cancel button handler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            resetProfileForm(originalValues);
        });
    }
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// ===== Password Form Setup ===== //
function setupPasswordForm() {
    const form = document.getElementById('password-form');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-new-password');
    
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePasswordSubmission();
    });
    
    // Password strength checking
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
    
    // Password confirmation validation
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            validatePasswordConfirmation();
        });
    }
}

// ===== Password Toggle Setup ===== //
function setupPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
                this.classList.add('active');
            } else {
                targetInput.type = 'password';
                icon.className = 'fas fa-eye';
                this.classList.remove('active');
            }
        });
    });
}

// ===== Avatar Upload Setup ===== //
function setupAvatarUpload() {
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            showAvatarUploadModal();
        });
    }
}

function showAvatarUploadModal() {
    const modal = document.createElement('div');
    modal.className = 'avatar-upload-modal';
    modal.innerHTML = `
        <div class="avatar-upload-content">
            <h3>Change Profile Picture</h3>
            <div class="avatar-options">
                <div class="avatar-option" onclick="uploadFromFile()">
                    <i class="fas fa-upload"></i>
                    <p>Upload Photo</p>
                </div>
                <div class="avatar-option" onclick="generateNewAvatar()">
                    <i class="fas fa-user-circle"></i>
                    <p>Generate Avatar</p>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn btn-outline" onclick="closeAvatarModal()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking overlay
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeAvatarModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeAvatarModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
}

function uploadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                updateProfileAvatar(e.target.result);
                closeAvatarModal();
                showToast('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    input.click();
}

function generateNewAvatar() {
    const firstName = document.getElementById('first-name').value || 'User';
    const lastName = document.getElementById('last-name').value || 'Name';
    const colors = ['8B5CF6', '10B981', '3B82F6', 'F59E0B', 'EF4444', '8B5A2B', '6366F1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}+${encodeURIComponent(lastName)}&background=${randomColor}&color=fff&size=120`;
    
    updateProfileAvatar(newAvatarUrl);
    closeAvatarModal();
    showToast('New avatar generated successfully!', 'success');
}

function updateProfileAvatar(newAvatarUrl) {
    const profileAvatar = document.querySelector('.profile-avatar');
    const headerAvatar = document.querySelector('.user-avatar');
    
    if (profileAvatar) profileAvatar.src = newAvatarUrl;
    if (headerAvatar) headerAvatar.src = newAvatarUrl;
}

function closeAvatarModal() {
    const modal = document.querySelector('.avatar-upload-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== Account Actions Setup ===== //
function setupAccountActions() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            handleLogout();
        });
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        // Show loading state
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.style.opacity = '0.6';
            logoutBtn.style.pointerEvents = 'none';
        }
        
        // Simulate logout process
        setTimeout(() => {
            showToast('Logging out...', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 500);
    }
}

// ===== Form Submission Handlers ===== //
function handleProfileSubmission() {
    const form = document.getElementById('profile-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    const isValid = validateProfileForm();
    
    if (!isValid) {
        showToast('Please fix the errors before saving', 'error');
        return;
    }
    
    // Show loading state
    showButtonLoading(submitBtn, 'Saving...');
    
    // Simulate API call
    setTimeout(() => {
        // Update user name in header
        updateHeaderUserName();
        
        // Reset button state
        hideButtonLoading(submitBtn, '<i class="fas fa-save"></i> Save Changes');
        
        showToast('Profile updated successfully!', 'success');
    }, 2000);
}

function handlePasswordSubmission() {
    const form = document.getElementById('password-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate password form
    const isValid = validatePasswordForm();
    
    if (!isValid) {
        showToast('Please fix the errors before updating password', 'error');
        return;
    }
    
    // Show loading state
    showButtonLoading(submitBtn, 'Updating...');
    
    // Simulate API call
    setTimeout(() => {
        // Clear password fields
        form.reset();
        hidePasswordStrength();
        
        // Reset button state
        hideButtonLoading(submitBtn, '<i class="fas fa-key"></i> Update Password');
        
        showToast('Password updated successfully!', 'success');
    }, 2000);
}

// ===== Validation Functions ===== //
function validateProfileForm() {
    const form = document.getElementById('profile-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validatePasswordForm() {
    const currentPassword = document.getElementById('current-password');
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-new-password');
    
    let isValid = true;
    
    // Validate current password
    if (!currentPassword.value.trim()) {
        showFieldError(currentPassword, 'Current password is required');
        isValid = false;
    } else {
        showFieldSuccess(currentPassword);
    }
    
    // Validate new password
    if (!newPassword.value.trim()) {
        showFieldError(newPassword, 'New password is required');
        isValid = false;
    } else if (newPassword.value.length < 8) {
        showFieldError(newPassword, 'Password must be at least 8 characters');
        isValid = false;
    } else {
        showFieldSuccess(newPassword);
    }
    
    // Validate password confirmation
    if (!confirmPassword.value.trim()) {
        showFieldError(confirmPassword, 'Please confirm your new password');
        isValid = false;
    } else if (newPassword.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        isValid = false;
    } else {
        showFieldSuccess(confirmPassword);
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    showFieldSuccess(field);
    return true;
}

function validatePasswordConfirmation() {
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-new-password');
    
    if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
        showFieldError(confirmPassword, 'Passwords do not match');
        return false;
    } else if (confirmPassword.value) {
        showFieldSuccess(confirmPassword);
        return true;
    }
    
    clearFieldError(confirmPassword);
    return true;
}

// ===== Password Strength Checker ===== //
function checkPasswordStrength(password) {
    const strengthContainer = document.getElementById('password-strength');
    
    if (!password) {
        hidePasswordStrength();
        return;
    }
    
    const strength = calculatePasswordStrength(password);
    showPasswordStrength(strength);
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Determine strength level
    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 5) return 'good';
    return 'strong';
}

function showPasswordStrength(strength) {
    const strengthContainer = document.getElementById('password-strength');
    
    const strengthTexts = {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
    };
    
    strengthContainer.innerHTML = `
        <div class="strength-bar ${strength}"></div>
        <span class="strength-text ${strength}">${strengthTexts[strength]} Password</span>
    `;
    
    strengthContainer.classList.add('visible');
}

function hidePasswordStrength() {
    const strengthContainer = document.getElementById('password-strength');
    strengthContainer.classList.remove('visible');
}

// ===== Field State Functions ===== //
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    
    clearFieldState(field);
    formGroup.classList.add('error');
    
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    formGroup.appendChild(errorEl);
}

function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    
    clearFieldState(field);
    formGroup.classList.add('success');
}

function clearFieldError(field) {
    clearFieldState(field);
}

function clearFieldState(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const existingError = formGroup.querySelector('.form-error');
    const existingSuccess = formGroup.querySelector('.form-success');
    
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
}

// ===== Utility Functions ===== //
function resetProfileForm(originalValues) {
    const form = document.getElementById('profile-form');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.value = originalValues[input.name] || '';
        clearFieldState(input);
    });
    
    showToast('Changes discarded', 'info');
}

function updateHeaderUserName() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const fullName = `${firstName} ${lastName}`.trim();
    
    const headerUserName = document.querySelector('.user-name');
    if (headerUserName && fullName) {
        headerUserName.textContent = fullName;
    }
}

function showButtonLoading(button, text) {
    button.classList.add('btn-loading');
    button.disabled = true;
    button.innerHTML = text;
}

function hideButtonLoading(button, originalHTML) {
    button.classList.remove('btn-loading');
    button.disabled = false;
    button.innerHTML = originalHTML;
}

function loadUserProfile() {
    // In a real application, this would load data from an API
    console.log('User profile loaded from local storage/API');
}

// ===== Toast Function ===== //
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
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already added
    if (!document.querySelector('#profile-toast-styles')) {
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
            
            .toast-success { border-left: 4px solid var(--success-500); }
            .toast-error { border-left: 4px solid var(--danger-500); }
            .toast-info { border-left: 4px solid var(--info-500); }
            .toast-warning { border-left: 4px solid var(--warning-500); }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }
            
            .toast-success i { color: var(--success-500); }
            .toast-error i { color: var(--danger-500); }
            .toast-info i { color: var(--info-500); }
            .toast-warning i { color: var(--warning-500); }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'profile-toast-styles';
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

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
}

// ===== Global Functions for Modal ===== //
window.uploadFromFile = uploadFromFile;
window.generateNewAvatar = generateNewAvatar;
window.closeAvatarModal = closeAvatarModal;

// ===== Export functions for potential use by other scripts ===== //
window.NexusProfile = {
    validateField,
    checkPasswordStrength,
    updateProfileAvatar,
    showToast
};