// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. Xabar (toast) ko‘rsatish funksiyasi
// Muvaffaqiyat yoki xatolik xabarlarini 5 soniya davomida ko‘rsatadi
function showToast(message, type = 'success') {
    // 3. Toast elementlarini HTML’dan topamiz
    const toast = document.getElementById('notificationToast'); // Toast konteyneri
    const toastTitle = document.getElementById('toast-title'); // Sarlavha
    const toastMessage = document.getElementById('toast-message'); // Xabar matni

    // 4. Sarlavha va uslubni sozlaymiz: muvaffaqiyat (yashil) yoki xatolik (qizil)
    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    // 5. Bootstrap Toast’ni ishga tushiramiz (5 soniya ko‘rinadi)
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// 6. Forma xatolarini ko‘rsatish funksiyasi
// Xatolik xabarini div’da 5 soniya ko‘rsatadi
function showError(message, elementId = 'form-error-message') {
    // 7. Xabar ko‘rsatiladigan div’ni topamiz
    const errorDiv = document.getElementById(elementId);
    // 8. Xabar matnini yozamiz
    errorDiv.textContent = message;
    // 9. Div’ni ko‘rinadigan qilamiz
    errorDiv.classList.add('active');
    // 10. 5 soniyadan so‘ng yashiramiz
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// 11. Dinamik sarlavha maydoni qo‘shish funksiyasi
function addTitleInput(containerId = 'title-inputs') {
    // 12. Sarlavha maydonlari konteynerini topamiz
    const titleInputs = document.getElementById(containerId);
    // 13. Yangi input guruhini yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="title-input" placeholder="Sarlavha kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // 14. Input’ni konteynerga qo‘shamiz
    titleInputs.appendChild(inputGroup);
}

// 15. Dinamik tavsif maydoni qo‘shish funksiyasi
function addDescriptionInput(containerId = 'description-inputs') {
    // 16. Tavsif maydonlari konteynerini topamiz
    const descriptionInputs = document.getElementById(containerId);
    // 17. Yangi input guruhini yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="description-input" placeholder="Tavsif kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // 18. Input’ni konteynerga qo‘shamiz
    descriptionInputs.appendChild(inputGroup);
}

// 19. Dinamik rasm URL maydoni qo‘shish funksiyasi
function addImageInput(containerId = 'image-inputs') {
    // 20. Rasm maydonlari konteynerini topamiz
    const imageInputs = document.getElementById(containerId);
    // 21. Yangi input guruhini yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="url" class="image-url" placeholder="Rasm URL manzilini kiriting">
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // 22. Input’ni konteynerga qo‘shamiz
    imageInputs.appendChild(inputGroup);
}

// 23. Input maydonini o‘chirish funksiyasi
function removeInput(button) {
    // 24. Tugma joylashgan input guruhini o‘chiramiz
    button.parentElement.remove();
}

// 25. Blog postlarini sahifada ko‘rsatish funksiyasi
function renderBlogPosts(blogs, userRole) {
    // 26. Blog grid’ini topamiz
    const blogGrid = document.getElementById('blog-grid');
    // 27. Avvalgi ma’lumotlarni tozalaymiz
    blogGrid.innerHTML = '';

    // 28. Agar blog postlari bo‘lmasa, xabar ko‘rsatamiz
    if (blogs.length === 0) {
        showToast('Hech qanday blog posti topilmadi.', 'error');
        return;
    }

    // 29. Har bir blog posti uchun karta yaratamiz
    blogs.forEach((blog, index) => {
        // 30. Yangi karta div’ini yaratamiz
        const card = document.createElement('div');
        card.className = 'blog-card';
        // 31. AOS animatsiyasini qo‘shamiz
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        // 32. Sarlavhalarni HTML sifatida tayyorlaymiz
        const titlesHtml = blog.title && blog.title.length > 0
            ? blog.title.map(t => `<h3>${t.titleName}</h3>`).join('')
            : '<h3>Sarlavha yo‘q</h3>';

        // 33. Tavsiflarni HTML sifatida tayyorlaymiz
        const descriptionsHtml = blog.description && blog.description.length > 0
            ? blog.description.map(d => `<div class="description">${d.descriptionName}</div>`).join('')
            : '<div class="description">Tavsif yo‘q</div>';

        // 34. Rasm karuselini tayyorlaymiz
        let carouselHtml = '';
        if (blog.images && blog.images.length > 0) {
            carouselHtml = `
                <div id="carousel-${blog._id}" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${blog.images.map((img, imgIndex) => `
                            <div class="carousel-item ${imgIndex === 0 ? 'active' : ''}">
                                <img src="${img.imagesUrl}" alt="Blog rasmi">
                            </div>
                        `).join('')}
                    </div>
                    ${blog.images.length > 1 ? `
                        <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${blog._id}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Oldingi</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carousel-${blog._id}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Keyingi</span>
                        </button>
                    ` : ''}
                </div>
            `;
        }

        // 35. Kommentlarni HTML sifatida tayyorlaymiz
        const commentsHtml = blog.comments && blog.comments.length > 0
            ? blog.comments.map(comment => `
                <div class="comment">
                    <span class="comment-author">${comment.senderName?.name || 'Noma’lum'}</span>:
                    ${comment.message}
                    <div class="comment-date">${new Date(comment.created_At).toLocaleString()}</div>
                </div>
            `).join('')
            : '<div class="comment">Hozircha kommentlar yo‘q.</div>';

        // 36. Admin uchun tugmalarni qo‘shamiz
        const actionButtons = userRole === 'admin' ? `
            <div class="action-buttons">
                <button class="view-btn" onclick="window.location.href='blog-details.html?id=${blog._id}'">Ko‘rish</button>
                <button class="edit-btn" data-bs-toggle="modal" data-bs-target="#editBlogModal" data-blog-id="${blog._id}">Tahrirlash</button>
                <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteBlogModal" data-blog-id="${blog._id}">O‘chirish</button>
            </div>
        ` : '';

        // 37. Karta ichidagi HTML’ni joylashtiramiz
        card.innerHTML = `
            ${carouselHtml} <!-- Rasm karuseli -->
            ${titlesHtml} <!-- Sarlavhalar -->
            ${descriptionsHtml} <!-- Tavsiflar -->
            <div class="meta">
                Muallif: <span class="author">${blog.createdBy?.name || 'Noma’lum'}</span>, 
                Sana: ${new Date(blog.createdAt).toLocaleDateString()}
            </div> <!-- Muallif va sana -->
            <a href="blog-details.html?id=${blog._id}" class="read-more">Davomini o‘qish</a>
            <div class="comments-section">
                <h4>Kommentlar</h4>
                ${commentsHtml} <!-- Kommentlar -->
                <form class="comment-form" data-blog-id="${blog._id}">
                    <textarea placeholder="Komment qoldiring" required></textarea>
                    <button type="submit">Komment yuborish</button>
                </form>
            </div>
            ${actionButtons} <!-- Admin tugmalari -->
        `;

        // 38. Kartani grid’ga qo‘shamiz
        blogGrid.appendChild(card);
    });
}

// 39. Tahrirlash modalini ma’lumotlar bilan to‘ldirish
function populateEditModal(blog) {
    // 40. Forma maydonlarini topamiz
    const editBlogId = document.getElementById('edit-blog-id');
    const titleInputs = document.getElementById('edit-title-inputs');
    const descriptionInputs = document.getElementById('edit-description-inputs');
    const imageInputs = document.getElementById('edit-image-inputs');

    // 41. Blog ID’sini joylashtiramiz
    editBlogId.value = blog._id;
    // 42. Avvalgi input’larni tozalaymiz
    titleInputs.innerHTML = '';
    descriptionInputs.innerHTML = '';
    imageInputs.innerHTML = '';

    // 43. Sarlavha input’larini qo‘shamiz
    (blog.title || []).forEach(title => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="title-input" value="${title.titleName}" placeholder="Sarlavha kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        titleInputs.appendChild(inputGroup);
    });

    // 44. Tavsif input’larini qo‘shamiz
    (blog.description || []).forEach(desc => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="description-input" value="${desc.descriptionName}" placeholder="Tavsif kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        descriptionInputs.appendChild(inputGroup);
    });

    // 45. Rasm URL input’larini qo‘shamiz
    (blog.images || []).forEach(img => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="url" class="image-url" value="${img.imagesUrl}" placeholder="Rasm URL manzilini kiriting">
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        imageInputs.appendChild(inputGroup);
    });

    // 46. Agar input’lar bo‘sh bo‘lsa, bitta bo‘sh input qo‘shamiz
    if (!blog.title || blog.title.length === 0) addTitleInput('edit-title-inputs');
    if (!blog.description || blog.description.length === 0) addDescriptionInput('edit-description-inputs');
    if (!blog.images || blog.images.length === 0) addImageInput('edit-image-inputs');
}

