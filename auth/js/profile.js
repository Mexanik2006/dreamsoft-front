// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. Xatolik yoki muvaffaqiyat xabarini ko‘rsatish uchun funksiya
// Bu funksiya sahifada xabar ko‘rsatadi va 5 soniyadan so‘ng yashiradi
function showError(message) {
    // 3. Xabar ko‘rsatiladigan div’ni HTML’dan topamiz
    const errorDiv = document.getElementById('error-message');
    // 4. Div’ga berilgan xabar matnini yozamiz
    errorDiv.textContent = message;
    // 5. Div’ni ko‘rinadigan qilamiz
    errorDiv.style.display = 'block';
    // 6. 5 soniyadan so‘ng div’ni yashiramiz
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// 7. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Foydalanuvchi ma’lumotlarini oladi va sahifada ko‘rsatadi
document.addEventListener('DOMContentLoaded', async () => {
    // 8. Foydalanuvchi tizimga kirganligini tekshiramiz
    // localStorage’dan tokenni olamiz (token tizimga kirish kaliti)
    const token = localStorage.getItem("token");

    // 9. Agar token bo‘lmasa, foydalanuvchi tizimga kirmagan
    if (!token) {
        // 10. Foydalanuvchini xato sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/error.html`;
        // 11. Keyingi kodni bajarishni to‘xtatamiz
        return;
    }

    // 12. Token mavjud bo‘lsa, serverdan foydalanuvchi ma’lumotlarini so‘raymiz
    try {
        // 13. axios orqali serverga POST so‘rovi yuboramiz
        // /api/get manzilidan foydalanuvchi ma’lumotlarini olamiz
        const response = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: {
                // 14. Tokenni so‘rovga qo‘shamiz
                Authorization: `Bearer ${token}`
            },
            withCredentials: true // Cookie’lar bilan birga yuboriladi
        });

        // 15. Server javobini konsolga chiqaramiz (tekshirish uchun)
        console.log(response.data);
        // 16. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = response.data;

        // 17. Sahifadagi elementlarni foydalanuvchi ma’lumotlari bilan to‘ldiramiz
        // Profil rasmi: agar avatar bo‘lmasa, standart rasm ishlatiladi
        document.getElementById('profile-img').src = user.avatar || '../../img/user-default.png';
        // Sarlavhadagi foydalanuvchi ismi
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // Profil ismi
        document.getElementById('profile-name').textContent = user.name || 'Foydalanuvchi';
        // Login maydoni
        document.getElementById('profile-login').textContent = `Login: ${user.login || 'Nomaʼlum'}`;
        // Email maydoni
        document.getElementById('profile-email').textContent = `Email: ${user.email || 'Kiritilmagan'}`;
        // Rol maydoni
        document.getElementById('profile-role').textContent = user.role || 'Foydalanuvchi';
        // Tahrirlash maydoniga ismni joylaymiz
        document.getElementById('edit-name').value = user.name || '';

    } catch (error) {
        // 18. Agar so‘rovda xato bo‘lsa, foydalanuvchiga xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Foydalanuvchi maʼlumotlarini olishda xatolik yuz berdi');

        // 19. Xato 401 bo‘lsa, token eskirgan yoki noto‘g‘ri
        if (error.response && error.response.status === 401) {
            // 20. Foydalanuvchiga ogohlantirish ko‘rsatamiz
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            // 21. localStorage’dagi barcha ma’lumotlarni tozalaymiz
            localStorage.clear();
            // 22. Foydalanuvchini asosiy sahifaga yo‘naltiramiz
            window.location.href = `${frontUrl}`;
        }
    }
});

// 23. “Saqlash” tugmasiga hodisa qo‘shamiz
// Profil ma’lumotlarini yangilash uchun ishlatiladi
document.getElementById('save-profile').addEventListener('click', async () => {
    // 24. Foydalanuvchi tizimga kirganligini tekshiramiz
    const token = localStorage.getItem("token");

    // 25. Agar token bo‘lmasa, foydalanuvchi tizimga kirmagan
    if (!token) {
        // 26. Foydalanuvchini xato sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 27. Yangi ismni tahrirlash maydonidan olamiz
    const name = document.getElementById('edit-name').value.trim();

    // 28. Agar ism bo‘sh bo‘lsa, xatolik ko‘rsatamiz
    if (!name) {
        showError('Ism kiritilishi shart');
        return;
    }

    // 29. Serverga yangilangan ma’lumotlarni yuboramiz
    try {
        // 30. axios orqali serverga POST so‘rovi yuboramiz
        // /api/update manziliga yangi ismni yuboramiz
        const response = await axios.post(`${apiUrl}/api/update`, { name }, {
            headers: {
                // 31. Tokenni so‘rovga qo‘shamiz
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        // 32. Serverdan yangilangan foydalanuvchi ma’lumotlarini olamiz
        const user = response.data.user;

        // 33. Ekrandagi ma’lumotlarni yangilaymiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('profile-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('edit-name').value = user.name || '';

        // 34. Muvaffaqiyat xabarini ko‘rsatamiz
        showError('Profil muvaffaqiyatli yangilandi');
    } catch (error) {
        // 35. Xatolik bo‘lsa, foydalanuvchiga xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Foydalanuvchini yangilashda xatolik yuz berdi');
    }
});