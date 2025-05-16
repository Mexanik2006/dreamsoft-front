import { apiUrl, frontUrl } from '../../js/urls.js';

const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');
const submitBtn = document.getElementById('submitBtn');
const successToast = document.getElementById('successToast');

// Initialize Bootstrap Toast
const toast = new bootstrap.Toast(successToast, {
    delay: 1000 // Toast 3 seconds visible
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error
    errorDiv.innerText = '';

    // Show loader
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post(`${apiUrl}/api/login`, {
            login,
            password
        }, {
            withCredentials: true
        });

        if (response.data) {
            localStorage.setItem('token', response.data.token);
        }

        // Hide loader
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');

        // Show success toast
        toast.show();

        // Redirect after toast hides
        setTimeout(() => {
            window.location.href = `${frontUrl}/auth/pages/dashboard.html`;
        }, 1000); // Match toast delay
    } catch (error) {
        // Hide loader
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');

        // Show error message
        if (error.response && error.response.data && error.response.data.error) {
            errorDiv.innerText = error.response.data.error;
        } else {
            errorDiv.innerText = "Noma'lum xatolik!";
        }
    }
});