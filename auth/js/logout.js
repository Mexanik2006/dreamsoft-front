// Tizimdan chiqish funksiyasi
function logout() {
    // LocalStorage’dagi barcha ma’lumotlarni o‘chiramiz
    localStorage.clear();
    // Foydalanuvchiga muvaffaqiyat xabarini ko‘rsatamiz
    alert('Tizimdan muvaffaqiyatli chiqdingiz!');
    // Bosh sahifaga yo‘naltiramiz
    window.location.href = 'https://dreamsoft-front.vercel.app/index.html';
}