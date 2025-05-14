// Xatolik yoki umumiy xabar ko‘rsatish uchun funksiya
function showError(message) {
    const errorDiv = document.getElementById('error-message'); // Sahifadagi maxsus xatolik oynasini olamiz
    errorDiv.textContent = message; // Undagi matnni o‘zgartiramiz
    errorDiv.style.display = 'block'; // Ko‘rinadigan qilamiz

    // 5 soniyadan so‘ng uni avtomatik ravishda yopamiz
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // Token — bu foydalanuvchining tizimga kirganligini bildiruvchi kalit
    const token = localStorage.getItem("token");

    // Agar token bo‘lmasa, demak foydalanuvchi login qilmagan
    if (!token) {
        window.location.href = 'https://dreamsoft-front.vercel.app/pages/error.html'; // Login sahifasiga yo‘naltiramiz
        return; // Qolgan kodni bajarishni to‘xtatamiz
    }

    try {
        // Serverdan foydalanuvchi ma’lumotlarini so‘raymiz
        const response = await axios.post('https://dreamsoft-backend.vercel.app/api/get', {}, {
            headers: {
                Authorization: `Bearer ${token}` // Tokenni yuboramiz
            },
            withCredentials: true // Cookie bilan birga yuboriladi
        });

        const user = response.data; // Javobdan foydalanuvchi ma’lumotlarini olamiz

        // Sahifadagi foydalanuvchi haqidagi maydonlarni to‘ldiramiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('profile-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('profile-login').textContent = `Login: ${user.login || 'Nomaʼlum'}`;
        document.getElementById('profile-email').textContent = `Email: ${user.email || 'Kiritilmagan'}`;
        document.getElementById('profile-role').textContent = user.role || 'Foydalanuvchi';

        // Tahrirlash maydoniga ismni joylaymiz
        document.getElementById('edit-name').value = user.name || '';

    } catch (error) {
        // Xatolik yuz bersa, foydalanuvchiga xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Foydalanuvchi maʼlumotlarini olishda xatolik yuz berdi');

        // Agar sessiya tugagan bo‘lsa
        if (error.response && error.response.status === 401) {
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            localStorage.clear();
            window.location.href = 'https://dreamsoft-front.vercel.app';
        }
    }
});

// "Saqlash" tugmasi bosilganda profilni yangilash
document.getElementById('save-profile').addEventListener('click', async () => {
    const token = localStorage.getItem("token"); // Tokenni olish

    // Agar foydalanuvchi tizimga kirmagan bo‘lsa
    if (!token) {
        window.location.href = 'https://dreamsoft-front.vercel.app/pages/error.html';
        return;
    }

    // Yangi ismni input maydonidan olamiz
    const name = document.getElementById('edit-name').value.trim();

    // Agar ism bo‘sh bo‘lsa, xatolik ko‘rsatamiz
    if (!name) {
        showError('Ism kiritilishi shart');
        return;
    }

    try {
        // Serverga yangilangan ismni yuboramiz
        const response = await axios.post('https://dreamsoft-backend.vercel.app/api/update', { name }, {
            headers: {
                Authorization: `Bearer ${token}` // Tokenni yuboramiz
            },
            withCredentials: true
        });

        const user = response.data.user; // Yangilangan foydalanuvchini olamiz

        // Ekrandagi ma’lumotlarni yangilaymiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('profile-name').textContent = user.name || 'Foydalanuvchi';
        document.getElementById('edit-name').value = user.name || '';

        // Xabar ko‘rsatamiz (xuddi xatolik funksiyasidan foydalanamiz)
        showError('Profil muvaffaqiyatli yangilandi');
    } catch (error) {
        // Xatolik bo‘lsa, foydalanuvchiga xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Foydalanuvchini yangilashda xatolik yuz berdi');
    }
});
