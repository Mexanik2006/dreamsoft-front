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
function showError(message, elementId = 'edit-form-error-message') {
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
function addTitleInput(containerId = 'edit-title-inputs') {
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
function addDescriptionInput(containerId = 'edit-description-inputs') {
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
function addImageInput(containerId = 'edit-image-inputs') {
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

// 25. Blog postining batafsil ma’lumotlarini ko‘rsatish funksiyasi
function renderBlogDetails(blog, userRole) {
    // 26. Blog ma’lumotlari ko‘rsatiladigan div’ni topamiz
    const blogDetails = document.getElementById('blog-details');
    // 27. Avvalgi ma’lumotlarni tozalaymiz
    blogDetails.innerHTML = '';

    // 28. Rasm karuselini tayyorlaymiz
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

    // 29. Sarlavhalarni HTML sifatida tayyorlaymiz
    const titlesHtml = blog.title && blog.title.length > 0
        ? blog.title.map(t => `<h2>${t.titleName}</h2>`).join('')
        : '<h2>Sarlavha yo‘q</h2>';

    // 30. Tavsiflarni HTML sifatida tayyorlaymiz
    const descriptionsHtml = blog.description && blog.description.length > 0
        ? blog.description.map(d => `<div class="description">${d.descriptionName}</div>`).join('')
        : '<div class="description">Tavsif yo‘q</div>';

    // 31. Kommentlarni HTML sifatida tayyorlaymiz
    const commentsHtml = blog.comments && blog.comments.length > 0
        ? blog.comments.map(comment => `
            <div class="comment">
                <span class="comment-author">${comment.senderName?.name || 'Noma’lum'}</span>:
                ${comment.message}
                <div class="comment-date">${new Date(comment.created_At).toLocaleString()}</div>
            </div>
        `).join('')
        : '<div class="comment">Hozircha kommentlar yo‘q.</div>';

    // 32. Blog ma’lumotlarini HTML sifatida joylashtiramiz
    blogDetails.innerHTML = `
        ${carouselHtml} <!-- Rasm karuseli -->
        ${titlesHtml} <!-- Sarlavhalar -->
        ${descriptionsHtml} <!-- Tavsiflar -->
        <div class="meta">
            Muallif: <span class="author">${blog.createdBy?.name || 'Noma’lum'}</span>, 
            Sana: ${new Date(blog.createdAt).toLocaleDateString()}
        </div> <!-- Muallif va sana -->
        <div class="comments-section">
            <h3>Kommentlar</h3>
            ${commentsHtml} <!-- Kommentlar -->
            <form class="comment-form" data-blog-id="${blog._id}">
                <textarea placeholder="Komment qoldiring" required></textarea>
                <button type="submit">Komment yuborish</button>
            </form>
        </div>
    `;

    // 33. Agar foydalanuvchi admin bo‘lsa, tahrirlash/o‘chirish tugmalarini ko‘rsatamiz
    if (userRole === 'admin') {
        document.getElementById('admin-actions').style.display = 'flex';
        // 34. Tahrirlash va o‘chirish formalari uchun ID’ni joylashtiramiz
        document.getElementById('edit-blog-id').value = blog._id;
        document.getElementById('delete-blog-id').value = blog._id;
    }
}

// 35. Tahrirlash modalini ma’lumotlar bilan to‘ldirish funksiyasi
function populateEditModal(blog) {
    // 36. Forma maydonlarini topamiz
    const editBlogId = document.getElementById('edit-blog-id');
    const titleInputs = document.getElementById('edit-title-inputs');
    const descriptionInputs = document.getElementById('edit-description-inputs');
    const imageInputs = document.getElementById('edit-image-inputs');

    // 37. Blog ID’sini joylashtiramiz
    editBlogId.value = blog._id;
    // 38. Avvalgi input’larni tozalaymiz
    titleInputs.innerHTML = '';
    descriptionInputs.innerHTML = '';
    imageInputs.innerHTML = '';

    // 39. Sarlavha input’larini qo‘shamiz
    (blog.title || []).forEach(title => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="title-input" value="${title.titleName}" placeholder="Sarlavha kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        titleInputs.appendChild(inputGroup);
    });

    // 40. Tavsif input’larini qo‘shamiz
    (blog.description || []).forEach(desc => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="description-input" value="${desc.descriptionName}" placeholder="Tavsif kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        descriptionInputs.appendChild(inputGroup);
    });

    // 41. Rasm URL input’larini qo‘shamiz
    (blog.images || []).forEach(img => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="url" class="image-url" value="${img.imagesUrl}" placeholder="Rasm URL manzilini kiriting">
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        imageInputs.appendChild(inputGroup);
    });

    // 42. Agar input’lar bo‘sh bo‘lsa, bitta bo‘sh input qo‘shamiz
    if (!blog.title || blog.title.length === 0) addTitleInput('edit-title-inputs');
    if (!blog.description || blog.description.length === 0) addDescriptionInput('edit-description-inputs');
    if (!blog.images || blog.images.length === 0) addImageInput('edit-image-inputs');
}

// 43. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // 44. Foydalanuvchi tokenini va blog ID’sini olamiz
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    // 45. Agar token yoki blog ID bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token || !blogId) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // 46. Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 47. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = userResponse.data;
        // 48. Sarlavhadagi foydalanuvchi nomini ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // 49. Foydalanuvchi rolini saqlaymiz
        localStorage.setItem('userRole', user.role);

        // 50. Blog postining ma’lumotlarini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 51. Blog ma’lumotlarini sahifada ko‘rsatamiz
        renderBlogDetails(blogResponse.data, user.role);
        // 52. Admin bo‘lsa, tahrirlash modalini to‘ldiramiz
        if (user.role === 'admin') {
            populateEditModal(blogResponse.data);
        }
    } catch (error) {
        // 53. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showToast(error.response?.data?.error || 'Blog ma’lumotlarini olishda xato', 'error');
        // 54. 401 xatosi bo‘lsa, token eskirgan
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}`;
        }
    }
});

// 55. Komment formasini boshqarish
document.addEventListener('submit', async (e) => {
    // 56. Agar komment formasi yuborilsa
    if (e.target.classList.contains('comment-form')) {
        // 57. Sahifaning yangilanishini oldini olamiz
        e.preventDefault();

        // 58. Token va blog ID’sini olamiz
        const token = localStorage.getItem('token');
        const blogId = e.target.getAttribute('data-blog-id');
        // 59. Komment matnini olamiz
        const message = e.target.querySelector('textarea').value.trim();

        // 60. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
        if (!token) {
            window.location.href = `${frontUrl}/pages/error.html`;
            return;
        }

        // 61. Komment matni bo‘sh bo‘lmasligini tekshiramiz
        if (!message) {
            showToast('Komment matni kerak', 'error');
            return;
        }

        try {
            // 62. Serverga komment qo‘shish so‘rovini yuboramiz
            await axios.post(`${apiUrl}/api/blogs/${blogId}/comment`, {
                blogId,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // 63. Yangilangan blog ma’lumotlarini serverdan olamiz
            const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // 64. Sahifani yangilangan ma’lumotlar bilan to‘ldiramiz
            renderBlogDetails(blogResponse.data, localStorage.getItem('userRole') || 'user');
            // 65. Muvaffaqiyat xabarini ko‘rsatamiz
            showToast('Komment muvaffaqiyatli qo‘shildi');
            // 66. Formani tozalaymiz
            e.target.reset();
        } catch (error) {
            // 67. Xatolik bo‘lsa, xabar ko‘rsatamiz
            showToast(error.response?.data?.error || 'Komment qo‘shishda xato', 'error');
        }
    }
});

// 68. Blog postini tahrirlash formasini boshqarish
document.getElementById('edit-blog-form')?.addEventListener('submit', async (e) => {
    // 69. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 70. Token va blog ID’sini olamiz
    const token = localStorage.getItem('token');
    const blogId = document.getElementById('edit-blog-id').value;
    // 71. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('editBlogModal'));

    // 72. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 73. Forma maydonlaridagi ma’lumotlarni olamiz
    const titleInputs = document.querySelectorAll('#edit-title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#edit-description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#edit-image-inputs .image-url');

    // 74. Bo‘sh bo‘lmagan sarlavha, tavsif va rasm URL’larini yig‘amiz
    const titles = Array.from(titleInputs).map(input => input.value.trim()).filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs).map(input => input.value.trim()).filter(desc => desc !== '');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');

    // 75. Majburiy maydonlarni tekshiramiz
    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak', 'edit-form-error-message');
        return;
    }

    try {
        // 76. Serverga yangilangan blog ma’lumotlarini yuboramiz
        await axios.put(`${apiUrl}/api/blogs/${blogId}`, {
            titles,
            descriptions,
            images
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 77. Yangilangan blog ma’lumotlarini serverdan olamiz
        const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 78. Modalni yashiramiz
        modal.hide();
        // 79. Sahifani yangilangan ma’lumotlar bilan to‘ldiramiz
        renderBlogDetails(blogResponse.data, localStorage.getItem('userRole') || 'user');
        // 80. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Blog posti muvaffaqiyatli tahrirlandi');
    } catch (error) {
        // 81. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Blog posti tahrirlashda xato', 'edit-form-error-message');
        // 82. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti tahrirlashi mumkin', 'edit-form-error-message');
        }
    }
});

// 83. Blog postini o‘chirish
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    // 84. Token va blog ID’sini olamiz
    const token = localStorage.getItem('token');
    const blogId = document.getElementById('delete-blog-id').value;
    // 85. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteBlogModal'));

    // 86. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // 87. Serverga blog postini o‘chirish so‘rovini yuboramiz
        await axios.delete(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 88. Modalni yashiramiz
        modal.hide();
        // 89. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Blog posti muvaffaqiyatli o‘chirildi');
        // 90. Blog ro‘yxati sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/blog.html`;
    } catch (error) {
        // 91. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showToast(error.response?.data?.error || 'Blog posti o‘chirishda xato', 'error');
        // 92. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar blog posti o‘chirishi mumkin', 'error');
        }
    }
});