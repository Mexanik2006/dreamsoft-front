// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. HTML’dan forma va boshqa elementlarni topamiz
// id="loginForm" bo‘lgan formani, xato xabari div’ini, tugmani va toastni qidiramiz
const form = document.getElementById('loginForm'); // Tizimga kirish formasi
const errorDiv = document.getElementById('error'); // Xato xabarini ko‘rsatadigan div
const submitBtn = document.getElementById('submitBtn'); // “Kirish” tugmasi
const successToast = document.getElementById('successToast'); // Muvaffaqiyat xabari uchun toast

// 3. Bootstrap Toast’ni sozlaymiz
// successToast 1 soniya (1000 ms) ko‘rinadi va keyin yashiriladi
const toast = new bootstrap.Toast(successToast, {
    delay: 1000 // Toast 1 soniya davomida ko‘rinadi
});

// 4. Formaga “submit” hodisasini qo‘shamiz
// Foydalanuvchi “Kirish” tugmasini bosganda bu kod ishga tushadi
form.addEventListener('submit', async (e) => {
    // 5. Sahifaning yangilanishini oldini olamiz
    // Forma yuborilganda sahifa qayta yuklanmaydi
    e.preventDefault();

    // 6. Avvalgi xato xabarini tozalaymiz
    // errorDiv ichidagi matnni bo‘sh qilamiz
    errorDiv.innerText = '';

    // 7. Yuklash indikatorini ko‘rsatamiz
    // Tugmani faolsizlantiramiz va unga yuklanish uslubini qo‘shamiz
    submitBtn.disabled = true; // Tugma bosilmaydigan holatga o‘tadi
    submitBtn.classList.add('btn-loading'); // Yuklanish animatsiyasi ko‘rinadi

    // 8. Forma maydonlaridagi ma’lumotlarni olamiz
    // Foydalanuvchi kiritgan login va parolni olamiz
    const login = document.getElementById('login').value; // Login maydonidagi matn
    const password = document.getElementById('password').value; // Parol maydonidagi matn

    // 9. Serverga ma’lumotlarni yuboramiz
    try {
        // 10. axios orqali serverga POST so‘rovi yuboramiz
        // /api/login manziliga login va parolni yuboramiz
        const response = await axios.post(`${apiUrl}/api/login`, {
            login, // Foydalanuvchi logini
            password // Foydalanuvchi paroli
        }, {
            withCredentials: true // Cookie’lar (masalan, token) bilan birga yuboriladi
        });

        // 11. Server javobidan tokenni saqlaymiz
        // Agar javobda token bo‘lsa, uni localStorage’ga saqlaymiz
        if (response.data) {
            localStorage.setItem('token', response.data.token); // Token brauzer xotirasiga yoziladi
        }

        // 12. Yuklash indikatorini yashiramiz
        // Tugmani qayta faollashtiramiz va yuklanish uslubini olib tashlaymiz
        submitBtn.disabled = false; // Tugma qayta bosiladigan holatga o‘tadi
        submitBtn.classList.remove('btn-loading'); // Yuklanish animatsiyasi olib tashlanadi

        // 13. Muvaffaqiyat xabarini ko‘rsatamiz
        // Bootstrap Toast orqali muvaffaqiyat xabari 1 soniya ko‘rinadi
        toast.show();

        // 14. Toast yashirilgandan so‘ng foydalanuvchini dashboard’ga yo‘naltiramiz
        // 1 soniya (toast delay’ga mos) kutib, dashboard sahifasiga o‘tamiz
        setTimeout(() => {
            window.location.href = `${frontUrl}/auth/pages/dashboard.html`; // Dashboard sahifasiga yo‘naltirish
        }, 1000); // 1000 ms = toastning ko‘rinish vaqti
    } catch (error) {
        // 15. Agar xato bo‘lsa, yuklash indikatorini yashiramiz
        // Tugmani qayta faollashtiramiz va yuklanish uslubini olib tashlaymiz
        submitBtn.disabled = false; // Tugma qayta bosiladigan holatga o‘tadi
        submitBtn.classList.remove('btn-loading'); // Yuklanish animatsiyasi olib tashlanadi

        // 16. Xato xabarini ko‘rsatamiz
        // Serverdan kelgan xato xabari bo‘lsa, uni ko‘rsatamiz, bo‘lmasa umumiy xato xabarini yozamiz
        if (error.response && error.response.data && error.response.data.error) {
            errorDiv.innerText = error.response.data.error; // Serverdan kelgan xato xabari
        } else {
            errorDiv.innerText = "Noma'lum xatolik!"; // Umumiy xato xabari
        }
    }
});