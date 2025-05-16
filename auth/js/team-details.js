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

// Error message function for form
function showError(message, elementId = 'edit-form-error-message') {
    const errorDiv = document.getElementById(elementId);
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// Render team member details
function renderTeamDetails(teamMember, userRole) {
    const teamDetails = document.getElementById('member-details'); // Corrected ID
    teamDetails.innerHTML = '';

    const avatarHtml = teamMember.avatar ? `
        <img src="${teamMember.avatar}" alt="${teamMember.name || 'Avatar'}" class="avatar-img" style="max-width: 200px; border-radius: 50%;">
    ` : '<p>Avatar yo‘q</p>';

    teamDetails.innerHTML = `
        ${avatarHtml}
        <h2>${teamMember.name || 'Noma’lum'}</h2>
        <p><strong>Login:</strong> ${teamMember.login || 'Yo‘q'}</p>
        <p><strong>Email:</strong> ${teamMember.email || 'Yo‘q'}</p>
        <p><strong>Rol:</strong> ${teamMember.role || 'Yo‘q'}</p>
        <p><strong>Kasb:</strong> ${teamMember.hobbi || 'Yo‘q'}</p>
        <div class="meta">
            Qo‘shgan: <span class="author">${teamMember.createdBy?.name || 'Noma’lum'}</span>, 
            Sana: ${teamMember.createdAt ? new Date(teamMember.createdAt).toLocaleDateString() : 'Yo‘q'}
        </div>
    `;

    if (userRole === 'admin') {
        document.getElementById('admin-actions').style.display = 'flex';
        document.getElementById('edit-team-id').value = teamMember._id || '';
        document.getElementById('delete-team-id').value = teamMember._id || '';
    }
}

// Populate edit modal
function populateEditModal(teamMember) {
    document.getElementById('edit-team-id').value = teamMember._id || '';
    document.getElementById('edit-name').value = teamMember.name || '';
    document.getElementById('edit-email').value = teamMember.email || '';
    document.getElementById('edit-role').value = teamMember.role || 'user';
    document.getElementById('edit-avatar').value = teamMember.avatar || '';
    document.getElementById('edit-hobbi').value = teamMember.hobbi || '';
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/login.html`;
        return;
    }

    if (!teamId) {
        showToast('Jamoa a’zosi ID topilmadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
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
        localStorage.setItem('userRole', user.role);

        // Fetch team member details
        const teamResponse = await axios.get(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        if (!teamResponse.data) {
            throw new Error('Jamoa a’zosi ma’lumotlari topilmadi');
        }

        renderTeamDetails(teamResponse.data, user.role);
        if (user.role === 'admin') {
            populateEditModal(teamResponse.data);
        }
    } catch (error) {
        console.error('Error fetching team member:', error);
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini olishda xato yuz berdi';
        showToast(errorMessage, 'error');

        if (error.response) {
            if (error.response.status === 401) {
                showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
                localStorage.clear();
                window.location.href = `${frontUrl}/auth/pages/login.html`;
            } else if (error.response.status === 404) {
                showToast('Jamoa a’zosi topilmadi', 'error');
                window.location.href = `${frontUrl}/auth/pages/team.html`;
            } else if (error.response.status === 403) {
                showToast('Bu amalni bajarish uchun ruxsat yo’q', 'error');
                window.location.href = `${frontUrl}/auth/pages/team.html`;
            }
        }
    }
});

// Edit team member form submission
document.getElementById('edit-team-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const teamId = document.getElementById('edit-team-id').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTeamModal'));

    if (!token || !teamId) {
        showToast('Tizimga kirish yoki jamoa a’zosi ID talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
        return;
    }

    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const role = document.getElementById('edit-role').value;
    const avatar = document.getElementById('edit-avatar').value.trim();
    const hobbi = document.getElementById('edit-hobbi').value.trim();

    if (!name || !hobbi) {
        showError('Ism va kasb majburiy', 'edit-form-error-message');
        return;
    }

    try {
        await axios.put(`${apiUrl}/api/team/${teamId}`, {
            name,
            email,
            role,
            avatar,
            hobbi
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const teamResponse = await axios.get(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        renderTeamDetails(teamResponse.data, localStorage.getItem('userRole') || 'user');
        showToast('Jamoa a’zosi muvaffaqiyatli yangilandi');
    } catch (error) {
        console.error('Error updating team member:', error);
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini yangilashda xato';
        showError(errorMessage, 'edit-form-error-message');
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar jamoa a’zosini tahrirlashi mumkin', 'edit-form-error-message');
        }
    }
});

// Delete team member
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const teamId = document.getElementById('delete-team-id').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTeamModal'));

    if (!token || !teamId) {
        showToast('Tizimga kirish yoki jamoa a’zosi ID talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
        return;
    }

    try {
        await axios.delete(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        modal.hide();
        showToast('Jamoa a’zosi muvaffaqiyatli o‘chirildi');
        window.location.href = `${frontUrl}/auth/pages/team.html`;
    } catch (error) {
        console.error('Error deleting team member:', error);
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini o‘chirishda xato';
        showToast(errorMessage, 'error');
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar jamoa a’zosini o‘chirishi mumkin', 'error');
        }
    }
});