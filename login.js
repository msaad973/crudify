document.addEventListener('DOMContentLoaded', function () {
    let token = localStorage.getItem('token');
    if (token != null) {
        window.location.href = 'index.html';
    }
});

function login(event) {
    event.preventDefault();

    document.getElementById('username-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let valid = true;

    if (username.trim() === '') {
        document.getElementById('username-error').textContent = 'Username is required.';
        valid = false;
    }

    if (password.trim() === '') {
        document.getElementById('password-error').textContent = 'Password is required.';
        valid = false;
    } else if (password.length < 6) {
        document.getElementById('password-error').textContent = 'Password must be at least 6 characters long.';
        valid = false;
    }

    if (valid) {
        const apiURL = "https://dummyjson.com/auth/login";

        fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Invalid username or password');
                }
            })
            .then(data => {
                console.log("Response Data: ", data);

                localStorage.setItem('token', data.token);
                localStorage.setItem('token', data.refreshToken);
                localStorage.setItem('userId', data.id);
                localStorage.setItem('userName', username);
                localStorage.setItem('userPass', password);
                localStorage.setItem('userProfile', data.image);
                localStorage.setItem('userFirstName', data.firstName);
                localStorage.setItem('userLastName', data.lastName);

                window.location.href = 'Alluser.html';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
