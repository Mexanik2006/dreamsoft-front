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

// Render team members
function renderTeamMembers(teamMembers, isAdmin) {
    const teamGrid = document.getElementById('team-grid');
    teamGrid.innerHTML = '';
    teamGrid.style.display = 'grid';
    teamGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    teamGrid.style.gap = '20px';

    if (teamMembers.length === 0) {
        teamGrid.innerHTML = '<p class="text-center">Hozircha jamoa a\'zolari yo‘q.</p>';
        return;
    }

    teamMembers.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = 'team-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`);

        card.innerHTML = `
            <img src="${member.avatar || '../img/user-placeholder.jpg'}" alt="${member.name}">
            <h3>${member.name || 'Nomaʼlum'}</h3>
            <div class="role">${member.role || 'Jamoa aʼzosi'}</div>
            <p>${member.hobbi || 'Kasb yo‘q'}</p>
            <p>${member.email || 'Email yo‘q'}</p>
            <div class="created-by">Qo‘shgan: ${member.createdBy?.name || 'Nomaʼlum'}</div>
            ${member.email ? `<a href="mailto:${member.email}" class="email">Bog‘lanish</a>` : ''}
            <div class="action-buttons">
                <button class="view-btn" onclick="window.location.href='${frontUrl}/auth/pages/team-details.html?id=${member._id}'">Ko‘rish</button>
                ${isAdmin ? `
                    <button class="edit-btn" data-bs-toggle="modal" data-bs-target="#editTeamModal" data-id="${member._id}" data-name="${member.name}" data-email="${member.email || ''}" data-role="${member.role}" data-avatar="${member.avatar || ''}" data-hobbi="${member.hobbi || ''}">Tahrirlash</button>
                    <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteTeamModal" data-id="${member._id}">O‘chirish</button>
                ` : ''}
            </div>
        `;

        teamGrid.appendChild(card);
    });

    // Re-initialize AOS for new elements
    AOS.refresh();
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // Fetch user info
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const user = userResponse.data;
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        const isAdmin = user.role === 'admin';

        // Show add member button for admins
        if (isAdmin) {
            document.getElementById('add-member-nav').style.display = 'inline-block';
        }

        // Fetch team list
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, isAdmin);

    } catch (error) {
        showToast(error.response?.data?.error || 'Jamoa maʼlumotlarini olishda xatolik yuz berdi', 'error');
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear();
            window.location.href = `${frontUrl}/pages/login.html`;
        }
    }
});

// Add team member form submission
document.getElementById('team-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const submitBtn = document.getElementById('add-member-btn');
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTeamModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // Show loader
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    // Get form values
    const name = document.getElementById('team-name').value.trim();
    const login = document.getElementById('team-login').value.trim();
    const password = document.getElementById('team-password').value.trim();
    const email = document.getElementById('team-email').value.trim();
    const role = document.getElementById('team-role').value;
    const avatar = document.getElementById('team-avatar').value.trim();
    const hobbi = document.getElementById('team-hobbi').value.trim();

    // Validate required fields
    if (!name || !login || !password || !hobbi) {
        showToast('Ism, login, parol va kasb majburiy maydonlar hisoblanadi', 'error');
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        return;
    }

    try {
        // Add new team member
        await axios.post(`${apiUrl}/api/team/add`, {
            name,
            login,
            password,
            email,
            role,
            avatar,
            hobbi
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Fetch updated team list
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Hide loader and modal
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        modal.hide();

        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');

        showToast('Jamoa aʼzosi muvaffaqiyatli qo‘shildi', 'success');
        document.getElementById('team-form').reset();
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini qo‘shishda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosi qo‘shishi mumkin', 'error');
        }
    }
});

// Edit team member form submission
document.getElementById('edit-team-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const submitBtn = document.getElementById('edit-member-btn');
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTeamModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // Show loader
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    // Get form values
    const id = document.getElementById('edit-team-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const role = document.getElementById('edit-role').value;
    const avatar = document.getElementById('edit-avatar').value.trim();
    const hobbi = document.getElementById('edit-hobbi').value.trim();

    // Validate required fields
    if (!name || !hobbi) {
        showToast('Ism va kasb majburiy maydonlar hisoblanadi', 'error');
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        return;
    }

    try {
        // Update team member
        await axios.put(`${apiUrl}/api/team/${id}`, {
            name,
            email,
            role,
            avatar,
            hobbi
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Fetch updated team list
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Hide loader and modal
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        modal.hide();

        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');
        showToast('Jamoa aʼzosi muvaffaqiyatli tahrirlandi', 'success');
        document.getElementById('edit-team-form').reset();
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini tahrirlashda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosini tahrirlashi mumkin', 'error');
        }
    }
});

// Populate edit modal with team member data
document.getElementById('team-grid')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const button = e.target;
        document.getElementById('edit-team-id').value = button.dataset.id;
        document.getElementById('edit-name').value = button.dataset.name;
        document.getElementById('edit-email').value = button.dataset.email;
        document.getElementById('edit-role').value = button.dataset.role;
        document.getElementById('edit-avatar').value = button.dataset.avatar;
        document.getElementById('edit-hobbi').value = button.dataset.hobbi;
    }
});

// Delete team member
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTeamModal'));

    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    const id = document.getElementById('delete-team-id').value;

    try {
        // Delete team member
        await axios.delete(`${apiUrl}/api/team/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Fetch updated team list
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Hide modal
        modal.hide();

        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');
        showToast('Jamoa aʼzosi muvaffaqiyatli o‘chirildi', 'success');
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini o‘chirishda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosini o‘chirishi mumkin', 'error');
        }
    }
});

// Populate delete modal with team member ID
document.getElementById('team-grid')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const button = e.target;
        document.getElementById('delete-team-id').value = button.dataset.id;
    }
});