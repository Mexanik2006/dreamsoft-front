// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. Xabar (toast) ko‘rsatish funksiyasi
// Muvaffaqiyat yoki xatolik xabarlarini 5 soniya davomida ko‘rsatadi
function showToast(message, type = 'success') {
    // 3. Toast elementlarini HTML’dan topamiz
    const toast = document.getElementById('notificationToast'); // Toast konteyneri
    const toastTitle = document.getElementById('toast-title'); // Sarlavha
    const toastMessage = document.getElementById('toast-message'); // Xabar matni

    // 4. Sarlavha va uslubni sozlaymiz: muvaffaqiyat (yashil) yoki xatolik (qizil)
    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    // 5. Bootstrap Toast’ni ishga tushiramiz (5 soniya ko‘rinadi)
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// 6. Xatolik xabarini ko‘rsatish funksiyasi
// Xatolik xabarini div’da 5 soniya ko‘rsatadi
function showError(message) {
    // 7. Xabar ko‘rsatiladigan div’ni topamiz
    const errorDiv = document.getElementById('error-message');
    // 8. Xabar matnini yozamiz
    errorDiv.textContent = message;
    // 9. Div’ni ko‘rinadigan qilamiz
    errorDiv.classList.add('active');
    // 10. 5 soniyadan so‘ng yashiramiz
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// 11. Xabarlarni sahifada ko‘rsatish funksiyasi
function renderMessages(messages, isAdmin) {
    // 12. Xabarlar grid’ini topamiz
    const messagesGrid = document.getElementById('messages-grid');
    // 13. Avvalgi ma’lumotlarni tozalaymiz
    messagesGrid.innerHTML = '';

    // 14. Agar xabarlar bo‘lmasa, bo‘sh xabar ko‘rsatamiz
    if (messages.length === 0) {
        messagesGrid.innerHTML = '<p class="text-center" style="grid-column: 1 / -1; color: #6B7280;">Hozircha xabarlar yo‘q.</p>';
        return;
    }

    // 15. Har bir xabar uchun karta yaratamiz
    messages.forEach((message, index) => {
        // 16. Yangi karta div’ini yaratamiz
        const card = document.createElement('div');
        card.className = 'message-card';
        // 17. AOS animatsiyasini qo‘shamiz
        card.setAttribute('data-aos', 'zoom-in');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        // 18. Xabar matnini qisqartiramiz (100 belgidan uzun bo‘lsa)
        const truncatedMessage = message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message;

        // 19. Karta ichidagi HTML’ni joylashtiramiz
        card.innerHTML = `
            <h3>${message.name || 'Noma’lum'}</h3> <!-- Xabar yuboruvchi nomi -->
            <p><strong>Email:</strong> <a href="mailto:${message.email || ''}" class="email">${message.email || 'Yo‘q'}</a></p> <!-- Email -->
            <p><strong>Xabar:</strong> ${truncatedMessage}</p> <!-- Qisqartirilgan xabar matni -->
            <p class="date">${message.createdAt ? new Date(message.createdAt).toLocaleString() : 'Yo‘q'}</p> <!-- Yuborilgan sana -->
            <div class="actions">
                <button class="view-btn" data-bs-toggle="modal" data-bs-target="#viewMessageModal"
                    data-id="${message._id}" data-name="${message.name || ''}" data-email="${message.email || ''}"
                    data-message="${message.message || ''}" data-date="${message.createdAt || ''}">
                    View Details
                </button> <!-- Batafsil ko‘rish tugmasi -->
                ${isAdmin ? `
                    <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteMessageModal"
                        data-id="${message._id}">Delete</button>
                ` : ''} <!-- Admin uchun o‘chirish tugmasi -->
            </div>
        `;

        // 20. Kartani grid’ga qo‘shamiz
        messagesGrid.appendChild(card);
    });

    // 21. AOS animatsiyalarini yangilaymiz
    AOS.refresh();
}

// 22. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // 23. Foydalanuvchi tokenini olamiz
    const token = localStorage.getItem('token');

    // 24. Agar token bo‘lmasa, login sahifasiga yo‘naltiramiz
    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/login.html`;
        return;
    }

    try {
        // 25. Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 26. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = userResponse.data;
        // 27. Sarlavhadagi foydalanuvchi nomini ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // 28. Foydalanuvchi admin ekanligini tekshiramiz
        const isAdmin = user.role === 'admin';

        // 29. Agar admin bo‘lmasa, dashboard sahifasiga yo‘naltiramiz
        if (!isAdmin) {
            showError('Faqat adminlar xabarlarni ko‘rishi mumkin');
            window.location.href = `${frontUrl}/pages/dashboard.html`;
            return;
        }

        // 30. Xabarlarni serverdan olamiz
        const messagesResponse = await axios.get(`${apiUrl}/api/messages`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 31. Xabarlarni sahifada ko‘rsatamiz
        renderMessages(messagesResponse.data, isAdmin);
    } catch (error) {
        // 32. Xatolik bo‘lsa, konsolga yozamiz va xabar ko‘rsatamiz
        console.error('Error fetching messages:', error);
        const errorMessage = error.response?.data?.error || 'Xabarlarni olishda xato yuz berdi';
        showError(errorMessage);
        // 33. 401 xatosi bo‘lsa, token eskirgan
        if (error.response?.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}/auth/pages/login.html`;
        } else if (error.response?.status === 403) {
            // 34. 403 xatosi bo‘lsa, admin emasligini bildiradi
            showError('Faqat adminlar xabarlarni ko‘rishi mumkin');
            window.location.href = `${frontUrl}/pages/dashboard.html`;
        }
    }
});

