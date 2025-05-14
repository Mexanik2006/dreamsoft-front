document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('team-gallery');

    try {
        const response = await fetch('http://localhost:2021/api/team', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Xatolik yuz berdi');

        let members = await response.json();

        // 1. Admin emaslarni filter qilamiz
        members = members.filter(member => member.role !== 'admin');

        // 2. Oxirgi qo‘shilganlar bo‘yicha saralaymiz (createdAt mavjud bo‘lishi kerak)
        members.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // 3. Faqat oxirgi 4 ta a’zoni olamiz
        members = members.slice(0, 4);

        // 4. Ekranga chiqaramiz
        members.forEach((member, index) => {
            const div = document.createElement('div');
            div.className = 'employee-image';
            div.setAttribute('data-aos', 'zoom-in-left');
            div.setAttribute('data-aos-offset', `${300 + index * 100}`);
            div.setAttribute('data-aos-easing', 'ease-in-sine');

            const avatarUrl = member.avatar || 'img/default-avatar.jpg';

            div.style.backgroundImage = `url(${avatarUrl})`;

            div.innerHTML = `
    <div class="employee-info">
        <h1>${member.name}</h1>
        <p>${member.hobbi}</p>
    </div>
    `;

            gallery.appendChild(div);
        });
    } catch (err) {
        console.error('Teamni yuklashda xatolik:', err);
        gallery.innerHTML = '<p>Jamoa ma’lumotlarini olishda xatolik yuz berdi.</p>';
    }
});
