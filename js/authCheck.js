// 1. Kerakli faylni yuklaymiz
// frontUrl saytning asosiy manzilini saqlaydi (masalan, http://localhost:3000)
import { frontUrl } from './urls.js';

// 2. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Bu kod navigatsiya menyusini yangilaydi va foydalanuvchi holatiga qarab havola qo‘shadi
document.addEventListener("DOMContentLoaded", () => {
    // 3. Navigatsiya menyusini HTML’dan topamiz
    // .nav-links klassiga ega elementni qidiramiz (bu menyudagi havolalar ro‘yxati)
    const navLinks = document.querySelector(".nav-links");

    // 4. Eski “Login” havolasini topamiz va o‘chiramiz
    // navLinks ichidagi barcha <li> elementlarini ko‘rib chiqamiz
    const oldAuthLink = [...navLinks.children].find(li =>
        // Matni “Login” bo‘lgan <li> elementni qidiramiz
        li.textContent.trim() === "Login"
    );

    // 5. Agar eski “Login” havolasi topilsa, uni menyudan olib tashlaymiz
    if (oldAuthLink) oldAuthLink.remove();

    // 6. Foydalanuvchi tizimga kirganligini tekshiramiz
    // localStorage’dan tokenni olamiz (token tizimga kirish kaliti)
    const token = localStorage.getItem("token");

    // 7. Yangi <li> elementi yaratamiz
    // Bu element menyuga qo‘shiladigan yangi havola uchun ishlatiladi
    const authLi = document.createElement("li");

    // 8. Yangi <a> elementi yaratamiz
    // Bu havola foydalanuvchiga “Login” yoki “Dashboard” sahifasiga o‘tish imkonini beradi
    const authLink = document.createElement("a");

    // 9. Token mavjudligiga qarab havolani sozlaymiz
    if (token) {
        // 10. Agar token bo‘lsa, foydalanuvchi tizimga kirgan, shuning uchun Dashboard ko‘rsatamiz
        authLink.href = `${frontUrl}/auth/pages/dashboard.html`; // Dashboard sahifasiga havola
        authLink.textContent = "Dashboard"; // Havola matni “Dashboard” bo‘ladi
    } else {
        // 11. Agar token bo‘lmasa, foydalanuvchi tizimga kirmagan, shuning uchun Login ko‘rsatamiz
        authLink.href = `${frontUrl}/auth/login/Login.html`; // Login sahifasiga havola
        authLink.textContent = "Login"; // Havola matni “Login” bo‘ladi
    }

    // 12. <a> elementini <li> ichiga qo‘shamiz
    // Havola yangi <li> elementining ichiga joylashadi
    authLi.appendChild(authLink);

    // 13. Yangi <li> elementini navigatsiya menyusiga qo‘shamiz
    // authLi .nav-links ichiga qo‘shiladi va menyu yangilanadi
    navLinks.appendChild(authLi);
});