// Xato xabarini ko‘rsatish funksiyasi
function showError(message, elementId = 'form-error-message') {
    // Xato xabarini ko‘rsatadigan elementni ID orqali topamiz
    const errorDiv = document.getElementById(elementId);
    // Xabarni elementga yozamiz
    errorDiv.textContent = message;
    // Xato xabarini ko‘rinadigan qilamiz (CSS class qo‘shamiz)
    errorDiv.classList.add('active');
    // 5 soniyadan keyin xabarni yashiramiz
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

// Sarlavha uchun yangi input qo‘shish funksiyasi
function addTitleInput() {
    // Sarlavha inputlari joylashgan joyni topamiz (ID: title-inputs)
    const titleInputs = document.getElementById('title-inputs');
    // Yangi input guruhi uchun div yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    // Input va o‘chirish tugmasini qo‘shamiz
    inputGroup.innerHTML = `
        <input type="text" class="title-input" placeholder="Sarlavha kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // Inputni sahifaga qo‘shamiz
    titleInputs.appendChild(inputGroup);
}

// Tavsif uchun yangi input qo‘shish funksiyasi
function addDescriptionInput() {
    // Tavsif inputlari joylashgan joyni topamiz (ID: description-inputs)
    const descriptionInputs = document.getElementById('description-inputs');
    // Yangi input guruhi uchun div yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    // Input va o‘chirish tugmasini qo‘shamiz
    inputGroup.innerHTML = `
        <input type="text" class="description-input" placeholder="Tavsif kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // Inputni sahifaga qo‘shamiz
    descriptionInputs.appendChild(inputGroup);
}

// Rasm uchun yangi input qo‘shish funksiyasi
function addImageInput() {
    // Rasm inputlari joylashgan joyni topamiz (ID: image-inputs)
    const imageInputs = document.getElementById('image-inputs');
    // Yangi input guruhi uchun div yaratamiz
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    // Input va o‘chirish tugmasini qo‘shamiz
    inputGroup.innerHTML = `
        <input type="url" class="image-url" placeholder="Rasm URL manzilini kiriting">
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    // Inputni sahifaga qo‘shamiz
    imageInputs.appendChild(inputGroup);
}

// Inputni o‘chirish funksiyasi
function removeInput(button) {
    // Tugma bosilgan input guruhini o‘chiramiz
    button.parentElement.remove();
}

// Blog postlarini sahifada ko‘rsatish funksiyasi
function renderBlogPosts(blogs) {
    // Blog postlari joylashadigan joyni topamiz (ID: blog-grid)
    const blogGrid = document.getElementById('blog-grid');
    // Avvalgi kontentni tozalaymiz
    blogGrid.innerHTML = '';

    // Agar blog postlari bo‘lmasa, xato xabarini ko‘rsatamiz
    if (blogs.length === 0) {
        showError('Hech qanday blog posti topilmadi.', 'blog-grid');
        return;
    }

    // Har bir blog posti uchun kartochka yaratamiz
    blogs.forEach((blog, index) => {
        // Yangi kartochka div yaratamiz
        const card = document.createElement('div');
        card.className = 'blog-card';
        // Animatsiya qo‘shamiz (AOS kutubxonasi)
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        // Sarlavhalar
        const titlesHtml = blog.title && blog.title.length > 0
            ? blog.title.map(t => `<h3>${t.titleName}</h3>`).join('')
            : '<h3>Sarlavha yo‘q</h3>';

        // Tavsiflar
        const descriptionsHtml = blog.description && blog.description.length > 0
            ? blog.description.map(d => `<div class="description">${d.descriptionName}</div>`).join('')
            : '<div class="description">Tavsif yo‘q</div>';

        // Rasmlar uchun karusel (agar rasm bo‘lsa)
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

        // Kommentlar
        const commentsHtml = blog.comments && blog.comments.length > 0
            ? blog.comments.map(comment => `
                <div class="comment">
                    <span class="comment-author">${comment.senderName?.name || 'Noma’lum'}</span>:
                    ${comment.message}
                    <div class="comment-date">${new Date(comment.created_At).toLocaleString()}</div>
                </div>
            `).join('')
            : '<div class="comment">Hozircha kommentlar yo‘q.</div>';

        // Kartochka ichidagi HTML
        card.innerHTML = `
            ${carouselHtml}
            ${titlesHtml}
            ${descriptionsHtml}
            <div class="meta">
                Muallif: <span class="author">${blog.createdBy?.name || 'Noma’lum'}</span>, 
                Sana: ${new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <a href="#" class="read-more">Davomini o‘qish</a>
            <div class="comments-section">
                <h4>Kommentlar</h4>
                ${commentsHtml}
                <form class="comment-form" data-blog-id="${blog._id}">
                    <textarea placeholder="Komment qoldiring" required></textarea>
                    <button type="submit">Komment yuborish</button>
                </form>
            </div>
        `;

        // Kartochkani sahifaga qo‘shamiz
        blogGrid.appendChild(card);
    });
}

// Sahifa yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // LocalStorage’dan tokenni olamiz
    const token = localStorage.getItem('token');

    // Agar token bo‘lmasa, login sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = 'https://dreamsoft-front.vercel.app/pages/error.html';
        return;
    }

    try {
        // Foydalanuvchi ma’lumotlarini olish
        const userResponse = await axios.post('https://dreamsoft-backend.vercel.app/api/get', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        const user = userResponse.data;

        // Sahifa sarlavhasidagi foydalanuvchi nomini yangilaymiz (ID: header-user-name)
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';

        // Agar foydalanuvchi admin bo‘lsa, blog qo‘shish formasini ko‘rsatamiz
        if (user.role === 'admin') {
            document.getElementById('add-blog-form').classList.add('active');
            // Har bir maydon uchun bitta input qo‘shamiz
            addTitleInput();
            addDescriptionInput();
            addImageInput();
        }

        // Blog ma’lumotlarini olish
        const blogResponse = await axios.get('https://dreamsoft-backend.vercel.app/api/blogs', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        // Blog postlarini sahifada ko‘rsatamiz
        renderBlogPosts(blogResponse.data);
    } catch (error) {
        // Xato bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Blog ma’lumotlarini olishda xato');
        // Agar sessiya tugagan bo‘lsa, login sahifasiga yo‘naltiramiz
        if (error.response && error.response.status === 401) {
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            localStorage.clear();
            window.location.href = 'https://dreamsoft-front.vercel.app';
        }
    }
});

// Blog qo‘shish formasini yuborish (ID: blog-form)
document.getElementById('blog-form')?.addEventListener('submit', async (e) => {
    // Forma yuborilishini to‘xtatamiz (sahifa yangilanmasligi uchun)
    e.preventDefault();

    // Tokenni tekshiramiz
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'https://dreamsoft-front.vercel.app/pages/error.html';
        return;
    }

    // Barcha inputlarni olamiz
    const titleInputs = document.querySelectorAll('#title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#image-inputs .image-url');

    // Inputlardan ma’lumotlarni yig‘amiz va bo‘shlarini olib tashlaymiz
    const titles = Array.from(titleInputs)
        .map(input => input.value.trim())
        .filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs)
        .map(input => input.value.trim())
        .filter(desc => desc !== '');
    const images = Array.from(imageInputs)
        .map(input => input.value.trim())
        .filter(url => url !== '');

    // Agar sarlavha yoki tavsif bo‘lmasa, xato ko‘rsatamiz
    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak');
        return;
    }

    try {
        // Yangi blog postini serverga yuboramiz
        const response = await axios.post('https://dreamsoft-backend.vercel.app/api/blogs/add', {
            titles,
            descriptions,
            images
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        // Yangilangan blog ro‘yxatini olamiz
        const blogResponse = await axios.get('https://dreamsoft-backend.vercel.app/api/blogs', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });

        // Blog postlarini qayta ko‘rsatamiz
        renderBlogPosts(blogResponse.data);
        // Muvaffaqiyat xabarini ko‘rsatamiz
        showError('Blog posti muvaffaqiyatli qo‘shildi');

        // Formani tozalaymiz
        document.getElementById('blog-form').reset();
        document.getElementById('title-inputs').innerHTML = '';
        document.getElementById('description-inputs').innerHTML = '';
        document.getElementById('image-inputs').innerHTML = '';
        // Yangi inputlar qo‘shamiz
        addTitleInput();
        addDescriptionInput();
        addImageInput();
    } catch (error) {
        // Xato bo‘lsa, xabar ko‘rsatamiz
        showError(error.response?.data?.error || 'Blog posti qo‘shishda xato');
        // Agar admin emas bo‘lsa, xabar ko‘rsatamiz
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti qo‘shishi mumkin');
        }
    }
});

// Komment formalarini yuborish
document.addEventListener('submit', async (e) => {
    // Agar yuborilgan forma komment formasi bo‘lsa
    if (e.target.classList.contains('comment-form')) {
        // Forma yuborilishini to‘xtatamiz
        e.preventDefault();

        // Tokenni tekshiramiz
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'https://dreamsoft-front.vercel.app/pages/error.html';
            return;
        }

        // Blog ID’sini formadan olamiz
        const blogId = e.target.getAttribute('data-blog-id');
        // Komment matnini olamiz
        const message = e.target.querySelector('textarea').value.trim();

        // Agar komment bo‘sh bo‘lsa, xato ko‘rsatamiz
        if (!message) {
            showError('Komment matni kerak', `comment-error-${blogId}`);
            return;
        }

        try {
            // Kommentni serverga yuboramiz
            const response = await axios.post(`https://dreamsoft-backend.vercel.app/api/blogs/${blogId}/comment`, {
                blogId,
                message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            // Yangilangan blog ro‘yxatini olamiz
            const blogResponse = await axios.get('https://dreamsoft-backend.vercel.app/api/blogs', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            // Blog postlarini qayta ko‘rsatamiz
            renderBlogPosts(blogResponse.data);
            // Muvaffaqiyat xabarini ko‘rsatamiz
            showError('Komment muvaffaqiyatli qo‘shildi');
        } catch (error) {
            // Xato bo‘lsa, xabar ko‘rsatamiz
            showError(error.response?.data?.error || 'Komment qo‘shishda xato', `comment-error-${blogId}`);
        }
    }
});