function RegisterButton() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    let isValid = true;

    // Validate Full Name
    if (fullName === '') {
        document.getElementById('NameError').textContent = 'Full Name is required.';
        isValid = false;
    }

    // Validate Email
    if (email === '') {
        document.getElementById('EmailError').textContent = 'Email is required.';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('EmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate Password
    if (password === '') {
        document.getElementById('PasswordError').textContent = 'Password is required.';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('PasswordError').textContent = 'Password must be at least 6 characters long.';
        isValid = false;
    }

    if (isValid) {
        alert('Registration successful!');
        let user = JSON.parse(localStorage.getItem('user') || '[]');
        let NewUserData = {
            fullName: fullName,
            email: email,
            password: password
        };
        user.push(NewUserData);

        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'LoginPage.html';
    }
}