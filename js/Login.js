function LoginButton() {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    const storedUser = JSON.parse(localStorage.getItem('user') || '[]');

    let loginUser = storedUser.find(user => user.email === email && user.password === password);

    let userByEmail = storedUser.find(user => user.email === email);
    
    document.getElementById('EmailError').textContent = '';
    document.getElementById('PasswordError').textContent = '';

    if (!userByEmail) {
        document.getElementById('EmailError').textContent = 'Invalid email. Please try again.';
    } else if (userByEmail.password !== password) {
        document.getElementById('PasswordError').textContent = 'Invalid password. Please try again.';
    } else {
        localStorage.setItem('currentUser', JSON.stringify(loginUser));
        window.location.href = 'ProfilePage.html';  
    }
}