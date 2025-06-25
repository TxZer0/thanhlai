function getQueryVariable(variable) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=")
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1])
        }
    }
    return null
}

const postContent = document.getElementById("post-content")
const file = getQueryVariable("file")

async function renderPost() {
    if (file) {
        try {
            let response = await fetch(file)
            let text = await response.text()

            if (text.startsWith("---")) {
                const endIndex = text.indexOf("---", 3)
                if (endIndex !== -1) {
                    text = text.substring(endIndex + 3).trim()
                }
            }
            postContent.innerHTML = marked.parse(text)
        } catch (err) {
            postContent.innerHTML = `<p>Error loading post: ${err}</p>`
        }
    } else {
        postContent.innerHTML = `<p>No post file specified.</p>`
    }
}

renderPost()