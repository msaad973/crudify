// Selecting all form input elements
const userImgInput = document.getElementById('image');
const userFNameInput = document.getElementById('firstName');
const userLNameInput = document.getElementById('lastName');
const userPhoneInput = document.getElementById('phone');
const userEmailInput = document.getElementById('email');
const userAddressInput = document.getElementById('address');
const userBirthDateInput = document.getElementById('birthDate');
const userAgeInput = document.getElementById('age');
const userGenderInput = document.getElementById('gender');
const userForm = document.getElementById('add-user-form'); // Select the form

// Handle form submission
userForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting and reloading the page

    // Get the data from the form fields and create a new user object
    const newUser = {
        id: Date.now(), // Generate a unique ID
        image: userImgInput.value,
        firstName: userFNameInput.value,
        lastName: userLNameInput.value,
        phone: userPhoneInput.value,
        email: userEmailInput.value,
        address: userAddressInput.value,
        birthDate: userBirthDateInput.value,
        age: userAgeInput.value,
        gender: userGenderInput.value
    };
    console.log('fcfcfc', userAddressInput, 'new user', newUser)
    let users = JSON.parse(localStorage.getItem('get-users')) || [];
    users.push(newUser);
    localStorage.setItem('get-users', JSON.stringify(users));
    userForm.reset();
});
