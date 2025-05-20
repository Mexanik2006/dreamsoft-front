// 1. notifyLoadComplete funksiyasini eksport qilamiz
// Bu funksiya boshqa fayllarda (masalan, team.js va blog.js) ishlatilishi uchun ochiq bo‘ladi
export function notifyLoadComplete(section, success) {
    // 2. Yuklanish holatini saqlash uchun o‘zgaruvchi yaratamiz
    // window.loadingState brauzer xotirasida team va blog bo‘limlarining holatini saqlaydi
    window.loadingState = window.loadingState || {
        team: false, // Team bo‘limi hali yuklanmagan
        blog: false // Blog bo‘limi hali yuklanmagan
    };

    // 3. Berilgan bo‘limning yuklanish holatini yangilaymiz
    // Masalan, section = "team" bo‘lsa, team holatini true qilamiz
    window.loadingState[section] = true;

    // 4. Ikkala bo‘lim (team va blog) yuklanganligini tekshiramiz
    // Agar ikkalasi ham true bo‘lsa, demak ma’lumotlar to‘liq yuklangan
    if (window.loadingState.team && window.loadingState.blog) {
        // 5. Loader elementini HTML’dan topamiz
        // id="loader" bo‘lgan elementni qidiramiz (bu yuklash indikatori)
        const loader = document.getElementById('loader');

        // 6. Agar loader topilsa, uni yashiramiz
        if (loader) {
            // 7. loader-hidden klassini qo‘shamiz
            // Bu klass loaderni ko‘rinmas qiladi (CSS orqali yashiriladi)
            loader.classList.add('loader-hidden');

            // 8. Loaderni 300 millisekunddan so‘ng butunlay o‘chiramiz
            // Bu vaqt animatsiya yakunlanishi uchun beriladi
            setTimeout(() => {
                loader.remove(); // Loaderni HTML’dan olib tashlaymiz
            }, 300);
        }
    }
}