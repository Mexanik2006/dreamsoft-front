import { apiUrl, frontUrl } from '../../js/urls.js';

// Sahifa to‘liq yuklangandan so‘ng ishlaydigan asosiy funksiya
document.addEventListener('DOMContentLoaded', async () => {

    // localStorage'dan tokenni olamiz.
    // Token — bu foydalanuvchining tizimga kirganini bildiradigan maxsus kalit.
    const token = localStorage.getItem('token');
    // Agar token mavjud bo‘lmasa, foydalanuvchi tizimga kirmagan bo‘ladi
    if (!token) {
        // Foydalanuvchiga ogohlantirish chiqaramiz
        // Uni login sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/error.html`;
        // Keyingi kodni bajarishni to‘xtatamiz
        return;
    }

    // Agar token mavjud bo‘lsa, serverdan foydalanuvchi ma’lumotlarini so‘raymiz
    try {
        // `axios` yordamida POST so‘rov yuboramiz
        const response = await axios.post(
            `${apiUrl}/api/get`, // So‘rov yuboriladigan server manzili
            {}, // So‘rovga hech qanday qo‘shimcha ma’lumot yubormaymiz
            {
                headers: {
                    // So‘rovga tokenni biriktiramiz — bu autentifikatsiya uchun kerak
                    Authorization: `Bearer ${token}`
                },
                // Cookie'larni ham birga yuborish uchun
                withCredentials: true
            }
        );
        // Serverdan foydalanuvchining ma’lumotlari qaytadi
        const user = response.data;

        // HTML sahifasida foydalanuvchi nomini chiqarish
        // Agar foydalanuvchi ismi bo‘lmasa, "Foydalanuvchi" deb ko‘rsatiladi
        document.getElementById('user-name').textContent = user.name || 'Foydalanuvchi';

    } catch (error) {
        // Agar so‘rov yuborishda yoki javobni olishda xatolik bo‘lsa, shu yerda ushlanadi

        // Foydalanuvchi nomi o‘rniga "Xatolik" deb yoziladi
        document.getElementById('user-name').textContent = 'Xatolik';

        // Agar xatolik 401 bo‘lsa — bu autentifikatsiya muammosi (token eskirgan yoki noto‘g‘ri)
        if (error.response && error.response.status === 401) {
            // Ogohlantirish ko‘rsatamiz
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            localStorage.clear();
            window.location.href = `${frontUrl}`;
        }
    }
});
