// 1. Kerakli fayllarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun manzilni saqlaydi (masalan, http://localhost:5000)
import { apiUrl } from './urls.js';
// notifyLoadComplete blog ma’lumotlari yuklanganligini loader.js ga xabar qiladi
import { notifyLoadComplete } from './loader.js';

// 2. Sahifa to‘liq yuklanganda ishga tushadigan kod
// Bu kod sahifa ochilganda blog postlarini serverdan olib, ekranga chiqaradi
document.addEventListener("DOMContentLoaded", async () => {
    // 3. Blog postlari uchun HTML’dagi elementni topamiz
    // .blog-posts klassiga ega div’ni qidiramiz
    const blogContainer = document.querySelector(".blog-posts");

    // 4. Serverdan blog ma’lumotlarini olishga harakat qilamiz
    try {
        // 5. fetch orqali serverga so‘rov yuboramiz
        // /api/blogs manzilidan blog postlarining ro‘yxatini olamiz
        const res = await fetch(`${apiUrl}/api/blogs`, {
            method: "GET", // Ma’lumotlarni olish uchun GET usulidan foydalanamiz
            credentials: "include", // Cookie’lar (masalan, token) bilan birga yuboriladi
            headers: {
                "Content-Type": "application/json" // Ma’lumotlar JSON formatida
            }
        });

        // 6. Server javobi to‘g‘ri kelmasa, xato chiqaramiz
        if (!res.ok) throw new Error("Bloglarni olishda xatolik yuz berdi");

        // 7. Serverdan kelgan ma’lumotlarni JSON sifatida olamiz
        // Blog postlarining ro‘yxati blogs o‘zgaruvchisiga saqlanadi
        let blogs = await res.json();

        // 8. Eski blog postlarini tozalaymiz
        // blogContainer ichidagi avvalgi ma’lumotlarni o‘chiramiz
        blogContainer.innerHTML = "";

        // 9. Faqat oxirgi 3 ta blog postini olamiz
        // Ro‘yxatdan birinchi 3 ta elementni tanlaymiz
        const latestBlogs = blogs.slice(0, 3);

        // 10. Tanlangan blog postlarini ekranga chiqaramiz
        latestBlogs.forEach((blog, i) => {
            // 11. Blog sarlavhasini olamiz
            // Agar sarlavha bo‘lsa, uni olamiz, bo‘lmasa “No title” qo‘yamiz
            const title = blog.title?.[0]?.titleName || "No title";

            // 12. Sarlavhani qisqartiramiz
            // Agar sarlavha 50 belgidan uzun bo‘lsa, uni qisqartirib “…” qo‘shamiz
            const shortTitle = title.length > 50 ? title.slice(0, 50) + "…" : title;

            // 13. Blog tavsifini olamiz
            // Agar tavsif bo‘lsa, uni olamiz, bo‘lmasa “No description” qo‘yamiz
            const desc = blog.description?.[0]?.descriptionName || "No description";

            // 14. Tavsifni qisqartiramiz
            // Agar tavsif 100 belgidan uzun bo‘lsa, uni qisqartirib “…” qo‘shamiz
            const shortDesc = desc.length > 100 ? desc.slice(0, 100) + "…" : desc;

            // 15. Blog rasmini olamiz
            // Agar rasm bo‘lsa, uni olamiz, bo‘lmasa standart rasm ishlatiladi
            const image = blog.images?.[0]?.imagesUrl || "img/default-image.jpg";

            // 16. Blog yaratilgan sanani formatlaymiz
            // createdAt maydonidan sana olamiz va uni DD/MM formatiga keltiramiz
            const date = new Date(blog.createdAt);
            const day = String(date.getDate()).padStart(2, "0"); // Kunni 2 raqamli qilamiz
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Oyni 2 raqamli qilamiz

            // 17. Har bir blog uchun yangi div elementi yaratamiz
            const post = document.createElement("div");

            // 18. Div’ga “blog-post” klassini qo‘shamiz
            // Bu klass blog postining uslubi uchun ishlatiladi
            post.className = "blog-post";

            // 19. AOS animatsiyasi sozlamalarini qo‘shamiz
            // fade-left animatsiyasi bilan post chapdan kirib keladi
            post.setAttribute("data-aos", "fade-left");
            // Har bir post uchun animatsiya boshlanish joyini o‘zgartiramiz
            post.setAttribute("data-aos-offset", `${400 + i * 50}`);
            // Animatsiya silliq bo‘lishi uchun easing sozlamasi
            post.setAttribute("data-aos-easing", "ease-in-sine");

            // 20. Blog postining HTML tuzilmasini yaratamiz
            // Rasm, sana, sarlavha va tavsifni dizaynga moslab joylashtiramiz
            post.innerHTML = `
                <div class="post-image">
                    <img src="${image}" alt="" style="width: 370px; height: 307px; object-fit: cover;">
                    <div class="post-date">${month}/<span>${day}</span></div>
                </div>
                <div class="post-title">
                    <a href="#">${shortTitle}</a>
                </div>
                <div class="post-text">
                    <p>${shortDesc}</p>
                </div>
            `;

            // 21. Yaratilgan blog postini blogContainer’ga qo‘shamiz
            // Post .blog-posts ichiga joylashadi
            blogContainer.appendChild(post);
        });

        // 22. Loader.js ga blog ma’lumotlari muvaffaqiyatli yuklanganini xabar qilamiz
        // blog bo‘limi yuklandi, true qiymati muvaffaqiyatni bildiradi
        notifyLoadComplete('blog', true);
    } catch (err) {
        // 23. Agar xato bo‘lsa, konsolga chiqaramiz va xato xabarini ko‘rsatamiz
        console.error("Xatolik:", err);

        // 24. Blog konteyneriga xato xabarini yozamiz
        // Agar ma’lumotlar olinmasa, foydalanuvchiga xato xabari ko‘rsatiladi
        blogContainer.innerHTML = "<p>Xatolik yuz berdi, bloglar yuklanmadi.</p>";

        // 25. Loader.js ga blog ma’lumotlari yuklanmaganini xabar qilamiz
        // blog bo‘limi yuklanmadi, false qiymati xatoni bildiradi
        notifyLoadComplete('blog', false);
    }
});