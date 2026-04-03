// Login Page JavaScript with enhanced validation and security

function LoginButton() {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    // Clear previous errors
    document.getElementById('EmailError').textContent = '';
    document.getElementById('PasswordError').textContent = '';

    let isValid = true;

    // Validate Email
    if (email === '') {
        document.getElementById('EmailError').textContent = 'Email is required.';
        isValid = false;
    } else if (!SecurityUtils.validateEmail(email)) {
        document.getElementById('EmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate Password
    if (password === '') {
        document.getElementById('PasswordError').textContent = 'Password is required.';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('PasswordError').textContent = 'Invalid email or password.';
        isValid = false;
    }

    if (!isValid) return;

    // Check credentials
    const storedUsers = JSON.parse(localStorage.getItem('user') || '[]');
    let loginUser = null;

    // Find user by email
    const userByEmail = storedUsers.find(user => user.email === email);

    if (!userByEmail) {
        document.getElementById('EmailError').textContent = 'Invalid email or password.';
        logFailedLoginAttempt(email);
        return;
    }

    // Check password (compare with original password or hashed password)
    const isPasswordValid = userByEmail.password === SecurityUtils.hashPassword(password) || 
                          userByEmail.originalPassword === password;

    if (!isPasswordValid) {
        document.getElementById('PasswordError').textContent = 'Invalid email or password.';
        logFailedLoginAttempt(email);
        return;
    }

    // Login successful
    const currentUser = {
        fullName: userByEmail.fullName,
        email: userByEmail.email,
        createdAt: userByEmail.createdAt,
        lastLogin: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    logSuccessfulLogin(email);

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success';
    successMessage.textContent = 'Login successful! Redirecting...';
    successMessage.style.marginBottom = '1rem';
    document.querySelector('section').insertBefore(successMessage, document.querySelector('form'));

    // Redirect after 1 second
    setTimeout(() => {
        window.location.href = 'ProfilePage.html';
    }, 1000);
}

// ====== LOGIN SECURITY FUNCTIONS ======
function logFailedLoginAttempt(email) {
    let loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
    const key = `${email}_${new Date().toDateString()}`;
    loginAttempts[key] = (loginAttempts[key] || 0) + 1;
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));

    // Lock account after 5 failed attempts
    if (loginAttempts[key] >= 5) {
        const lockKey = `${email}_locked`;
        const lockTime = new Date();
        lockTime.setHours(lockTime.getHours() + 1);
        localStorage.setItem(lockKey, lockTime.toISOString());
        showLoginLocked(email);
    }
}

function logSuccessfulLogin(email) {
    let loginLog = JSON.parse(localStorage.getItem('loginLog') || '[]');
    loginLog.push({
        email: email,
        timestamp: new Date().toISOString(),
        ipAddress: 'browser_session', // In a real app, get actual IP
        success: true
    });
    // Keep only last 100 login records
    if (loginLog.length > 100) {
        loginLog = loginLog.slice(-100);
    }
    localStorage.setItem('loginLog', JSON.stringify(loginLog));

    // Clear failed attempts
    const key = `${email}_${new Date().toDateString()}`;
    let loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
    delete loginAttempts[key];
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
}

function showLoginLocked(email) {
    document.getElementById('EmailError').textContent = 'Account temporarily locked due to multiple failed login attempts. Try again in 1 hour.';
}

// Check if account is locked before allowing login attempts
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('input[type="email"]');
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value.trim();
            if (email) {
                const lockKey = `${email}_locked`;
                const lockTime = localStorage.getItem(lockKey);
                if (lockTime && new Date(lockTime) > new Date()) {
                    document.getElementById('EmailError').textContent = 'Account temporarily locked. Try again later.';
                }
            }
        });
    }
});

// Expose function to global scope
window.LoginButton = LoginButton;