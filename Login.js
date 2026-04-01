function LoginButton() {
    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value.trim();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        if (storedUser.email === email && storedUser.password === password) {
            alert('Login successful!');
            window.location.href = 'ProfilePage.html';
        } else {
            alert('Invalid email or password.');
        }
    }
}