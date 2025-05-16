import { apiUrl, frontUrl } from '../../js/urls.js';

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');

    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    toastMessage.textContent = message;
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// Error message function
function showError(message, elementId = 'form-error-message') {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// Dynamic input functions
function addTitleInput(containerId = 'title-inputs') {
    const titleInputs = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="title-input" placeholder="Sarlavha kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    titleInputs.appendChild(inputGroup);
}

function addDescriptionInput(containerId = 'description-inputs') {
    const descriptionInputs = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="description-input" placeholder="Tavsif kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    descriptionInputs.appendChild(inputGroup);
}

function addImageInput(containerId = 'image-inputs') {
    const imageInputs = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="url" class="image-url" placeholder="Rasm URL manzilini kiriting">
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    imageInputs.appendChild(inputGroup);
}

function removeInput(button) {
    button.parentElement.remove();
}

// Render blog posts
function renderBlogPosts(blogs, userRole) {
    const blogGrid = document.getElementById('blog-grid');
    blogGrid.innerHTML = '';

    if (blogs.length === 0) {
        showToast('Hech qanday blog posti topilmadi.', 'error');
        return;
    }

    blogs.forEach((blog, index) => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        const titlesHtml = blog.title && blog.title.length > 0
            ? blog.title.map(t => `<h3>${t.titleName}</h3>`).join('')
            : '<h3>Sarlavha yo‘q</h3>';

        const descriptionsHtml = blog.description && blog.description.length > 0
            ? blog.description.map(d => `<div class="description">${d.descriptionName}</div>`).join('')
            : '<div class="description">Tavsif yo‘q</div>';

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

        const commentsHtml = blog.comments && blog.comments.length > 0
            ? blog.comments.map(comment => `
                <div class="comment">
                    <span class="comment-author">${comment.senderName?.name || 'Noma’lum'}</span>:
                    ${comment.message}
                    <div class="comment-date">${new Date(comment.created_At).toLocaleString()}</div>
                </div>
            `).join('')
            : '<div class="comment">Hozircha kommentlar yo‘q.</div>';

        const actionButtons = userRole === 'admin' ? `
            <div class="action-buttons">
                <button class="view-btn" onclick="window.location.href='blog-details.html?id=${blog._id}'">Ko‘rish</button>
                <button class="edit-btn" data-bs-toggle="modal" data-bs-target="#editBlogModal" data-blog-id="${blog._id}">Tahrirlash</button>
                <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteBlogModal" data-blog-id="${blog._id}">O‘chirish</button>
            </div>
        ` : '';

        card.innerHTML = `
            ${carouselHtml}
            ${titlesHtml}
            ${descriptionsHtml}
            <div class="meta">
                Muallif: <span class="author">${blog.createdBy?.name || 'Noma’lum'}</span>, 
                Sana: ${new Date(blog.createdAt).toLocaleDateString()}
            </div>
            <a href="blog-details.html?id=${blog._id}" class="read-more">Davomini o‘qish</a>
            <div class="comments-section">
                <h4>Kommentlar</h4>
                ${commentsHtml}
                <form class="comment-form" data-blog-id="${blog._id}">
                    <textarea placeholder="Komment qoldiring" required></textarea>
                    <button type="submit">Komment yuborish</button>
                </form>
            </div>
            ${actionButtons}
        `;

        blogGrid.appendChild(card);
    });
}

// Populate edit modal
function populateEditModal(blog) {
    const editBlogId = document.getElementById('edit-blog-id');
    const titleInputs = document.getElementById('edit-title-inputs');
    const descriptionInputs = document.getElementById('edit-description-inputs');
    const imageInputs = document.getElementById('edit-image-inputs');

    editBlogId.value = blog._id;
    titleInputs.innerHTML = '';
    descriptionInputs.innerHTML = '';
    imageInputs.innerHTML = '';

    (blog.title || []).forEach(title => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="title-input" value="${title.titleName}" placeholder="Sarlavha kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        titleInputs.appendChild(inputGroup);
    });

    (blog.description || []).forEach(desc => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="text" class="description-input" value="${desc.descriptionName}" placeholder="Tavsif kiriting" required>
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        descriptionInputs.appendChild(inputGroup);
    });

    (blog.images || []).forEach(img => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <input type="url" class="image-url" value="${img.imagesUrl}" placeholder="Rasm URL manzilini kiriting">
            <button type="button" onclick="removeInput(this)">O‘chirish</button>
        `;
        imageInputs.appendChild(inputGroup);
    });

    if (!blog.title || blog.title.length === 0) addTitleInput('edit-title-inputs');
    if (!blog.description || blog.description.length === 0) addDescriptionInput('edit-description-inputs');
    if (!blog.images || blog.images.length === 0) addImageInput('edit-image-inputs');
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const user = userResponse.data;
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        localStorage.setItem('userRole', user.role);

        if (user.role === 'admin') {
            document.getElementById('add-blog-nav').style.display = 'inline-block';
            addTitleInput();
            addDescriptionInput();
            addImageInput();
        }

        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        renderBlogPosts(blogResponse.data, user.role);

    } catch (error) {
        showToast(error.response?.data?.error || 'Blog ma’lumotlarini olishda xato', 'error');
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}`;
        }
    }
});

