window.addEventListener('beforeunload', () => {
    localStorage.removeItem('users');
    let users = JSON.parse(localStorage.getItem('get-users'));
    localStorage.setItem('users', JSON.stringify(users));
});

document.addEventListener('DOMContentLoaded', () => {
    // Load navbar
    fetch('navbar.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Check if local storage already has user data
    if (!localStorage.getItem('users')) {
        // Fetch data from the API and save it to local storage
        fetch('https://dummyjson.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('users', JSON.stringify(data.users));
                localStorage.setItem('get-users', JSON.stringify(data.users));
                renderUsers();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        // If data already exists in local storage, render it
        renderUsers();
    }

    // Add search functionality
    document.getElementById('searchBar').addEventListener('input', function () {
        let query = this.value.toLowerCase();
        renderUsers(query);
    });
});

function renderUsers(query = '') {
    let container = document.getElementById('card-body');
    container.innerHTML = '';
    let users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach((user, index) => {
        let fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (fullName.includes(query)) {
            let card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="contact-info">
                    <span>
                        <span><i>${user.phone}</i><i class="fa-solid fa-phone"></i></span>
                        <span><i>${user.email}</i><i class="fa-solid fa-envelope"></i></span>
                    </span>
                    <div class="user-image">
                        <img src="${user.image}" alt="User Image" class="user-image">
                    </div>
                </div>
                <div class="card-body">
                    <div class="info-1">
                        <p><i class="fa-solid fa-user"></i> ${user.firstName} ${user.lastName}</p>
                        <p><i class="fa-solid fa-calendar"></i> ${user.birthDate}</p>
                        <p><i class="fa-solid fa-location-dot"></i> ${user.address.constructor == String ? user.address : `${user.address.city}, ${user.address.state}`}</p>
                    </div>
                    <div class='info-2'>
                        <p><i class="Gender">Gender:</i> ${user.gender}</p>
                        <p><i class="Age">Age:</i> ${user.age}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="editBtn" onclick="editUser(${index})">Edit</button>
                    <button class="deleteBtn" onclick="deletePopUp(${index})">Delete</button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

function origionalUsers(query = '') {
    let container = document.getElementById('card-body');
    container.innerHTML = '';
    let users = JSON.parse(localStorage.getItem('get-users')) || [];

    users.forEach((user, index) => {
        let fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (fullName.includes(query)) {
            let card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="contact-info">
                    <span>
                        <span><i>${user.phone}</i><i class="fa-solid fa-phone"></i></span>
                        <span><i>${user.email}</i><i class="fa-solid fa-envelope"></i></span>
                    </span>
                    <div class="user-image">
                        <img src="${user.image}" alt="User Image" class="user-image">
                    </div>
                </div>
                <div class="card-body">
                    <div class="info-1">
                        <p><i class="fa-solid fa-user"></i> ${user.firstName} ${user.lastName}</p>
                        <p><i class="fa-solid fa-calendar"></i> ${user.birthDate}</p>
                        <p><i class="fa-solid fa-location-dot"></i> ${user.address.constructor == String ? user.address : `${user.address.city}, ${user.address.state}`}</p>
                    </div>
                    <div class='info-2'>
                        <p><i class="Gender">Gender:</i> ${user.gender}</p>
                        <p><i class="Age">Age:</i> ${user.age}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="editBtn" onclick="editUser(${index})">Edit</button>
                    <button class="deleteBtn" onclick="deletePopUp(${index})">Delete</button>
                </div>
            `;
            container.appendChild(card);
        }
    });
}

function deletePopUp(index) {
    const fetchDom = document.getElementById("deletePopup");
    fetchDom.innerHTML = `
        <div class="popup-content">
            <span class="close" onclick="closePopup()">&times;</span>
            <h2>Delete User</h2>
            <p>Are you sure you want to delete this user?</p>
            <div class="button">
                <button type="button" onclick="confirmDelete(${index})">Delete</button>
                <button type="button" onclick="closePopup()">Cancel</button>
            </div>
        </div>
    `;
    fetchDom.style.display = 'block';
}

let currentEditIndex = -1;

function editUser(index) {
    currentEditIndex = index;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];

    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPhone').value = user.phone;
    document.getElementById('editBirthDate').value = user.birthDate;
    document.getElementById('editCity').value = user.address.constructor == String ? user.address : user.address.city;
    document.getElementById('editGender').value = user.gender;
    document.getElementById('editAge').value = user.age;
    document.getElementById('editPopup').style.display = 'block';
}

function confirmDelete(index) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Simulate delete from API (for demonstration only)
    fetch(`https://dummyjson.com/users/${index}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            console.log("Deleted User:", data);
            // Remove the user from the users array
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            closePopup();
        })
        .catch(error => console.error('Error deleting user:', error));
}

function closePopup() {
    document.getElementById('editPopup').style.display = "none";
    document.getElementById('deletePopup').style.display = 'none';
}

function saveChanges() {
    if (currentEditIndex === -1) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users[currentEditIndex].firstName = document.getElementById('editFirstName').value;
    users[currentEditIndex].lastName = document.getElementById('editLastName').value;
    users[currentEditIndex].email = document.getElementById('editEmail').value;
    users[currentEditIndex].phone = document.getElementById('editPhone').value;
    users[currentEditIndex].birthDate = document.getElementById('editBirthDate').value;
    users[currentEditIndex].address.city = document.getElementById('editCity').value;
    users[currentEditIndex].gender = document.getElementById('editGender').value;
    users[currentEditIndex].age = document.getElementById('editAge').value;

    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    closePopup();
}
