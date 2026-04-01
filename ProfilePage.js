window.onload = function() {
    let userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
        document.getElementById('userName').textContent = userData.fullName;
        document.getElementById('userEmail').textContent = userData.email;
    }
};