// 35. Batafsil ko‘rish modalini to‘ldirish
document.getElementById('messages-grid')?.addEventListener('click', (e) => {
    // 36. “View Details” tugmasi bosilsa
    if (e.target.classList.contains('view-btn')) {
        // 37. Tugmadan ma’lumotlarni olamiz
        const button = e.target;
        // 38. Modal maydonlarini to‘ldiramiz
        document.getElementById('view-name').textContent = button.dataset.name || 'Noma’lum';
        document.getElementById('view-email').textContent = button.dataset.email || 'Yo‘q';
        document.getElementById('view-email').href = `mailto:${button.dataset.email || ''}`;
        document.getElementById('view-message').textContent = button.dataset.message || 'Yo‘q';
        document.getElementById('view-date').textContent = button.dataset.date
            ? new Date(button.dataset.date).toLocaleString()
            : 'Yo‘q';
    }
});

// 39. O‘chirish modalini to‘ldirish
document.getElementById('messages-grid')?.addEventListener('click', (e) => {
    // 40. “Delete” tugmasi bosilsa
    if (e.target.classList.contains('delete-btn')) {
        // 41. Tugmadan xabar ID’sini olamiz
        const button = e.target;
        const messageId = button.dataset.id;
        // 42. Agar ID topilmasa, xabar ko‘rsatamiz
        if (!messageId) {
            showToast('Xabar ID topilmadi', 'error');
            return;
        }
        // 43. O‘chirish formasiga ID’ni joylashtiramiz
        document.getElementById('delete-message-id').value = messageId;
    }
});

// 44. Xabarni o‘chirish
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    // 45. Token va xabar ID’sini olamiz
    const token = localStorage.getItem('token');
    const messageId = document.getElementById('delete-message-id').value;
    // 46. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteMessageModal'));

    // 47. Agar token bo‘lmasa, login sahifasiga yo‘naltiramiz
    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/login.html`;
        return;
    }

    // 48. Agar xabar ID bo‘lmasa, xabar ko‘rsatamiz
    if (!messageId) {
        showToast('Xabar ID topilmadi', 'error');
        modal.hide();
        return;
    }

    try {
        // 49. Serverga xabarni o‘chirish so‘rovini yuboramiz
        const deleteResponse = await axios.delete(`${apiUrl}/api/messages/${messageId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 50. Server javobini konsolga yozamiz
        console.log('Delete response:', {
            status: deleteResponse.status,
            data: deleteResponse.data
        });

        // 51. Agar o‘chirish muvaffaqiyatli bo‘lsa (status 200 yoki 204)
        if (deleteResponse.status === 200 || deleteResponse.status === 204) {
            // 52. Modalni yashiramiz
            modal.hide();
            // 53. Muvaffaqiyat xabarini ko‘rsatamiz
            showToast('Xabar muvaffaqiyatli o‘chirildi', 'success');

            // 54. Yangilangan xabarlar ro‘yxatini serverdan olamiz
            try {
                const messagesResponse = await axios.get(`${apiUrl}/api/messages`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                // 55. Sahifani yangilangan xabarlar bilan to‘ldiramiz
                renderMessages(messagesResponse.data, true);
            } catch (refreshError) {
                // 56. Yangilashda xatolik bo‘lsa, xabar ko‘rsatamiz
                console.error('Error refreshing messages:', refreshError);
                showToast('Xabarlar ro‘yxatini yangilashda xato', 'error');
            }
        } else {
            // 57. Kutilmagan status bo‘lsa, xatolik chiqaramiz
            throw new Error('Unexpected response status: ' + deleteResponse.status);
        }
    } catch (error) {
        // 58. Xatolik bo‘lsa, konsolga yozamiz va xabar ko‘rsatamiz
        console.error('Error deleting message:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        const errorMessage = error.response?.data?.error || 'Xabarni o‘chirishda xato yuz berdi';
        showToast(errorMessage, 'error');

        // 59. Xatolik holatlarini boshqaramiz
        if (error.response) {
            if (error.response.status === 401) {
                // 60. 401 xatosi: token eskirgan
                showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
                localStorage.clear();
                window.location.href = `${frontUrl}/auth/pages/login.html`;
            } else if (error.response.status === 403) {
                // 61. 403 xatosi: admin emas
                showToast('Faqat adminlar xabarni o‘chirishi mumkin', 'error');
            } else if (error.response.status === 404) {
                // 62. 404 xatosi: xabar topilmadi
                showToast('Xabar topilmadi', 'error');
                modal.hide();
            }
        }
    }
});