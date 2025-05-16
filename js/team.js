import { apiUrl } from './urls.js';
import { notifyLoadComplete } from './loader.js';

document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('team-gallery');

    try {
        const response = await fetch(`${apiUrl}/api/team`, {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Xatolik yuz berdi');

        let members = await response.json();

        // MongoDB ObjectId ichidan sana olish funktsiyasi (ID asosida yaratilgan vaqt)
        const getDateFromObjectId = (id) => new Date(parseInt(id.substring(0, 8), 16) * 1000);

        // 1. Admin emaslarni filter qilamiz
        members = members.filter(member => member.role !== 'admin');
        // 2. Oxirgi qo‘shilganlarga qarab saralaymiz (ObjectId'dan sana chiqarib solishtiramiz)
        members.sort((a, b) => getDateFromObjectId(b._id) - getDateFromObjectId(a._id));
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

        // Notify loader that team data is loaded successfully
        notifyLoadComplete('team', true);
    } catch (err) {
        console.error('Teamni yuklashda xatolik:', err);
        gallery.innerHTML = '<p>Jamoa ma’lumotlarini olishda xatolik yuz berdi.</p>';
        // Notify loader that team data failed to load
        notifyLoadComplete('team', false);
    }
});