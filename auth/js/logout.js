// 1. Kerakli manzillarni yuklaymiz
// frontUrl saytning asosiy manzili (masalan, http://localhost:3000)
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
import { frontUrl, apiUrl } from '../../js/urls.js';

// 2. Xabar (toast) ko‘rsatish funksiyasi
// Muvaffaqiyat yoki xatolik xabarlarini 5 soniya davomida ko‘rsatadi
function showToast(message, type = 'success') {
    // 3. Toast konteynerini HTML’dan topamiz
    const toastContainer = document.querySelector('.toast-container');
    // 4. Agar konteyner topilmasa, oddiy alert ko‘rsatamiz
    if (!toastContainer) {
        console.warn('Toast container not found, falling back to alert'); // Xato haqida ogohlantirish
        alert(message); // Oddiy oyna xabari
        return;
    }

    // 5. Toast elementlarini topamiz
    const toast = document.getElementById('notificationToast'); // Toast konteyneri
    const toastTitle = document.getElementById('toast-title'); // Sarlavha
    const toastMessage = document.getElementById('toast-message'); // Xabar matni

    // 6. Sarlavha va uslubni sozlaymiz: muvaffaqiyat (yashil) yoki xatolik (qizil)
    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    // 7. Bootstrap Toast’ni ishga tushiramiz (5 soniya ko‘rinadi)
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// 8. Tizimdan chiqish funksiyasi
async function logout() {
    try {
        // 9. Serverga logout so‘rovini yuboramiz
        const res = await fetch(`${apiUrl}/api/logout`, {
            method: 'POST', // POST usuli bilan so‘rov
            credentials: 'include', // Cookie’lar (masalan, session) yuboriladi
        });

        // 10. Agar server javobi xato bo‘lsa, xatolik chiqaramiz
        if (!res.ok) {
            throw new Error('Server logout jarayonida xato');
        }

        // 11. localStorage’dan tokenni va boshqa ma’lumotlarni o‘chiramiz
        localStorage.removeItem('token'); // Tokenni o‘chirish
        localStorage.clear(); // Barcha localStorage’ni tozalash
        // 12. Tekshirish uchun konsolga tokenni chiqaramiz (null bo‘lishi kerak)
        console.log('localStorage after logout:', localStorage.getItem('token'));

        // 13. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Tizimdan muvaffaqiyatli chiqdingiz!', 'success');

        // 14. 1 sekunddan so‘ng asosiy sahifaga yo‘naltiramiz
        setTimeout(() => {
            window.location.href = `${frontUrl}`;
        }, 1000);
    } catch (error) {
        // 15. Xatolik bo‘lsa, konsolga yozamiz va xabar ko‘rsatamiz
        console.error('Logout error:', error);
        showToast('Chiqishda xato yuz berdi', 'error');
    }
}

// 16. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', () => {
    // 17. Logout havolasini HTML’dan topamiz
    const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
    // 18. Agar havola topilsa
    if (logoutLink) {
        // 19. Eski onclick atributini olib tashlaymiz
        logoutLink.removeAttribute('onclick');
        // 20. Yangi hodisa tinglovchisini qo‘shamiz
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault(); // Havolaning odatiy harakatini to‘xtatamiz
            logout(); // Logout funksiyasini chaqiramiz
        });
    } else {
        // 21. Agar havola topilmasa, konsolga ogohlantirish yozamiz
        console.warn('Logout link not found');
    }
});