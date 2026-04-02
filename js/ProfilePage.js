window.onload = function() {
    let userData = JSON.parse(localStorage.getItem('user') || '[]').find(user => user.email === JSON.parse(localStorage.getItem('currentUser')).email);
    if (userData) {
        document.getElementById('userName').textContent = userData.fullName;
        document.getElementById('userEmail').textContent = userData.email;
    }
};