// Add blog form submission
document.getElementById('blog-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    const titleInputs = document.querySelectorAll('#title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#image-inputs .image-url');

    const titles = Array.from(titleInputs).map(input => input.value.trim()).filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs).map(input => input.value.trim()).filter(desc => desc !== '');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');

    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak');
        return;
    }

    try {
        await axios.post(`${apiUrl}/api/blogs/add`, {
            titles,
            descriptions,
            images
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        showToast('Blog posti muvaffaqiyatli qo‘shildi');
        document.getElementById('blog-form').reset();
        document.getElementById('title-inputs').innerHTML = '';
        document.getElementById('description-inputs').innerHTML = '';
        document.getElementById('image-inputs').innerHTML = '';
        addTitleInput();
        addDescriptionInput();
        addImageInput();
    } catch (error) {
        showError(error.response?.data?.error || 'Blog posti qo‘shishda xato');
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti qo‘shishi mumkin');
        }
    }
});

// Edit blog form submission
document.getElementById('edit-blog-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const blogId = document.getElementById('edit-blog-id').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('editBlogModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    const titleInputs = document.querySelectorAll('#edit-title-inputs .title-input');
    const descriptionInputs = document.querySelectorAll('#edit-description-inputs .description-input');
    const imageInputs = document.querySelectorAll('#edit-image-inputs .image-url');

    const titles = Array.from(titleInputs).map(input => input.value.trim()).filter(title => title !== '');
    const descriptions = Array.from(descriptionInputs).map(input => input.value.trim()).filter(desc => desc !== '');
    const images = Array.from(imageInputs).map(input => input.value.trim()).filter(url => url !== '');

    if (titles.length === 0 || descriptions.length === 0) {
        showError('Kamida bitta sarlavha va bitta tavsif kerak', 'edit-form-error-message');
        return;
    }

    try {
        await axios.put(`${apiUrl}/api/blogs/${blogId}`, {
            titles,
            descriptions,
            images
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        showToast('Blog posti muvaffaqiyatli tahrirlandi');
    } catch (error) {
        showError(error.response?.data?.error || 'Blog posti tahrirlashda xato', 'edit-form-error-message');
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar blog posti tahrirlashi mumkin', 'edit-form-error-message');
        }
    }
});

// Delete blog
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const blogId = document.getElementById('delete-blog-id').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteBlogModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        await axios.delete(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
        showToast('Blog posti muvaffaqiyatli o‘chirildi');
    } catch (error) {
        showToast(error.response?.data?.error || 'Blog posti o‘chirishda xato', 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar blog posti o‘chirishi mumkin', 'error');
        }
    }
});

// Handle edit and delete button clicks
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const blogId = e.target.getAttribute('data-blog-id');
        try {
            const response = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                withCredentials: true
            });
            populateEditModal(response.data);
            document.getElementById('edit-blog-id').value = blogId;
        } catch (error) {
            showToast('Blog ma’lumotlarini olishda xato', 'error');
        }
    }

    if (e.target.classList.contains('delete-btn')) {
        const blogId = e.target.getAttribute('data-blog-id');
        document.getElementById('delete-blog-id').value = blogId;
    }
});

// Comment form submission
document.addEventListener('submit', async (e) => {
    if (e.target.classList.contains('comment-form')) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = `${frontUrl}/pages/error.html`;
            return;
        }

        const blogId = e.target.getAttribute('data-blog-id');
        const message = e.target.querySelector('textarea').value.trim();

        if (!message) {
            showToast('Komment matni kerak', 'error');
            return;
        }

        try {
            await axios.post(`${apiUrl}/api/blogs/${blogId}/comment`, {
                blogId,
                message
            }, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            const blogResponse = await axios.get(`${apiUrl}/api/blogs`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            renderBlogPosts(blogResponse.data, localStorage.getItem('userRole') || 'user');
            showToast('Komment muvaffaqiyatli qo‘shildi');
            e.target.reset();
        } catch (error) {
            showToast(error.response?.data?.error || 'Komment qo‘shishda xato', 'error');
        }
    }
});