// 1. Kerakli ma’lumotlarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun manzilni saqlaydi (masalan, http://localhost:5000)
import { apiUrl } from './urls.js';

// 2. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Bu kod sahifa ochilganda kontakt formasini topadi va undagi harakatlarni boshqaradi
document.addEventListener('DOMContentLoaded', () => {
    // 3. Kontakt formasini HTML’dan topamiz
    // .middle-content ichidagi formani qidiramiz
    const contactForm = document.querySelector('.middle-content form');

    // 4. Agar forma topilmasa, xato xabarini konsolga chiqaramiz va kodni to‘xtatamiz
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    // 5. Forma yuborilganda (submit) ishlaydigan kod
    // Foydalanuvchi “Yuborish” tugmasini bosganda bu kod ishga tushadi
    contactForm.addEventListener('submit', async (e) => {
        // 6. Sahifaning yangilanishini oldini olamiz
        // Bu formaning odatiy harakatini to‘xtatadi (sahifa qayta yuklanmaydi)
        e.preventDefault();

        // 7. Forma maydonlaridagi ma’lumotlarni olamiz
        // Foydalanuvchi kiritgan ism, email va xabarni olamiz va bo‘sh joylarni olib tashlaymiz
        const name = contactForm.querySelector('input[placeholder="Name"]').value.trim();
        const email = contactForm.querySelector('input[placeholder="Email"]').value.trim();
        const message = contactForm.querySelector('textarea[placeholder="Message"]').value.trim();

        // 8. Ma’lumotlarni tekshiramiz
        // Agar ism, email yoki xabar kiritilmagan bo‘lsa, xato xabari ko‘rsatamiz
        if (!name || !email || !message) {
            showMessage('Iltimos, barcha maydonlarni to‘ldiring', 'error');
            return;
        }

        // 9. Emailning to‘g‘ri ekanligini tekshiramiz
        // Email formati to‘g‘ri bo‘lishi uchun maxsus qoida (regex) ishlatamiz
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Iltimos, to‘g‘ri email manzil kiriting', 'error');
            return;
        }

        // 10. Serverga ma’lumotlarni yuboramiz
        try {
            // 11. axios orqali serverga POST so‘rovi yuboramiz
            // /api/contact manziliga ism, email va xabarni yuboramiz
            const response = await axios.post(`${apiUrl}/api/contact`, {
                name, // Foydalanuvchi ismi
                email, // Foydalanuvchi emaili
                message // Xabar matni
            }, {
                headers: {
                    'Content-Type': 'application/json' // Ma’lumotlar JSON formatida
                },
                withCredentials: true // Cookie’lar (masalan, token) bilan birga yuboriladi
            });

            // 12. Muvaffaqiyatli xabarni ko‘rsatamiz va formani tozalaymiz
            showMessage(response.data.message, 'success');
            contactForm.reset(); // Forma maydonlarini bo‘shatamiz
        } catch (error) {
            // 13. Agar xato bo‘lsa, konsolga chiqaramiz va xato xabarini ko‘rsatamiz
            console.error('Error submitting contact form:', error);
            // Serverdan kelgan xato xabari yoki umumiy xato xabarini ko‘rsatamiz
            const errorMsg = error.response?.data?.error || 'Xabarni yuborishda xato. Iltimos, qayta urinib ko‘ring.';
            showMessage(errorMsg, 'error');
        }
    });

    // 14. Xabar ko‘rsatish funksiyasi
    // Bu funksiya muvaffaqiyat yoki xato xabarlarini ekranda ko‘rsatadi
    function showMessage(message, type) {
        // 15. Avvalgi xabarlarni o‘chiramiz
        // Agar oldin xabar bo‘lsa, uni HTML’dan olib tashlaymiz
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 16. Yangi xabar elementi yaratamiz
        // div elementi yaratib, unga xabar matni va uslub qo‘yamiz
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`; // Xabar turi (success yoki error)
        messageDiv.textContent = message; // Xabar matni
        // Xabar uslubi (rang, joylashuv, shrift va boshqalar)
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
            background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        `;

        // 17. Xabarni forma joylashgan joyga qo‘shamiz
        // Forma ota-elementiga xabarni qo‘shish uchun joylashuvni sozlaymiz
        contactForm.parentElement.style.position = 'relative';
        contactForm.parentElement.appendChild(messageDiv);

        // 18. Xabarni 5 soniyadan so‘ng o‘chiramiz
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});