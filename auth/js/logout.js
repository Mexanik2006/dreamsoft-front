import { frontUrl, apiUrl } from '../../js/urls.js';

// Toast notification function
function showToast(message, type = 'success') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        console.warn('Toast container not found, falling back to alert');
        alert(message);
        return;
    }

    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// Logout function
async function logout() {
    try {
        // Backend logout so'rovi
        const res = await fetch(`${apiUrl}/api/logout`, {
            method: 'POST',
            credentials: 'include', // cookie yuborish uchun muhim
        });

        if (!res.ok) {
            throw new Error('Server logout jarayonida xato');
        }

        // localStorage tozalash
        localStorage.removeItem('token');
        localStorage.clear();
        console.log('localStorage after logout:', localStorage.getItem('token')); // null bo'lishi kerak

        // Toast ko'rsatish
        showToast('Tizimdan muvaffaqiyatli chiqdingiz!', 'success');

        // 1 sekunddan keyin login sahifaga o'tish
        setTimeout(() => {
            window.location.href = `${frontUrl}`;
        }, 1000);
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Chiqishda xato yuz berdi', 'error');
    }
}

// Logout tugmasiga listener ulash
document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
    if (logoutLink) {
        logoutLink.removeAttribute('onclick');
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        console.warn('Logout link not found');
    }
});
