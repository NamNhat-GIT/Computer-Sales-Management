function LoginButton() {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    const storedUser = JSON.parse(localStorage.getItem('user') || '[]');

    let loginUser = storedUser.find(user => user.email === email && user.password === password);

    if (loginUser) {
        alert('Login successful!');
        localStorage.setItem('currentUser', JSON.stringify(loginUser));
        window.location.href = 'ProfilePage.html';
    } else {
        alert('Invalid email or password. Please try again.');
    }
}