// 47. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // 48. Foydalanuvchi tokenini olamiz
    const token = localStorage.getItem('token');

    // 49. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // 50. Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 51. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = userResponse.data;
        // 52. Sarlavhadagi foydalanuvchi nomini ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // 53. Foydalanuvchi rolini saqlaymiz
        localStorage.setItem('userRole', user.role);

        // 54. Agar admin bo‘lsa, blog qo‘shish tugmasi va input’larni ko‘rsatamiz
        if (user.role === 'admin') {
            document.getElementById('add-blog-nav').style.display = 'inline-block';
            addTitleInput();
            addDescriptionInput();
            addImageInput();
        }

        // 55. Blog postlarini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 56. Blog postlarini sahifada ko‘rsatamiz
        renderBlogPosts(blogResponse.data, user.role);

    } catch (error) {
        // 57. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showToast(error.response?.data?.error || 'Blog ma’lumotlarini olishda xato', 'error');
        // 58. 401 xatosi bo‘lsa, token eskirgan
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}`;
        }
    }
});

// 59. Yangi blog posti qo‘shish formasini boshqarish
document.getElementById('blog-form')?.addEventListener('submit', async (e) => {
    // 60. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 61. Tokenni olamiz
    const token = localStorage.getItem('token');
    // 62. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));

    // 63. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 64. Forma maydonlaridagi ma’lumotlarni olamiz
    const titleInputs = document.querySelectorAll('#title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#image-inputs .image-url');

    // 65. Bo‘sh bo‘lmagan sarlavha, tavsif va rasm URL’larini yig‘amiz
    const titles = Array.from(titleInputs).map(input => input.value.trim()).filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs).map(input => input.value.trim()).filter(desc => desc !== '');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');

    // 66. Majburiy maydonlarni tekshiramiz
    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak');
        return;
    }

    try {
        // 67. Serverga yangi blog postini qo‘shish so‘rovini yuboramiz
        await axios.post(`${apiUrl}/api/blogs/add`, {
            titles,
            descriptions,
            images
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 68. Yangilangan blog ro‘yxatini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 69. Modalni yashiramiz
        modal.hide();
        // 70. Sahifani yangilangan bloglar bilan to‘ldiramiz
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        // 71. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Blog posti muvaffaqiyatli qo‘shildi');
        // 72. Formani tozalaymiz
        document.getElementById('blog-form').reset();
        document.getElementById('title-inputs').innerHTML = '';
        document.getElementById('description-inputs').innerHTML = '';
        document.getElementById('image-inputs').innerHTML = '';
        // 73. Bo‘sh input’larni qayta qo‘shamiz
        addTitleInput();
        addDescriptionInput();
        addImageInput();
    } catch (error) {
        // 74. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Blog posti qo‘shishda xato');
        // 75. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti qo‘shishi mumkin');
        }
    }
});

// 76. Blog postini tahrirlash formasini boshqarish
document.getElementById('edit-blog-form')?.addEventListener('submit', async (e) => {
    // 77. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 78. Token va blog ID’sini olamiz
    const token = localStorage.getItem('token');
    const blogId = document.getElementById('edit-blog-id').value;
    // 79. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('editBlogModal'));

    // 80. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 81. Forma maydonlaridagi ma’lumotlarni olamiz
    const titleInputs = document.querySelectorAll('#edit-title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#edit-description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#edit-image-inputs .image-url');

    // 82. Bo‘sh bo‘lmagan sarlavha, tavsif va rasm URL’larini yig‘amiz
    const titles = Array.from(titleInputs).map(input => input.value.trim()).filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs).map(input => input.value.trim()).filter(desc => desc !== '');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');

    // 83. Majburiy maydonlarni tekshiramiz
    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak', 'edit-form-error-message');
        return;
    }

    try {
        // 84. Serverga yangilangan blog ma’lumotlarini yuboramiz
        await axios.put(`${apiUrl}/api/blogs/${blogId}`, {
            titles,
            descriptions,
            images
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 85. Yangilangan blog ro‘yxatini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 86. Modalni yashiramiz
        modal.hide();
        // 87. Sahifani yangilangan bloglar bilan to‘ldiramiz
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        // 88. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Blog posti muvaffaqiyatli tahrirlandi');
    } catch (error) {
        // 89. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Blog posti tahrirlashda xato', 'edit-form-error-message');
        // 90. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti tahrirlashi mumkin', 'edit-form-error-message');
        }
    }
});

// 91. Blog postini o‘chirish
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    // 92. Token va blog ID’sini olamiz
    const token = localStorage.getItem('token');
    const blogId = document.getElementById('delete-blog-id').value;
    // 93. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteBlogModal'));

    // 94. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // 95. Serverga blog postini o‘chirish so‘rovini yuboramiz
        await axios.delete(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 96. Yangilangan blog ro‘yxatini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 97. Modalni yashiramiz
        modal.hide();
        // 98. Sahifani yangilangan bloglar bilan to‘ldiramiz
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        // 99. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Blog posti muvaffaqiyatli o‘chirildi');
    } catch (error) {
        // 100. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showToast(error.response?.data?.error || 'Blog posti o‘chirishda xato', 'error');
        // 101. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar blog posti o‘chirishi mumkin', 'error');
        }
    }
});

// 102. Tahrirlash va o‘chirish tugmalarini boshqarish
document.addEventListener('click', async (e) => {
    // 103. “Tahrirlash” tugmasi bosilsa
    if (e.target.classList.contains('edit-btn')) {
        // 104. Blog ID’sini olamiz
        const blogId = e.target.getAttribute('data-blog-id');
        try {
            // 105. Blog ma’lumotlarini serverdan olamiz
            const response = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true
            });
            // 106. Tahrirlash modalini to‘ldiramiz
            populateEditModal(response.data);
            // 107. Blog ID’sini joylashtiramiz
            document.getElementById('edit-blog-id').value = blogId;
        } catch (error) {
            // 108. Xatolik bo‘lsa, xabar ko‘rsatamiz
            showToast('Blog ma’lumotlarini olishda xato', 'error');
        }
    }

    // 109. “O‘chirish” tugmasi bosilsa
    if (e.target.classList.contains('delete-btn')) {
        // 110. Blog ID’sini o‘chirish formasiga joylashtiramiz
        const blogId = e.target.getAttribute('data-blog-id');
        document.getElementById('delete-blog-id').value = blogId;
    }
});

// 111. Komment formasini boshqarish
document.addEventListener('submit', async (e) => {
    // 112. Agar komment formasi yuborilsa
    if (e.target.classList.contains('comment-form')) {
        // 113. Sahifaning yangilanishini oldini olamiz
        e.preventDefault();

        // 114. Tokenni olamiz
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = `${frontUrl}/pages/error.html`;
            return;
        }

        // 115. Blog ID’sini va komment matnini olamiz
        const blogId = e.target.getAttribute('data-blog-id');
        const message = e.target.querySelector('textarea').value.trim();

        // 116. Komment matni bo‘sh bo‘lmasligini tekshiramiz
        if (!message) {
            showToast('Komment matni kerak', 'error');
            return;
        }

        try {
            // 117. Serverga komment qo‘shish so‘rovini yuboramiz
            await axios.post(`${apiUrl}/api/blogs/${blogId}/comment`, {
                blogId,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // 118. Yangilangan blog ro‘yxatini serverdan olamiz
            const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // 119. Sahifani yangilangan bloglar bilan to‘ldiramiz
            renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
            // 120. Muvaffaqiyat xabarini ko‘rsatamiz
            showToast('Komment muvaffaqiyatli qo‘shildi');
            // 121. Formani tozalaymiz
            e.target.reset();
        } catch (error) {
            // 122. Xatolik bo‘lsa, xabar ko‘rsatamiz
            showToast(error.response?.data?.error || 'Komment qo‘shishda xato', 'error');
        }
    }
});