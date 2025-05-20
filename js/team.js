// 1. Kerakli fayllarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun manzilni saqlaydi (masalan, http://localhost:5000)
import { apiUrl } from './urls.js';
// notifyLoadComplete jamoa ma’lumotlari yuklanganligini loader.js ga xabar qiladi
import { notifyLoadComplete } from './loader.js';

// 2. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Bu kod sahifa ochilganda jamoa a’zolarini serverdan olib, ekranga chiqaradi
document.addEventListener('DOMContentLoaded', async () => {
    // 3. Jamoa galereyasi uchun HTML’dagi elementni topamiz
    // id="team-gallery" bo‘lgan div’ni qidiramiz
    const gallery = document.getElementById('team-gallery');

    // 4. Serverdan ma’lumotlarni olishga harakat qilamiz
    try {
        // 5. fetch orqali serverga so‘rov yuboramiz
        // /api/team manzilidan jamoa a’zolarining ro‘yxatini olamiz
        const response = await fetch(`${apiUrl}/api/team`, {
            credentials: 'include', // Cookie’lar (masalan, token) bilan birga yuboriladi
            method: 'GET', // Ma’lumotlarni olish uchun GET usulidan foydalanamiz
            headers: {
                'Content-Type': 'application/json' // Ma’lumotlar JSON formatida
            }
        });

        // 6. Server javobi to‘g‘ri kelmasa, xato chiqaramiz
        if (!response.ok) throw new Error('Xatolik yuz berdi');

        // 7. Serverdan kelgan ma’lumotlarni JSON sifatida olamiz
        // Jamoa a’zolarining ro‘yxati members o‘zgaruvchisiga saqlanadi
        let members = await response.json();

        // 8. MongoDB ObjectId’dan yaratilgan sanani olish funksiyasi
        // ObjectId’ning birinchi 8 belgisi yordamida a’zo qachon qo‘shilganini aniqlaymiz
        const getDateFromObjectId = (id) => new Date(parseInt(id.substring(0, 8), 16) * 1000);

        // 9. Admin bo‘lmagan a’zolarni tanlaymiz
        // role maydoni “admin” bo‘lganlarni ro‘yxatdan chiqarib tashlaymiz
        members = members.filter(member => member.role !== 'admin');

        // 10. A’zolarni oxirgi qo‘shilganlarga qarab saralaymiz
        // ObjectId’dan olingan sana bo‘yicha yangidan eskiga saralaymiz
        members.sort((a, b) => getDateFromObjectId(b._id) - getDateFromObjectId(a._id));

        // 11. Faqat oxirgi 4 ta a’zoni olamiz
        // Ro‘yxatdan birinchi 4 ta elementni tanlaymiz
        members = members.slice(0, 4);

        // 12. Tanlangan a’zolarni ekranga chiqaramiz
        members.forEach((member, index) => {
            // 13. Har bir a’zo uchun yangi div elementi yaratamiz
            const div = document.createElement('div');

            // 14. Div’ga “employee-image” klassini qo‘shamiz
            // Bu klass a’zo rasmi va ma’lumotlari uchun uslub beradi
            div.className = 'employee-image';

            // 15. AOS animatsiyasi sozlamalarini qo‘shamiz
            // zoom-in-left animatsiyasi bilan a’zo chapdan kirib keladi
            div.setAttribute('data-aos', 'zoom-in-left');
            // Har bir a’zo uchun animatsiya boshlanish joyini o‘zgartiramiz
            div.setAttribute('data-aos-offset', `${300 + index * 100}`);
            // Animatsiya silliq bo‘lishi uchun easing sozlamasi
            div.setAttribute('data-aos-easing', 'ease-in-sine');

            // 16. A’zoning avatar rasmini olamiz
            // Agar avatar bo‘lmasa, standart rasm (default-avatar.jpg) ishlatiladi
            const avatarUrl = member.avatar || 'img/default-avatar.jpg';

            // 17. Div’ning fon rasmini a’zoning avatariga o‘rnatamiz
            div.style.backgroundImage = `url(${avatarUrl})`;

            // 18. Div ichiga a’zoning ismi va kasbini qo‘shamiz
            div.innerHTML = `
                <div class="employee-info">
                    <h1>${member.name}</h1>
                    <p>${member.hobbi}</p>
                </div>
            `;

            // 19. Yaratilgan div’ni galereyaga qo‘shamiz
            // A’zo ma’lumotlari team-gallery ichiga joylashadi
            gallery.appendChild(div);
        });

        // 20. Loader.js ga jamoa ma’lumotlari muvaffaqiyatli yuklanganini xabar qilamiz
        // team bo‘limi yuklandi, true qiymati muvaffaqiyatni bildiradi
        notifyLoadComplete('team', true);
    } catch (err) {
        // 21. Agar xato bo‘lsa, konsolga chiqaramiz va xato xabarini ko‘rsatamiz
        console.error('Teamni yuklashda xatolik:', err);

        // 22. Galereyaga xato xabarini yozamiz
        // Agar ma’lumotlar olinmasa, foydalanuvchiga xato xabari ko‘rsatiladi
        gallery.innerHTML = '<p>Jamoa ma’lumotlarini olishda xatolik yuz berdi.</p>';

        // 23. Loader.js ga jamoa ma’lumotlari yuklanmaganini xabar qilamiz
        // team bo‘limi yuklanmadi, false qiymati xatoni bildiradi
        notifyLoadComplete('team', false);
    }
});