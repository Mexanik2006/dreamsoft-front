// Xato xabarini ko‘rsatish funksiyasi
function showError(message) {
    // Xato xabarini ko‘rsatadigan elementni ID orqali topamiz (ID: error-message)
    const errorDiv = document.getElementById('error-message');
    // Xabarni elementga yozamiz
    errorDiv.textContent = message;
    // Xato xabarini ko‘rinadigan qilamiz (CSS class qo‘shamiz)
    errorDiv.classList.add('active');
    // 5 soniyadan keyin xabarni yashiramiz
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

// Kontakt xabarlarini jadvalda ko‘rsatish funksiyasi
function renderMessages(messages) {
    // Xabarlar joylashadigan jadval tanasini topamiz (ID: messages-body)
    const messagesBody = document.getElementById('messages-body');
    // Avvalgi kontentni tozalaymiz
    messagesBody.innerHTML = '';

    // Agar xabarlar bo‘lmasa, xato xabarini ko‘rsatamiz
    if (messages.length === 0) {
        showError('Hech qanday kontakt xabari topilmadi.');
        return;
    }

    // Har bir xabar uchun jadval qatorini yaratamiz
    messages.forEach((message, index) => {
        // Yangi qator (tr) yaratamiz
        const row = document.createElement('tr');
        // Animatsiya qo‘shamiz (AOS kutubxonasi)
        row.setAttribute('data-aos', 'fade-up');
        row.setAttribute('data-aos-delay', `${index * 100}`);
        // Qator ichidagi ma’lumotlarni yozamiz
        row.innerHTML = `
            <td>${message.name}</td>
            <td>${message.email}</td>
            <td>${message.message}</td>
            <td>${new Date(message.createdAt).toLocaleString()}</td>
        `;
        // Qatorni jadvalga qo‘shamiz
        messagesBody.appendChild(row);
    });
}

// Sahifa yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // LocalStorage’dan tokenni olamiz (token foydalanuvchining kirganligini tasdiqlaydi)
    const token = localStorage.getItem('token');

    // Agar token bo‘lmasa, login sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = 'http://127.0.0.1:5500/pages/error.html';
        return;
    }

    try {
        // Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post('http://localhost:2021/api/get', {}, {
            headers: {
                // Tokenni so‘rov bilan yuboramiz
                Authorization: `Bearer ${token}`
            },
            withCredentials: true // Cookie’lar bilan ishlash uchun
        });

        // Serverdan kelgan foydalanuvchi ma’lumotlarini olamiz
        const user = userResponse.data;

        // Sahifa sarlavhasidagi foydalanuvchi nomini yangilaymiz (ID: header-user-name)
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';

        // Agar foydalanuvchi admin bo‘lmasa, xabar ko‘rsatamiz
        if (user.role !== 'admin') {
            showError('Faqat adminlar kontakt xabarlarini ko‘ra oladi.');
            return;
        }

        // Kontakt xabarlarini serverdan olamiz
        const messagesResponse = await axios.get('http://localhost:2021/api/contacts', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        // Xabarlarni jadvalda ko‘rsatamiz
        renderMessages(messagesResponse.data);
    } catch (error) {
        // Xato bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Xabarlarni olishda xato');
        // Agar sessiya tugagan bo‘lsa, login sahifasiga yo‘naltiramiz
        if (error.response && error.response.status === 401) {
            alert('Sessiya tugadi. Qayta kiring.');
            window.location.href = '../auth/login/Login.html';
        } else if (error.response && error.response.status === 403) {
            // Agar admin emas bo‘lsa, xabar ko‘rsatamiz
            showError('Faqat adminlar kontakt xabarlarini ko‘ra oladi.');
        }
    }
});