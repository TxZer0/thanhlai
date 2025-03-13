document.addEventListener("DOMContentLoaded", renderPostList);

async function renderPostList() {
    const postList = document.getElementById("post-list");
    const searchInput = document.getElementById("search");
    const categoryButtons = document.querySelectorAll(".category");

    postList.innerHTML = '<div class="loading">Loading posts...</div>';

    async function countMarkdownFiles(basePath, prefix = "post") {
        let count = 0;
        while (true) {
            const filePath = `${basePath}/${prefix}${count + 1}.md`;
            try {
                const response = await fetch(filePath, { method: "HEAD" });
                if (!response.ok) break;
                count++;
            } catch (error) {
                break;
            }
        }
        return count;
    }

    
    const categories = {
        "Web Exploitation": "/thanhlai/post/web_exploitation/markdown",
    };

    let posts = {};

    for (const [category, basePath] of Object.entries(categories)) {
        const count = await countMarkdownFiles(basePath);
        posts[category] = Array.from({ length: count }, (_, i) => `${basePath}/post${i + 1}.md`);
    }

    async function loadPosts() {
        let sections = {};
        let loadingPromises = [];

        for (const category in posts) {
            sections[category] = [];
            const filePaths = posts[category];

          
            const categoryPromises = filePaths.map(async filePath => {
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
                    link.href = `public/html/post.html?file=${encodeURIComponent(filePath)}`;
                    link.innerHTML = `<h2>${title}</h2>`;
                    postDiv.appendChild(link);
                    sections[category].push(postDiv);
                } catch (err) {
                    console.error(`Error loading ${filePath}:`, err);
                }
            });

            loadingPromises.push(...categoryPromises);
        }
        await Promise.all(loadingPromises);
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

    await loadPosts();

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        document.querySelectorAll(".post").forEach(post => {
            post.style.display = post.textContent.toLowerCase().includes(searchTerm) ? "block" : "none";
        });
    });

    
    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedCategory = button.getAttribute("data-category").toLowerCase();
            document.querySelectorAll(".category-section").forEach(section => {
                const sectionTitle = section.querySelector("h2").textContent.toLowerCase();
                section.style.display = sectionTitle.includes(selectedCategory) ? "block" : "none";
            });
        });
    });
}
