// 1. Kerakli manzillarni yuklaymiz
// apiUrl server bilan bog‘lanish uchun (masalan, http://localhost:5000)
// frontUrl saytning asosiy manzili uchun (masalan, http://localhost:3000)
import { apiUrl, frontUrl } from '../../js/urls.js';

// 2. Xabar (toast) ko‘rsatish funksiyasi
// Muvaffaqiyat yoki xatolik xabarlarini 5 soniya davomida ko‘rsatadi
function showToast(message, type = 'success') {
    // 3. Toast elementlarini HTML’dan topamiz
    const toast = document.getElementById('notificationToast'); // Toast konteyneri
    const toastTitle = document.getElementById('toast-title'); // Toast sarlavhasi
    const toastMessage = document.getElementById('toast-message'); // Toast xabari

    // 4. Toast sarlavhasini sozlaymiz: muvaffaqiyat yoki xatolik
    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    // 5. Xabar matnini joylashtiramiz
    toastMessage.textContent = message;
    // 6. Toast uslubini o‘zgartiramiz (yashil yoki qizil)
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    // 7. Bootstrap Toast’ni ishga tushiramiz (5 soniya ko‘rinadi)
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// 8. Forma xatolarini ko‘rsatish funksiyasi
// Xatolik xabarini belgilangan div’da 5 soniya ko‘rsatadi
function showError(message, elementId = 'edit-form-error-message') {
    // 9. Xabar ko‘rsatiladigan div’ni topamiz
    const errorDiv = document.getElementById(elementId);
    // 10. Xabar matnini yozamiz
    errorDiv.textContent = message;
    // 11. Div’ni ko‘rinadigan qilamiz
    errorDiv.style.display = 'block';
    // 12. 5 soniyadan so‘ng yashiramiz
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// 13. Jamoa a’zosining ma’lumotlarini sahifada ko‘rsatish funksiyasi
function renderTeamDetails(teamMember, userRole) {
    // 14. Ma’lumotlar ko‘rsatiladigan div’ni topamiz
    const teamDetails = document.getElementById('member-details');
    // 15. Avvalgi ma’lumotlarni tozalaymiz
    teamDetails.innerHTML = '';

    // 16. Avatar HTML’ni tayyorlaymiz
    const avatarHtml = teamMember.avatar ? `
        <img src="${teamMember.avatar}" alt="${teamMember.name || 'Avatar'}" class="avatar-img" style="max-width: 200px; border-radius: 50%;">
    ` : '<p>Avatar yo‘q</p>';

    // 17. A’zo ma’lumotlarini HTML sifatida joylashtiramiz
    teamDetails.innerHTML = `
        ${avatarHtml} <!-- A’zo rasmi yoki “yo‘q” xabari -->
        <h2>${teamMember.name || 'Noma’lum'}</h2> <!-- A’zo ismi -->
        <p><strong>Login:</strong> ${teamMember.login || 'Yo‘q'}</p> <!-- Login -->
        <p><strong>Email:</strong> ${teamMember.email || 'Yo‘q'}</p> <!-- Email -->
        <p><strong>Rol:</strong> ${teamMember.role || 'Yo‘q'}</p> <!-- Rol -->
        <p><strong>Kasb:</strong> ${teamMember.hobbi || 'Yo‘q'}</p> <!-- Kasb -->
        <div class="meta">
            Qo‘shgan: <span class="author">${teamMember.createdBy?.name || 'Noma’lum'}</span>, 
            Sana: ${teamMember.createdAt ? new Date(teamMember.createdAt).toLocaleDateString() : 'Yo‘q'}
        </div> <!-- Qo‘shgan odam va sana -->
    `;

    // 18. Agar foydalanuvchi admin bo‘lsa, tahrirlash/o‘chirish tugmalarini ko‘rsatamiz
    if (userRole === 'admin') {
        document.getElementById('admin-actions').style.display = 'flex';
        // 19. Tahrirlash va o‘chirish formalari uchun ID’ni joylashtiramiz
        document.getElementById('edit-team-id').value = teamMember._id || '';
        document.getElementById('delete-team-id').value = teamMember._id || '';
    }
}

// 20. Tahrirlash modalini ma’lumotlar bilan to‘ldirish funksiyasi
function populateEditModal(teamMember) {
    // 21. Forma maydonlarini a’zo ma’lumotlari bilan to‘ldiramiz
    document.getElementById('edit-team-id').value = teamMember._id || '';
    document.getElementById('edit-name').value = teamMember.name || '';
    document.getElementById('edit-email').value = teamMember.email || '';
    document.getElementById('edit-role').value = teamMember.role || 'user';
    document.getElementById('edit-avatar').value = teamMember.avatar || '';
    document.getElementById('edit-hobbi').value = teamMember.hobbi || '';
}

// 22. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // 23. Foydalanuvchi tokenini olamiz
    const token = localStorage.getItem('token');
    // 24. URL’dan jamoa a’zosining ID’sini olamiz
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    // 25. Agar token bo‘lmasa, login sahifasiga yo‘naltiramiz
    if (!token) {
        showToast('Tizimga kirish talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/login.html`;
        return;
    }

    // 26. Agar a’zo ID’si bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!teamId) {
        showToast('Jamoa a’zosi ID topilmadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
        return;
    }

    try {
        // 27. Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` }, // Tokenni yuboramiz
            withCredentials: true // Cookie’lar bilan
        });

        // 28. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = userResponse.data;
        // 29. Sarlavhadagi foydalanuvchi nomini ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // 30. Foydalanuvchi rolini saqlaymiz
        localStorage.setItem('userRole', user.role);

        // 31. Jamoa a’zosining ma’lumotlarini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 32. Agar ma’lumotlar topilmasa, xatolik chiqaramiz
        if (!teamResponse.data) {
            throw new Error('Jamoa a’zosi ma’lumotlari topilmadi');
        }

        // 33. A’zo ma’lumotlarini sahifada ko‘rsatamiz
        renderTeamDetails(teamResponse.data, user.role);
        // 34. Admin bo‘lsa, tahrirlash modalini to‘ldiramiz
        if (user.role === 'admin') {
            populateEditModal(teamResponse.data);
        }
    } catch (error) {
        // 35. Xatolik bo‘lsa, konsolga yozamiz
        console.error('Error fetching team member:', error);
        // 36. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini olishda xato yuz berdi';
        showToast(errorMessage, 'error');

        // 37. Xato turiga qarab harakat qilamiz
        if (error.response) {
            if (error.response.status === 401) {
                // 38. Token eskirgan bo‘lsa, login sahifasiga yo‘naltiramiz
                showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
                localStorage.clear();
                window.location.href = `${frontUrl}/auth/pages/login.html`;
            } else if (error.response.status === 404) {
                // 39. A’zo topilmasa, jamoa sahifasiga yo‘naltiramiz
                showToast('Jamoa a’zosi topilmadi', 'error');
                window.location.href = `${frontUrl}/auth/pages/team.html`;
            } else if (error.response.status === 403) {
                // 40. Ruxsat bo‘lmasa, jamoa sahifasiga yo‘naltiramiz
                showToast('Bu amalni bajarish uchun ruxsat yo’q', 'error');
                window.location.href = `${frontUrl}/auth/pages/team.html`;
            }
        }
    }
});

