import { apiUrl, frontUrl } from '../../js/urls.js';

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// Error message function
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// Render messages
function renderMessages(messages, isAdmin) {
    const messagesGrid = document.getElementById('messages-grid');
    messagesGrid.innerHTML = '';

    if (messages.length === 0) {
        messagesGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #6B7280;">Hozircha xabarlar yo‘q.</p>';
        return;
    }

    messages.forEach((message, index) => {
        const card = document.createElement('div');
        card.className = 'message-card';
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        const truncatedMessage = message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message;

        card.innerHTML = `
            <h3>${message.name || 'Noma’lum'}</h3>
            <p><strong>Email:</strong> <a href="mailto:${message.email || ''}" class="email">${message.email || 'Yo‘q'}</a></p>
            <p><strong>Xabar:</strong> ${truncatedMessage}</p>
            <p class="date">${message.createdAt ? new Date(message.createdAt).toLocaleString() : 'Yo‘q'}</p>
            <div class="actions">
                <button class="view-btn" data-bs-toggle="modal" data-bs-target="#viewMessageModal"
                    data-id="${message._id}" data-name="${message.name || ''}" data-email="${message.email || ''}"
                    data-message="${message.message || ''}" data-date="${message.createdAt || ''}">
                    View Details
                </button>
                ${isAdmin ? `
                    <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteMessageModal"
                        data-id="${message._id}">Delete</button>
                ` : ''}
            </div>
        `;

        messagesGrid.appendChild(card);
    });

    AOS.refresh();
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/pages/login.html`;
        return;
    }

    try {
        // Fetch user info
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const user = userResponse.data;
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        const isAdmin = user.role === 'admin';

        if (!isAdmin) {
            showError('Faqat adminlar xabarlarni ko‘rishi mumkin');
            window.location.href = `${frontUrl}/pages/dashboard.html`;
            return;
        }

        // Fetch messages
        const messagesResponse = await axios.get(`${apiUrl}/api/messages`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        renderMessages(messagesResponse.data, isAdmin);
    } catch (error) {
        console.error('Error fetching messages:', error);
        const errorMessage = error.response?.data?.error || 'Xabarlarni olishda xato yuz berdi';
        showError(errorMessage);
        if (error.response?.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}/pages/login.html`;
        } else if (error.response?.status === 403) {
            showError('Faqat adminlar xabarlarni ko‘rishi mumkin');
            window.location.href = `${frontUrl}/pages/dashboard.html`;
        }
    }
});

// Populate view modal
document.getElementById('messages-grid')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const button = e.target;
        document.getElementById('view-name').textContent = button.dataset.name || 'Noma’lum';
        document.getElementById('view-email').textContent = button.dataset.email || 'Yo‘q';
        document.getElementById('view-email').href = `mailto:${button.dataset.email || ''}`;
        document.getElementById('view-message').textContent = button.dataset.message || 'Yo‘q';
        document.getElementById('view-date').textContent = button.dataset.date
            ? new Date(button.dataset.date).toLocaleString()
            : 'Yo‘q';
    }
});

// Populate delete modal
document.getElementById('messages-grid')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const button = e.target;
        const messageId = button.dataset.id;
        if (!messageId) {
            showToast('Xabar ID topilmadi', 'error');
            return;
        }
        document.getElementById('delete-message-id').value = messageId;
    }
});

// Delete message
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const messageId = document.getElementById('delete-message-id').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteMessageModal'));

    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/pages/login.html`;
        return;
    }

    if (!messageId) {
        showToast('Xabar ID topilmadi', 'error');
        modal.hide();
        return;
    }

    try {
        // Send delete request
        const deleteResponse = await axios.delete(`${apiUrl}/api/messages/${messageId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        console.log('Delete response:', {
            status: deleteResponse.status,
            data: deleteResponse.data
        });

        // Check if deletion was successful (status 200 or 204)
        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
            // Hide modal
            modal.hide();
            showToast('Xabar muvaffaqiyatli o‘chirildi', 'success');

            // Fetch updated messages
            try {
                const messagesResponse = await axios.get(`${apiUrl}/api/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                renderMessages(messagesResponse.data, true);
            } catch (refreshError) {
                console.error('Error refreshing messages:', refreshError);
                showToast('Xabarlar ro‘yxatini yangilashda xato', 'error');
            }
        } else {
            throw new Error('Unexpected response status: ' + deleteResponse.status);
        }
    } catch (error) {
        console.error('Error deleting message:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        const errorMessage = error.response?.data?.error || 'Xabarni o‘chirishda xato yuz berdi';
        showToast(errorMessage, 'error');

        if (error.response) {
            if (error.response.status === 401) {
                showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
                localStorage.clear();
                window.location.href = `${frontUrl}/pages/login.html`;
            } else if (error.response.status === 403) {
                showToast('Faqat adminlar xabarni o‘chirishi mumkin', 'error');
            } else if (error.response.status === 404) {
                showToast('Xabar topilmadi', 'error');
                modal.hide();
            }
        }
    }
});