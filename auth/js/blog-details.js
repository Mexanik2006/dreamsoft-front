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
function showError(message, elementId = 'edit-form-error-message') {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// Dynamic input functions
function addTitleInput(containerId = 'edit-title-inputs') {
    const titleInputs = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="title-input" placeholder="Sarlavha kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    titleInputs.appendChild(inputGroup);
}

function addDescriptionInput(containerId = 'edit-description-inputs') {
    const descriptionInputs = document.getElementById(containerId);
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';
    inputGroup.innerHTML = `
        <input type="text" class="description-input" placeholder="Tavsif kiriting" required>
        <button type="button" onclick="removeInput(this)">O‘chirish</button>
    `;
    descriptionInputs.appendChild(inputGroup);
}

function addImageInput(containerId = 'edit-image-inputs') {
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

// Render blog details
function renderBlogDetails(blog, userRole) {
    const blogDetails = document.getElementById('blog-details');
    blogDetails.innerHTML = '';

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

    const titlesHtml = blog.title && blog.title.length > 0
        ? blog.title.map(t => `<h2>${t.titleName}</h2>`).join('')
        : '<h2>Sarlavha yo‘q</h2>';

    const descriptionsHtml = blog.description && blog.description.length > 0
        ? blog.description.map(d => `<div class="description">${d.descriptionName}</div>`).join('')
        : '<div class="description">Tavsif yo‘q</div>';

    const commentsHtml = blog.comments && blog.comments.length > 0
        ? blog.comments.map(comment => `
            <div class="comment">
                <span class="comment-author">${comment.senderName?.name || 'Noma’lum'}</span>:
                ${comment.message}
                <div class="comment-date">${new Date(comment.created_At).toLocaleString()}</div>
            </div>
        `).join('')
        : '<div class="comment">Hozircha kommentlar yo‘q.</div>';

    blogDetails.innerHTML = `
        ${carouselHtml}
        ${titlesHtml}
        ${descriptionsHtml}
        <div class="meta">
            Muallif: <span class="author">${blog.createdBy?.name || 'Noma’lum'}</span>, 
            Sana: ${new Date(blog.createdAt).toLocaleDateString()}
        </div>
        <div class="comments-section">
            <h3>Kommentlar</h3>
            ${commentsHtml}
            <form class="comment-form" data-blog-id="${blog._id}">
                <textarea placeholder="Komment qoldiring" required></textarea>
                <button type="submit">Komment yuborish</button>
            </form>
        </div>
    `;

    if (userRole === 'admin') {
        document.getElementById('admin-actions').style.display = 'flex';
        document.getElementById('edit-blog-id').value = blog._id;
        document.getElementById('delete-blog-id').value = blog._id;
    }
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
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!token || !blogId) {
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

        const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        renderBlogDetails(blogResponse.data, user.role);
        if (user.role === 'admin') {
            populateEditModal(blogResponse.data);
        }
    } catch (error) {
        showToast(error.response?.data?.error || 'Blog ma’lumotlarini olishda xato', 'error');
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}`;
        }
    }
});

// Comment form submission
document.addEventListener('submit', async (e) => {
    if (e.target.classList.contains('comment-form')) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const blogId = e.target.getAttribute('data-blog-id');
        const message = e.target.querySelector('textarea').value.trim();

        if (!token) {
            window.location.href = `${frontUrl}/pages/error.html`;
            return;
        }

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

            const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            renderBlogDetails(blogResponse.data, localStorage.getItem('userRole') || 'user');
            showToast('Komment muvaffaqiyatli qo‘shildi');
            e.target.reset();
        } catch (error) {
            showToast(error.response?.data?.error || 'Komment qo‘shishda xato', 'error');
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

        const blogResponse = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        renderBlogDetails(blogResponse.data, localStorage.getItem('userRole') || 'user');
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

        modal.hide();
        showToast('Blog posti muvaffaqiyatli o‘chirildi');
        window.location.href = `${frontUrl}/pages/blog.html`;
    } catch (error) {
        showToast(error.response?.data?.error || 'Blog posti o‘chirishda xato', 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar blog posti o‘chirishi mumkin', 'error');
        }
    }
});