import { frontUrl } from './urls.js';

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelector(".nav-links");

    // Avval eski login linkni topamiz va o‘chirib tashlaymiz
    const oldAuthLink = [...navLinks.children].find(li =>
        li.textContent.trim() === "Login"
    );

    if (oldAuthLink) oldAuthLink.remove();

    // Tokenni localStorage’dan tekshiramiz
    const token = localStorage.getItem("token");

    // Yangi <li> element yaratamiz
    const authLi = document.createElement("li");
    const authLink = document.createElement("a");

    if (token) {
        // Token bo‘lsa — Dashboard ko‘rsatamiz
        authLink.href = `${frontUrl}/auth/pages/dashboard.html`;
        authLink.textContent = "Dashboard";
    } else {
        // Token bo‘lmasa — Login ko‘rsatamiz
        authLink.href = `${frontUrl}/auth/login/Login.html`;
        authLink.textContent = "Login";
    }

    authLi.appendChild(authLink);
    navLinks.appendChild(authLi);
});
