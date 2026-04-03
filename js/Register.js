// Register Page JavaScript with enhanced validation

function RegisterButton() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword')?.value.trim() || '';

    let isValid = true;

    // Clear previous errors
    SecurityUtils.clearFormErrors();

    // Validate Full Name
    if (fullName === '') {
        SecurityUtils.showErrorMessage('NameError', 'Full name is required.');
        isValid = false;
    } else if (!SecurityUtils.validateFullName(fullName)) {
        SecurityUtils.showErrorMessage('NameError', 'Full name must contain only letters and spaces.');
        isValid = false;
    }

    // Validate Email
    if (email === '') {
        SecurityUtils.showErrorMessage('EmailError', 'Email is required.');
        isValid = false;
    } else if (!SecurityUtils.validateEmail(email)) {
        SecurityUtils.showErrorMessage('EmailError', 'Please enter a valid email address.');
        isValid = false;
    } else if (SecurityUtils.emailExists(email)) {
        SecurityUtils.showErrorMessage('EmailError', 'This email is already registered. Please use a different email.');
        isValid = false;
    }

    // Validate Password Strength
    if (password === '') {
        SecurityUtils.showErrorMessage('PasswordError', 'Password is required.');
        isValid = false;
    } else {
        const passwordValidation = SecurityUtils.validatePasswordStrength(password);
        if (!passwordValidation.isValid) {
            SecurityUtils.showErrorMessage('PasswordError', passwordValidation.errors.join(' '));
            isValid = false;
        }
    }

    // Validate Confirm Password
    if (confirmPassword !== password) {
        SecurityUtils.showErrorMessage('ConfirmPasswordError', 'Passwords do not match.');
        isValid = false;
    }

    if (isValid) {
        // Hash password before storing
        const hashedPassword = SecurityUtils.hashPassword(password);
        
        let users = JSON.parse(localStorage.getItem('user') || '[]');
        const newUserData = {
            fullName: SecurityUtils.sanitizeInput(fullName),
            email: SecurityUtils.sanitizeInput(email),
            password: hashedPassword, // Store hashed password
            originalPassword: password, // Keep original for login (should use proper hashing in production)
            createdAt: new Date().toISOString()
        };
        
        users.push(newUserData);
        localStorage.setItem('user', JSON.stringify(users));

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Registration successful! Redirecting to login...';
        successMessage.style.marginBottom = '1rem';
        document.querySelector('section').insertBefore(successMessage, document.querySelector('.form-grid'));

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'LoginPage.html';
        }, 2000);
    }
}

// Add event listeners for real-time validation
document.addEventListener('DOMContentLoaded', () => {
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (fullNameInput) {
        fullNameInput.addEventListener('blur', () => {
            const value = fullNameInput.value.trim();
            if (value && !SecurityUtils.validateFullName(value)) {
                SecurityUtils.showErrorMessage('NameError', 'Full name must contain only letters and spaces.');
            } else {
                document.getElementById('NameError').textContent = '';
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const value = emailInput.value.trim();
            if (value && !SecurityUtils.validateEmail(value)) {
                SecurityUtils.showErrorMessage('EmailError', 'Please enter a valid email address.');
            } else if (value && SecurityUtils.emailExists(value)) {
                SecurityUtils.showErrorMessage('EmailError', 'This email is already registered.');
            } else {
                document.getElementById('EmailError').textContent = '';
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', () => {
            const value = passwordInput.value.trim();
            if (value) {
                const validation = SecurityUtils.validatePasswordStrength(value);
                if (!validation.isValid) {
                    SecurityUtils.showErrorMessage('PasswordError', validation.errors[0]);
                } else {
                    document.getElementById('PasswordError').textContent = '';
                }
            }
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', () => {
            const password = passwordInput.value.trim();
            const confirm = confirmPasswordInput.value.trim();
            if (confirm && confirm !== password) {
                SecurityUtils.showErrorMessage('ConfirmPasswordError', 'Passwords do not match.');
            } else {
                document.getElementById('ConfirmPasswordError').textContent = '';
            }
        });
    }
});

// Expose function to global scope
window.RegisterButton = RegisterButton;