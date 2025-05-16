import { apiUrl } from './urls.js';

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.middle-content form');
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('input[placeholder="Name"]').value.trim();
        const email = contactForm.querySelector('input[placeholder="Email"]').value.trim();
        const message = contactForm.querySelector('textarea[placeholder="Message"]').value.trim();

        // Validate inputs
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/contact`, {
                name,
                email,
                message
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            showMessage(response.data.message, 'success');
            contactForm.reset(); // Clear the form
        } catch (error) {
            console.error('Error submitting contact form:', error);
            const errorMsg = error.response?.data?.error || 'Error sending message. Please try again.';
            showMessage(errorMsg, 'error');
        }
    });

    // Function to show success or error messages
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
        `;

        // Append to the form's parent
        contactForm.parentElement.style.position = 'relative';
        contactForm.parentElement.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});