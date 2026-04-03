// Security utilities for password and input handling

// ====== SIMPLE PASSWORD HASHING (for demo - use proper hashing in production) ======
function hashPassword(password) {
    // This is a simple hash - in production, use bcrypt or similar
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
}

// ====== VALIDATE PASSWORD STRENGTH ======
function validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*, etc.)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ====== VALIDATE EMAIL ======
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ====== SANITIZE INPUT (prevent XSS) ======
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// ====== CHECK IF EMAIL ALREADY EXISTS ======
function emailExists(email) {
    const users = JSON.parse(localStorage.getItem('user') || '[]');
    return users.some(user => user.email === email);
}

// ====== VALIDATE FULL NAME ======
function validateFullName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name);
}

// ====== CLEAR FORM ERRORS ======
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = '');
}

// ====== SHOW SUCCESS MESSAGE ======
function showSuccessMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'success';
        element.style.display = 'block';
    }
}

// ====== SHOW ERROR MESSAGE ======
function showErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'error';
        element.style.display = 'block';
    }
}

// ====== VALIDATE FORM FIELD ======
function validateField(fieldId, validation) {
    const field = document.getElementById(fieldId);
    if (!field) return false;
    
    const value = field.value.trim();
    
    if (validation.required && value === '') {
        showErrorMessage(fieldId + 'Error', validation.requiredMessage || 'This field is required');
        return false;
    }
    
    if (validation.validator && !validation.validator(value)) {
        showErrorMessage(fieldId + 'Error', validation.errorMessage || 'Invalid input');
        return false;
    }
    
    showSuccessMessage(fieldId + 'Error', '');
    return true;
}

// ====== CUSTOM NOTIFICATION SYSTEM ======
function showCustomAlert(message, type = 'info', duration = 3000) {
    const alertContainer = document.getElementById('customAlertContainer');
    if (!alertContainer) {
        // Create container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'customAlertContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    const alert = document.createElement('div');
    const icons = {
        'success': '✓',
        'error': '✕',
        'warning': '⚠',
        'info': 'ℹ'
    };

    const colors = {
        'success': '#27ae60',
        'error': '#ff6b6b',
        'warning': '#f39c12',
        'info': '#3498db'
    };

    const bgColors = {
        'success': '#d4edda',
        'error': '#f8d7da',
        'warning': '#fff3cd',
        'info': '#d1ecf1'
    };

    const icon = icons[type] || icons['info'];
    const color = colors[type] || colors['info'];
    const bgColor = bgColors[type] || bgColors['info'];

    alert.innerHTML = `
        <div style="
            background-color: ${bgColor};
            border-left: 4px solid ${color};
            color: ${color};
            padding: 15px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        ">
            <span style="font-size: 1.2rem; font-weight: bold;">${icon}</span>
            <span style="flex: 1;">${sanitizeInput(message)}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: ${color};
                cursor: pointer;
                font-size: 1.2rem;
                padding: 0;
                display: flex;
                align-items: center;
            ">×</button>
        </div>
        <style>
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        </style>
    `;

    const container = document.getElementById('customAlertContainer');
    container.appendChild(alert);

    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, duration);
    }

    return alert;
}

// Override window.alert with custom alert
window.alert = function(message) {
    showCustomAlert(message, 'info', 3000);
};

// Export functions for use in other files
window.SecurityUtils = {
    hashPassword,
    validatePasswordStrength,
    validateEmail,
    sanitizeInput,
    emailExists,
    validateFullName,
    clearFormErrors,
    showSuccessMessage,
    showErrorMessage,
    validateField,
    showCustomAlert
};