// 41. Jamoa a’zosini tahrirlash formasini boshqarish
document.getElementById('edit-team-form')?.addEventListener('submit', async (e) => {
    // 42. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 43. Token va a’zo ID’sini olamiz
    const token = localStorage.getItem('token');
    const teamId = document.getElementById('edit-team-id').value;
    // 44. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTeamModal'));

    // 45. Token yoki ID bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token || !teamId) {
        showToast('Tizimga kirish yoki jamoa a’zosi ID talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
        return;
    }

    // 46. Forma maydonlaridagi ma’lumotlarni olamiz
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const role = document.getElementById('edit-role').value;
    const avatar = document.getElementById('edit-avatar').value.trim();
    const hobbi = document.getElementById('edit-hobbi').value.trim();

    // 47. Majburiy maydonlarni tekshiramiz
    if (!name || !hobbi) {
        showError('Ism va kasb majburiy', 'edit-form-error-message');
        return;
    }

    try {
        // 48. Serverga yangilangan ma’lumotlarni yuboramiz
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

        // 49. Yangilangan a’zo ma’lumotlarini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 50. Modalni yashiramiz
        modal.hide();
        // 51. Sahifani yangilangan ma’lumotlar bilan to‘ldiramiz
        renderTeamDetails(teamResponse.data, localStorage.getItem('userRole') || 'user');
        // 52. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Jamoa a’zosi muvaffaqiyatli yangilandi');
    } catch (error) {
        // 53. Xatolik bo‘lsa, konsolga yozamiz
        console.error('Error updating team member:', error);
        // 54. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini yangilashda xato';
        showError(errorMessage, 'edit-form-error-message');
        // 55. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showError('Faqat adminlar jamoa a’zosini tahrirlashi mumkin', 'edit-form-error-message');
        }
    }
});

// 56. Jamoa a’zosini o‘chirish
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    // 57. Token va a’zo ID’sini olamiz
    const token = localStorage.getItem('token');
    const teamId = document.getElementById('delete-team-id').value;
    // 58. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTeamModal'));

    // 59. Token yoki ID bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token || !teamId) {
        showToast('Tizimga kirish yoki jamoa a’zosi ID talab qilinadi', 'error');
        window.location.href = `${frontUrl}/auth/pages/error.html`;
        return;
    }

    try {
        // 60. Serverga a’zoni o‘chirish so‘rovini yuboramiz
        await axios.delete(`${apiUrl}/api/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 61. Modalni yashiramiz
        modal.hide();
        // 62. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Jamoa a’zosi muvaffaqiyatli o‘chirildi');
        // 63. Jamoa ro‘yxati sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/auth/pages/team.html`;
    } catch (error) {
        // 64. Xatolik bo‘lsa, konsolga yozamiz
        console.error('Error deleting team member:', error);
        // 65. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa a’zosini o‘chirishda xato';
        showToast(errorMessage, 'error');
        // 66. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat adminlar jamoa a’zosini o‘chirishi mumkin', 'error');
        }
    }
});