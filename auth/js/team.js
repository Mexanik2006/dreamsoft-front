// Xatolik yoki umumiy xabar ko‘rsatish funksiyasi
function showError(message, elementId = 'form-error-message') {
    const errorDiv = document.getElementById(elementId); // Xabar chiqadigan div elementini topamiz
    errorDiv.textContent = message; // Div ichidagi matnni xatolik matniga almashtiramiz
    errorDiv.classList.add('active'); // Uni ko‘rinadigan qilish uchun "active" klassini qo‘shamiz

    // 5 soniyadan keyin xabarni avtomatik yopamiz
    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

// Jamoa a’zolarini sahifada ko‘rsatish funksiyasi
function renderTeamMembers(teamMembers) {
    const teamGrid = document.getElementById('team-grid'); // Jamoa chiqadigan konteyner
    teamGrid.innerHTML = ''; // Avvalgi kontentni tozalaymiz

    if (teamMembers.length === 0) {
        // Agar hech qanday jamoa a’zosi bo‘lmasa
        showError('Jamoa a’zolari topilmadi.', 'team-grid');
        return;
    }

    // Har bir jamoa a’zosi uchun kartochka yasaymiz
    teamMembers.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = 'team-card'; // CSS orqali dizayn beriladi
        card.setAttribute('data-aos', 'fade-up'); // Animatsiya
        card.setAttribute('data-aos-delay', `${index * 100}`); // Har bir kartochka biroz kechikib chiqadi

        card.innerHTML = `
            <img src="${member.avatar || '../img/user-placeholder.jpg'}" alt="${member.name}">
            <h3>${member.name || 'Nomaʼlum'}</h3>
            <div class="role">${member.role || 'Jamoa aʼzosi'}</div>
            <p>${member.email || 'Email yo‘q'}</p>
            <div class="created-by">Qo‘shgan: ${member.createdBy?.name || 'Nomaʼlum'}</div>
            <a href="mailto:${member.email}" class="email">Bog‘lanish</a>
        `;

        teamGrid.appendChild(card); // Sahifaga kartochkani qo‘shamiz
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Kirgan foydalanuvchining tokeni

    if (!token) {
        window.location.href = 'http://127.0.0.1:5500/pages/error.html'; // Login sahifasiga yo‘naltirish
        return;
    }

    try {
        // Foydalanuvchining ma’lumotlarini olish
        const userResponse = await axios.post('http://localhost:2021/api/get', {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        const user = userResponse.data;

        // Foydalanuvchi ismini sarlavhada ko‘rsatamiz
        document.getElementById('header-user-name').textContent = user.name || 'Foydalanuvchi';

        // Agar admin bo‘lsa, jamoa qo‘shish formasi ko‘rsatiladi
        if (user.role === 'admin') {
            document.getElementById('add-team-form').classList.add('active');
        }

        // Jamoa ro‘yxatini olish
        const teamResponse = await axios.get('http://localhost:2021/api/team', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        renderTeamMembers(teamResponse.data); // Jamoani sahifaga chiqaramiz

    } catch (error) {
        showError(error.response?.data?.error || 'Jamoa maʼlumotlarini olishda xatolik yuz berdi');

        // Agar sessiya tugagan bo‘lsa
        if (error.response && error.response.status === 401) {
            alert('Sessiya tugagan. Iltimos, qayta tizimga kiring.');
            window.location.href = '../auth/login/Login.html';
        }
    }
});

// Forma topshirilganda ishlovchi hodisa
document.getElementById('team-form')?.addEventListener('submit', async (e) => {
    e.preventDefault(); // Formaning sahifani yangilashini oldini olamiz

    const token = localStorage.getItem('token'); // Tokenni olish

    if (!token) {
        window.location.href = 'http://127.0.0.1:5500/pages/error.html';
        return;
    }

    // Formadagi qiymatlarni olamiz
    const name = document.getElementById('team-name').value.trim();
    const hobbi = document.getElementById('team-hobbi').value.trim();
    const login = document.getElementById('team-login').value.trim();
    const email = document.getElementById('team-email').value.trim();
    const password = document.getElementById('team-password').value.trim();
    const role = document.getElementById('team-role').value;
    const avatar = document.getElementById('team-avatar').value.trim();

    // Majburiy maydonlar to‘ldirilmagan bo‘lsa
    if (!name || !login || !password || !hobbi) {
        showError('Ism, login, Kasb va parol majburiy maydonlar hisoblanadi');
        return;
    }

    try {
        // Serverga yangi jamoa aʼzosini yuboramiz
        await axios.post('http://localhost:2021/api/team/add', {
            name, login, email, password, role, avatar, hobbi
        }, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        // Yangilangan jamoani qayta yuklaymiz
        const teamResponse = await axios.get('http://localhost:2021/api/team', {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        renderTeamMembers(teamResponse.data); // Yangilangan ro‘yxatni chiqaramiz
        showError('Jamoa aʼzosi muvaffaqiyatli qo‘shildi'); // Xabar chiqadi

        // Formani tozalaymiz
        document.getElementById('team-form').reset();

    } catch (error) {
        // Agar xato bo‘lsa, foydalanuvchiga ko‘rsatamiz
        showError(error.response?.data?.error || 'Jamoa aʼzosini qo‘shishda xatolik yuz berdi');

        // Agar foydalanuvchi admin bo‘lmasa
        if (error.response && error.response.status === 403) {
            showError('Faqat administrator jamoa aʼzosi qo‘shishi mumkin');
        }
    }
});
