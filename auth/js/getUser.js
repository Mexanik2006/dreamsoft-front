// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Bu kod foydalanuvchi tizimga kirganligini tekshiradi va ma’lumotlarini ko‘rsatadi
document.addEventListener('DOMContentLoaded', async () => {

    // 3. Foydalanuvchi tizimga kirganligini tekshiramiz
    // localStorage’dan tokenni olamiz (token tizimga kirish kaliti)
    const token = localStorage.getItem('token');

    // 4. Agar token bo‘lmasa, foydalanuvchi tizimga kirmagan
    if (!token) {
        // 5. Foydalanuvchini xato sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/error.html`;
        // 6. Keyingi kodni bajarishni to‘xtatamiz
        return;
    }

    // 7. Token mavjud bo‘lsa, serverdan foydalanuvchi ma’lumotlarini so‘raymiz
    try {
        // 8. axios orqali serverga POST so‘rovi yuboramiz
        // /api/get manzilidan foydalanuvchi ma’lumotlarini olamiz
        const response = await axios.post(
            `${apiUrl}/api/get`, // Server manzili
            {}, // Hech qanday qo‘shimcha ma’lumot yubormaymiz
            {
                headers: {
                    // 9. Tokenni so‘rovga qo‘shamiz
                    // Authorization sarlavhasi orqali token yuboriladi
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true // Cookie’lar (masalan, token) bilan birga yuboriladi
            }
        );

        // 10. Serverdan kelgan foydalanuvchi ma’lumotlarini saqlaymiz
        const user = response.data;

        // 11. Foydalanuvchi nomini sahifada ko‘rsatamiz
        // Agar ism bo‘lmasa, “Foydalanuvchi” deb yoziladi
        document.getElementById('user-name').textContent = user.name || 'Foydalanuvchi';

    } catch (error) {
        // 12. Agar so‘rovda xato bo‘lsa, bu yerda ushlanadi
        // Masalan, token noto‘g‘ri yoki server javob bermasa

        // 13. Foydalanuvchi nomi o‘rniga “Xatolik” deb yozamiz
        document.getElementById('user-name').textContent = 'Xatolik';

        // 14. Xato 401 bo‘lsa, token eskirgan yoki noto‘g‘ri
        if (error.response && error.response.status === 401) {
            // 15. Foydalanuvchiga ogohlantirish ko‘rsatamiz
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            // 16. localStorage’dagi barcha ma’lumotlarni tozalaymiz
            localStorage.clear();
            // 17. Foydalanuvchini asosiy sahifaga yo‘naltiramiz
            window.location.href = `${frontUrl}`;
        }
    }
});