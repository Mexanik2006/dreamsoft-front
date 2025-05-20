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

    // 4. Toast sarlavhasini va uslubini sozlaymiz
    // Muvaffaqiyat uchun "Muvaffaqiyat", xatolik uchun "Xatolik" yoziladi
    toastTitle.textContent = type === 'success' ? 'Muvaffaqiyat' : 'Xatolik';
    // 5. Xabar matnini joylashtiramiz
    toastMessage.textContent = message;
    // 6. Toast uslubini o‘zgartiramiz (yashil yoki qizil)
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;

    // 7. Bootstrap Toast’ni ishga tushiramiz (5 soniya ko‘rinadi)
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
}

// 8. Jamoa a’zolarini sahifada ko‘rsatish funksiyasi
// Jamoa ro‘yxatini kartalar shaklida joylashtiradi
function renderTeamMembers(teamMembers, isAdmin) {
    // 9. Jamoa ro‘yxati uchun grid elementini topamiz
    const teamGrid = document.getElementById('team-grid');
    // 10. Avvalgi ma’lumotlarni tozalaymiz
    teamGrid.innerHTML = '';
    // 11. Grid uslubini sozlaymiz (kartalar tartibi uchun)
    teamGrid.style.display = 'grid';
    teamGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    teamGrid.style.gap = '20px';

    // 12. Agar jamoa a’zolari bo‘lmasa, xabar ko‘rsatamiz
    if (teamMembers.length === 0) {
        teamGrid.innerHTML = '<p class="text-center">Hozircha jamoa a\'zolari yo‘q.</p>';
        return;
    }

    // 13. Har bir a’zo uchun karta yaratamiz
    teamMembers.forEach((member, index) => {
        // 14. Yangi karta div’ini yaratamiz
        const card = document.createElement('div');
        card.className = 'team-card'; // Karta uslubi uchun klass
        // 15. AOS animatsiyasini qo‘shamiz (pastdan yuqoriga)
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${index * 100}`); // Har bir karta kechiktirib kiradi

        // 16. Karta ichidagi ma’lumotlarni HTML sifatida joylashtiramiz
        card.innerHTML = `
            <img src="${member.avatar || '../img/user-placeholder.jpg'}" alt="${member.name}"> <!-- A’zo rasmi -->
            <h3>${member.name || 'Nomaʼlum'}</h3> <!-- A’zo ismi -->
            <div class="role">${member.role || 'Jamoa aʼzosi'}</div> <!-- A’zo roli -->
            <p>${member.hobbi || 'Kasb yo‘q'}</p> <!-- A’zo kasbi -->
            <p>${member.email || 'Email yo‘q'}</p> <!-- A’zo emaili -->
            <div class="created-by">Qo‘shgan: ${member.createdBy?.name || 'Nomaʼlum'}</div> <!-- Kim qo‘shgani -->
            ${member.email ? `<a href="mailto:${member.email}" class="email">Bog‘lanish</a>` : ''} <!-- Email havolasi -->
            <div class="action-buttons">
                <button class="view-btn" onclick="window.location.href='${frontUrl}/auth/pages/team-details.html?id=${member._id}'">Ko‘rish</button> <!-- Tafsilotlar sahifasiga havola -->
                ${isAdmin ? `
                    <button class="edit-btn" data-bs-toggle="modal" data-bs-target="#editTeamModal" data-id="${member._id}" data-name="${member.name}" data-email="${member.email || ''}" data-role="${member.role}" data-avatar="${member.avatar || ''}" data-hobbi="${member.hobbi || ''}">Tahrirlash</button> <!-- Tahrirlash tugmasi -->
                    <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#deleteTeamModal" data-id="${member._id}">O‘chirish</button> <!-- O‘chirish tugmasi -->
                ` : ''} <!-- Admin bo‘lmasa tugmalar ko‘rinmaydi -->
            </div>
        `;

        // 17. Kartani grid’ga qo‘shamiz
        teamGrid.appendChild(card);
    });

    // 18. AOS animatsiyalarini yangi elementlar uchun qayta ishga tushiramiz
    AOS.refresh();
}

// 19. Sahifa to‘liq yuklanganda ishga tushadigan kod
document.addEventListener('DOMContentLoaded', async () => {
    // 20. Foydalanuvchi tizimga kirganligini tekshiramiz
    const token = localStorage.getItem('token');

    // 21. Agar token bo‘lmasa, foydalanuvchi tizimga kirmagan
    if (!token) {
        // 22. Xato sahifasiga yo‘naltiramiz
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    try {
        // 23. Foydalanuvchi ma’lumotlarini serverdan olamiz
        const userResponse = await axios.post(`${apiUrl}/api/get`, {}, {
            headers: { Authorization: `Bearer ${token}` }, // Tokenni yuboramiz
            withCredentials: true // Cookie’lar bilan
        });

        // 24. Foydalanuvchi ma’lumotlarini saqlaymiz
        const user = userResponse.data;
        // 25. Sarlavhadagi foydalanuvchi nomini ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';
        // 26. Foydalanuvchi admin ekanligini tekshiramiz
        const isAdmin = user.role === 'admin';

        // 27. Agar admin bo‘lsa, “A’zo qo‘shish” tugmasini ko‘rsatamiz
        if (isAdmin) {
            document.getElementById('add-member-nav').style.display = 'inline-block';
        }

        // 28. Jamoa ro‘yxatini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 29. Admin bo‘lmagan a’zolarni tanlaymiz
        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        // 30. Jamoa a’zolarini sahifada ko‘rsatamiz
        renderTeamMembers(nonAdmins, isAdmin);

    } catch (error) {
        // 31. Xatolik bo‘lsa, xabar ko‘rsatamiz
        showToast(error.response?.data?.error || 'Jamoa maʼlumotlarini olishda xatolik yuz berdi', 'error');
        // 32. 401 xatosi bo‘lsa, token eskirgan
        if (error.response && error.response.status === 401) {
            showToast('Sessiya tugagan. Iltimos, qayta tizimga kiring.', 'error');
            localStorage.clear(); // Tokenni o‘chiramiz
            window.location.href = `${frontUrl}/auth/pages/login.html`; // Login sahifasiga yo‘naltiramiz
        }
    }
});

// 33. Yangi jamoa a’zosini qo‘shish formasini boshqarish
document.getElementById('team-form')?.addEventListener('submit', async (e) => {
    // 34. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 35. Tokenni olamiz
    const token = localStorage.getItem('token');
    // 36. Forma tugmasini topamiz
    const submitBtn = document.getElementById('add-member-btn');
    // 37. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTeamModal'));

    // 38. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 39. Yuklash indikatorini ko‘rsatamiz
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    // 40. Forma maydonlaridagi ma’lumotlarni olamiz
    const name = document.getElementById('team-name').value.trim();
    const login = document.getElementById('team-login').value.trim();
    const password = document.getElementById('team-password').value.trim();
    const email = document.getElementById('team-email').value.trim();
    const role = document.getElementById('team-role').value;
    const avatar = document.getElementById('team-avatar').value.trim();
    const hobbi = document.getElementById('team-hobbi').value.trim();

    // 41. Majburiy maydonlarni tekshiramiz
    if (!name || !login || !password || !hobbi) {
        showToast('Ism, login, parol va kasb majburiy maydonlar hisoblanadi', 'error');
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        return;
    }

    try {
        // 42. Serverga yangi a’zoni qo‘shish so‘rovini yuboramiz
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

        // 43. Yangilangan jamoa ro‘yxatini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 44. Yuklash indikatorini va modalni yashiramiz
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        modal.hide();

        // 45. Admin bo‘lmagan a’zolarni tanlaymiz va sahifani yangilaymiz
        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');

        // 46. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Jamoa aʼzosi muvaffaqiyatli qo‘shildi', 'success');
        // 47. Formani tozalaymiz
        document.getElementById('team-form').reset();
    } catch (error) {
        // 48. Xatolik bo‘lsa, yuklash indikatorini yashiramiz
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        // 49. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini qo‘shishda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        // 50. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosini qo‘shishi mumkin', 'error');
        }
    }
});

// 51. Jamoa a’zosini tahrirlash formasini boshqarish
document.getElementById('edit-team-form')?.addEventListener('submit', async (e) => {
    // 52. Sahifaning yangilanishini oldini olamiz
    e.preventDefault();

    // 53. Tokenni olamiz
    const token = localStorage.getItem('token');
    // 54. Forma tugmasini topamiz
    const submitBtn = document.getElementById('edit-member-btn');
    // 55. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTeamModal'));

    // 56. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 57. Yuklash indikatorini ko‘rsatamiz
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    // 58. Forma maydonlaridagi ma’lumotlarni olamiz
    const id = document.getElementById('edit-team-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const role = document.getElementById('edit-role').value;
    const avatar = document.getElementById('edit-avatar').value.trim();
    const hobbi = document.getElementById('edit-hobbi').value.trim();

    // 59. Majburiy maydonlarni tekshiramiz
    if (!name || !hobbi) {
        showToast('Ism va kasb majburiy maydonlar hisoblanadi', 'error');
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        return;
    }

    try {
        // 60. Serverga a’zo ma’lumotlarini yangilash so‘rovini yuboramiz
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

        // 61. Yangilangan jamoa ro‘yxatini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 62. Yuklash indikatorini va modalni yashiramiz
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        modal.hide();

        // 63. Admin bo‘lmagan a’zolarni tanlaymiz va sahifani yangilaymiz
        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');

        // 64. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Jamoa aʼzosi muvaffaqiyatli tahrirlandi', 'success');
        // 65. Formani tozalaymiz
        document.getElementById('edit-team-form').reset();
    } catch (error) {
        // 66. Xatolik bo‘lsa, yuklash indikatorini yashiramiz
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        // 67. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini tahrirlashda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        // 68. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosini tahrirlashi mumkin', 'error');
        }
    }
});

// 69. Tahrirlash modalini ma’lumotlar bilan to‘ldirish
document.getElementById('team-grid')?.addEventListener('click', (e) => {
    // 70. Agar “Tahrirlash” tugmasi bosilsa
    if (e.target.classList.contains('edit-btn')) {
        const button = e.target;
        // 71. Forma maydonlarini tugma ma’lumotlari bilan to‘ldiramiz
        document.getElementById('edit-team-id').value = button.dataset.id;
        document.getElementById('edit-name').value = button.dataset.name;
        document.getElementById('edit-email').value = button.dataset.email;
        document.getElementById('edit-role').value = button.dataset.role;
        document.getElementById('edit-avatar').value = button.dataset.avatar;
        document.getElementById('edit-hobbi').value = button.dataset.hobbi;
    }
});

// 72. Jamoa a’zosini o‘chirish
document.getElementById('confirm-delete-btn')?.addEventListener('click', async () => {
    // 73. Tokenni olamiz
    const token = localStorage.getItem('token');
    // 74. Modal oynasini topamiz
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteTeamModal'));

    // 75. Agar token bo‘lmasa, xato sahifasiga yo‘naltiramiz
    if (!token) {
        window.location.href = `${frontUrl}/pages/error.html`;
        return;
    }

    // 76. O‘chiriladigan a’zoning ID’sini olamiz
    const id = document.getElementById('delete-team-id').value;

    try {
        // 77. Serverga a’zoni o‘chirish so‘rovini yuboramiz
        await axios.delete(`${apiUrl}/api/team/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 78. Yangilangan jamoa ro‘yxatini serverdan olamiz
        const teamResponse = await axios.get(`${apiUrl}/api/team`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // 79. Modalni yashiramiz
        modal.hide();

        // 80. Admin bo‘lmagan a’zolarni tanlaymiz va sahifani yangilaymiz
        const nonAdmins = teamResponse.data.filter(member => member.role !== 'admin');
        renderTeamMembers(nonAdmins, localStorage.getItem('userRole') === 'admin');

        // 81. Muvaffaqiyat xabarini ko‘rsatamiz
        showToast('Jamoa aʼzosi muvaffaqiyatli o‘chirildi', 'success');
    } catch (error) {
        // 82. Xato xabarini ko‘rsatamiz
        const errorMessage = error.response?.data?.error || 'Jamoa aʼzosini o‘chirishda xatolik yuz berdi';
        showToast(errorMessage, 'error');
        // 83. 403 xatosi bo‘lsa, admin emasligini bildiradi
        if (error.response && error.response.status === 403) {
            showToast('Faqat administrator jamoa aʼzosini o‘chirishi mumkin', 'error');
        }
    }
});

// 84. O‘chirish modalini ma’lumotlar bilan to‘ldirish
document.getElementById('team-grid')?.addEventListener('click', (e) => {
    // 85. Agar “O‘chirish” tugmasi bosilsa
    if (e.target.classList.contains('delete-btn')) {
        const button = e.target;
        // 86. O‘chirish formasidagi ID maydonini to‘ldiramiz
        document.getElementById('delete-team-id').value = button.dataset.id;
    }
});