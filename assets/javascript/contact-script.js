// ===== Contact/Support Page JavaScript ===== //

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

// ===== Main Initialization ===== //
function initializeContactPage() {
    setupContactForm();
    setupFAQSection();
    setupLiveChat();
    loadUserContactInfo();
    
    console.log('Contact page initialized successfully');
}

// ===== Contact Form Setup ===== //
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactFormSubmission();
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateContactField(this);
        });
        
        input.addEventListener('input', function() {
            clearContactFieldError(this);
        });
    });
    
    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        addCharacterCounter(messageField);
    }
}

function handleContactFormSubmission() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    const isValid = validateContactForm();
    
    if (!isValid) {
        showContactToast('Please fix the errors before sending', 'error');
        return;
    }
    
    // Show loading state
    showButtonLoading(submitBtn, '<i class="fas fa-spinner fa-spin"></i> Sending...');
    
    // Collect form data
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        trackingReference: formData.get('trackingReference'),
        urgent: formData.has('urgent'),
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
        // Generate ticket number
        const ticketNumber = 'NXT-' + Date.now().toString().slice(-6);
        
        // Reset form
        form.reset();
        removeCharacterCounter();
        
        // Reset button
        hideButtonLoading(submitBtn, '<i class="fas fa-paper-plane"></i> Send Message');
        
        // Show success message with ticket number
        showContactToast(`Message sent successfully! Your ticket number is ${ticketNumber}`, 'success');
        
        // Store message in local storage for reference
        storeContactMessage(contactData, ticketNumber);
        
    }, 2500);
}

function validateContactForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateContactField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateContactField(field) {
    const value = field.value.trim();
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showContactFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showContactFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            showContactFieldError(field, 'Message must be at least 10 characters');
            return false;
        }
        if (value.length > 2000) {
            showContactFieldError(field, 'Message cannot exceed 2000 characters');
            return false;
        }
    }
    
    showContactFieldSuccess(field);
    return true;
}

