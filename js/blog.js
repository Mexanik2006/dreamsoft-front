document.addEventListener("DOMContentLoaded", async () => {
    const blogContainer = document.querySelector(".blog-posts");

    try {
        const res = await fetch("https://dreamsoft-backend.vercel.app/api/blogs", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Bloglarni olishda xatolik yuz berdi");

        let blogs = await res.json();


        blogContainer.innerHTML = ""; // eski bloglarni tozalaymiz

        const latestBlogs = blogs.slice(0, 3);

        latestBlogs.forEach((blog, i) => {
            const title = blog.title?.[0]?.titleName || "No title";
            const shortTitle = title.length > 50 ? title.slice(0, 50) + "…" : title;

            const desc = blog.description?.[0]?.descriptionName || "No description";
            const shortDesc = desc.length > 100 ? desc.slice(0, 100) + "…" : desc;

            const image = blog.images?.[0]?.imagesUrl || "img/default-image.jpg";

            const date = new Date(blog.createdAt);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");

            // Har bir blog postini sizning tashlagan HTML dizaynga moslab yozamiz
            const post = document.createElement("div");
            post.className = "blog-post";
            post.setAttribute("data-aos", "fade-left");
            post.setAttribute("data-aos-offset", `${400 + i * 50}`);
            post.setAttribute("data-aos-easing", "ease-in-sine");

            post.innerHTML = `
    <div class="post-image">
        <img src="${image}" alt="" style="width: 370px; height: 307; object-fit: cover;">
            <div class="post-date">${month}/<span>${day}</span></div>
    </div>
    <div class="post-title">
        <a href="#">${shortTitle}</a>
    </div>
    <div class="post-text">
        <p>${shortDesc}</p>
    </div>
    `;

            blogContainer.appendChild(post);
        });
    } catch (err) {
        console.error("Xatolik:", err);
        blogContainer.innerHTML = "<p>Xatolik yuz berdi, bloglar yuklanmadi.</p>";
    }
});
