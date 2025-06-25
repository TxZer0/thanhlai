document.addEventListener("DOMContentLoaded", renderPostList);

async function renderPostList() {
    const postList = document.getElementById("post-list");
    const searchInput = document.getElementById("search");
    const categoryButtons = document.querySelectorAll(".category");

    postList.innerHTML = '<div class="loading">Loading posts...</div>';

    async function countMarkdownFiles(basePath) {
        if (basePath.includes("web_exploitation")) return 16;
        if (basePath.includes("buffer_overflow")) return 11;
        if (basePath.includes("reverse_engineering")) return 10;
        return 0;
    }

    const categories = {
        "Web Exploitation": "/thanhlai/post/web_exploitation/markdown",
        "Buffer Overflow": "/thanhlai/post/buffer_overflow/markdown",
        "Reverse Engineering": "/thanhlai/post/reverse_engineering/markdown",
    };

    let posts = {};

    for (const [category, basePath] of Object.entries(categories)) {
        const count = await countMarkdownFiles(basePath);
        posts[category] = Array.from({ length: count }, (_, i) => `${basePath}/post${i + 1}.md`);
    }


    let currentCategory = "Web Exploitation";
    if (window.location.hash) {
        const hashCategory = decodeURIComponent(window.location.hash.substring(1));
        if (posts[hashCategory]) {
            currentCategory = hashCategory;
        }
    }
    await loadPosts(currentCategory);

    async function loadPosts(selectedCategory = "Web Exploitation") {
        let sections = {};
        const filePaths = posts[selectedCategory] || [];
        const postPromises = filePaths.map(async (filePath, index) => {
            try {
                const response = await fetch(filePath);
                const text = await response.text();

                let title = "";

                if (text.startsWith("---")) {
                    const endIndex = text.indexOf("---", 3);
                    if (endIndex !== -1) {
                        const frontMatter = text.substring(3, endIndex).trim();
                        const lines = frontMatter.split("\n");
                        lines.forEach(line => {
                            const [key, ...rest] = line.split(":");
                            const value = rest.join(":").trim();
                            if (key.trim().toLowerCase() === "title") {
                                title = value;
                            }
                        });
                    }
                }

                if (!title) {
                    const headerMatch = text.match(/^#\s+(.*)/);
                    title = headerMatch ? headerMatch[1] : "Untitled";
                }

                const postDiv = document.createElement("div");
                postDiv.classList.add("post");
                const link = document.createElement("a");
                link.href = `public/html/post.html?file=${encodeURIComponent(filePath)}&category=${encodeURIComponent(selectedCategory)}`;
                link.innerHTML = `<h2>${title}</h2>`;
                postDiv.appendChild(link);

                return { index, postDiv };
            } catch (err) {
                console.error(`Error loading ${filePath}:`, err);
                return null;
            }
        });

        const resolvedPosts = await Promise.all(postPromises);

        sections[selectedCategory] = resolvedPosts
            .filter(p => p !== null)
            .sort((a, b) => a.index - b.index)
            .map(p => p.postDiv);

        renderPosts(sections);
    }

    function renderPosts(sections) {
        postList.innerHTML = "";

        for (const category in sections) {
            if (sections[category].length > 0) {
                const sectionEl = document.createElement("section");
                sectionEl.classList.add("category-section");
                const heading = document.createElement("h2");
                heading.textContent = category;
                sectionEl.appendChild(heading);
                sections[category].forEach(postEl => {
                    sectionEl.appendChild(postEl);
                });
                postList.appendChild(sectionEl);
            }
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .loading {
            text-align: center;
            padding: 20px;
            color: #00ffcc;
            font-size: 1.2em;
        }
    `;
    document.head.appendChild(style);


    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll(".post").forEach(post => {
            post.style.display = post.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
        });
    });


    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const selectedCategory = button.getAttribute("data-category");
            currentCategory = selectedCategory;
            loadPosts(selectedCategory);
        });
    });

    if (window.location.hash) {
        const hashCategory = decodeURIComponent(window.location.hash.substring(1));
        categoryButtons.forEach(button => {
            if (button.getAttribute("data-category") === hashCategory) {
                button.click();
            }
        });
    } else {
        categoryButtons.forEach(button => {
            if (button.getAttribute("data-category") === "Web Exploitation") {
                button.click();
            }
        });
    }
}