function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: var(--gray-500);
        margin-top: var(--space-xs);
    `;
    
    const updateCounter = () => {
        const current = textarea.value.length;
        const max = 2000;
        counter.textContent = `${current}/${max} characters`;
        
        if (current > max * 0.9) {
            counter.style.color = 'var(--warning-600)';
        } else if (current > max) {
            counter.style.color = 'var(--danger-600)';
        } else {
            counter.style.color = 'var(--gray-500)';
        }
    };
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counter);
    updateCounter();
}

function removeCharacterCounter() {
    const counter = document.querySelector('.character-counter');
    if (counter) {
        counter.remove();
    }
}

// ===== FAQ Section Setup ===== //
function setupFAQSection() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQItem(this);
        });
    });
}

function toggleFAQItem(questionBtn) {
    const faqItem = questionBtn.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const isActive = questionBtn.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-question.active').forEach(btn => {
        if (btn !== questionBtn) {
            btn.classList.remove('active');
            btn.closest('.faq-item').querySelector('.faq-answer').classList.remove('active');
        }
    });
    
    // Toggle current item
    if (isActive) {
        questionBtn.classList.remove('active');
        answer.classList.remove('active');
    } else {
        questionBtn.classList.add('active');
        answer.classList.add('active');
        
        // Scroll into view if needed
        setTimeout(() => {
            const rect = faqItem.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (!isVisible) {
                faqItem.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        }, 300);
    }
}

// ===== Live Chat Setup ===== //
function setupLiveChat() {
    const liveChatBtn = document.getElementById('live-chat-btn');
    const chatWidget = document.getElementById('live-chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');
    
    if (liveChatBtn) {
        liveChatBtn.addEventListener('click', function() {
            openLiveChat();
        });
    }
    
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            closeLiveChat();
        });
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
    
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', function() {
            sendChatMessage();
        });
    }
}

function openLiveChat() {
    const chatWidget = document.getElementById('live-chat-widget');
    if (chatWidget) {
        chatWidget.style.display = 'flex';
        
        // Focus on input after animation
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
        }, 300);
        
        // Add welcome message if this is the first time
        if (!chatWidget.dataset.initialized) {
            setTimeout(() => {
                addChatMessage('support', 'Hello! How can I help you today?');
                chatWidget.dataset.initialized = 'true';
            }, 1000);
        }
    }
}

function closeLiveChat() {
    const chatWidget = document.getElementById('live-chat-widget');
    if (chatWidget) {
        chatWidget.style.display = 'none';
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate agent response
    setTimeout(() => {
        hideTypingIndicator();
        
        const responses = [
            "Thanks for reaching out! I'll help you with that.",
            "Let me check that information for you.",
            "I understand your concern. Let me assist you.",
            "That's a great question! Here's what I can tell you...",
            "I'd be happy to help you resolve this issue.",
            "Let me look into your tracking details.",
            "I can definitely assist you with that inquiry."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('support', randomResponse);
        
        // Suggest contact form for complex issues
        if (message.length > 50) {
            setTimeout(() => {
                addChatMessage('support', 'For complex issues like this, I recommend filling out our contact form above for detailed assistance from our technical team.');
            }, 2000);
        }
    }, 1500 + Math.random() * 2000);
}

function addChatMessage(sender, text) {
    const chatBody = document.querySelector('.chat-body');
    const isUser = sender === 'user';
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = isUser ? '<i class="fas fa-user"></i>' : '<i class="fas fa-headset"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    const timeElement = document.createElement('span');
    timeElement.className = 'message-time';
    timeElement.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    content.appendChild(messageText);
    content.appendChild(timeElement);
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    
    chatBody.appendChild(messageElement);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
    const chatBody = document.querySelector('.chat-body');
    
    const typingElement = document.createElement('div');
    typingElement.className = 'chat-message support typing-indicator';
    typingElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-headset"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatBody.appendChild(typingElement);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// ===== Utility Functions ===== //
function loadUserContactInfo() {
    // Pre-fill form with user data if available
    const userName = document.querySelector('.user-name')?.textContent;
    const userEmail = 'john.doe@example.com'; // This would come from user data
    
    const nameField = document.getElementById('contact-name');
    const emailField = document.getElementById('contact-email');
    
    if (nameField && userName) {
        nameField.value = userName;
    }
    
    if (emailField) {
        emailField.value = userEmail;
    }
}

function storeContactMessage(data, ticketNumber) {
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push({
        ...data,
        ticketNumber,
        status: 'submitted'
    });
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

function showContactFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    
    clearContactFieldState(field);
    formGroup.classList.add('error');
    
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    formGroup.appendChild(errorEl);
}

function showContactFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    
    clearContactFieldState(field);
    formGroup.classList.add('success');
}

function clearContactFieldError(field) {
    clearContactFieldState(field);
}

function clearContactFieldState(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const existingError = formGroup.querySelector('.form-error');
    const existingSuccess = formGroup.querySelector('.form-success');
    
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
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

// ===== Toast Function ===== //
function showContactToast(message, type = 'success') {
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
    if (!document.querySelector('#contact-toast-styles')) {
        const styles = `
            .toast {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-lg);
                box-shadow: var(--shadow-lg);
                padding: var(--space-md) var(--space-lg);
                z-index: 2000;
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
        styleSheet.id = 'contact-toast-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds (longer for success messages with ticket numbers)
    const duration = type === 'success' && message.includes('ticket') ? 8000 : 4000;
    setTimeout(() => {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutDown 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
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

// ===== Keyboard Shortcuts ===== //
document.addEventListener('keydown', function(e) {
    // ESC to close chat
    if (e.key === 'Escape') {
        const chatWidget = document.getElementById('live-chat-widget');
        if (chatWidget && chatWidget.style.display !== 'none') {
            closeLiveChat();
        }
    }
    
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm && document.activeElement.form === contactForm) {
            e.preventDefault();
            handleContactFormSubmission();
        }
    }
});

// ===== Export functions for potential use by other scripts ===== //
window.NexusContact = {
    openLiveChat,
    closeLiveChat,
    sendChatMessage,
    validateContactField,
    showContactToast
};