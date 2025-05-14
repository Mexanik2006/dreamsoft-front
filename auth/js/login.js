const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('https://dreamsoft-backend.vercel.app/api/login',
            {
                login,
                password
            },
            {
                withCredentials: true // Cookie larni serverdan qabul qilish uchun shart!
            });

        if (response.data) {
            // Obyektni JSON formatida stringga aylantirish
            localStorage.setItem('token', response.data.token);
            localStorage.setItem("data", JSON.stringify(response.data.data));
        }


        // Agar muvaffaqqiyatli login bo'lsa
        alert('Muvaffaqqiyatli login qilindi!');
        window.location.href = "https://dreamsoft-front.vercel.app/auth/pages/dashboard.html"; // success page, kerak bo'lsa

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            errorDiv.innerText = error.response.data.error;
        } else {
            errorDiv.innerText = "Noma'lum xatolik!";
        }
    }
});