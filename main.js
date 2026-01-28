const API = "http://localhost:3001";

/* ================= POSTS ================= */

async function createPost() {
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();
    if (!title || !body) return alert("Không được để trống");

    const res = await fetch(`${API}/posts`);
    const posts = await res.json();
    const maxId = posts.length ? Math.max(...posts.map(p => Number(p.id))) : 0;

    await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: String(maxId + 1),
            title,
            body,
            isDeleted: false
        })
    });

    loadPosts();
}

async function loadPosts() {
    const res = await fetch(`${API}/posts`);
    const posts = await res.json();

    const list = document.getElementById("post-list");
    list.innerHTML = "";

    posts.forEach(p => {
        list.innerHTML += `
            <div class="card mb-2 ${p.isDeleted ? 'text-decoration-line-through text-muted' : ''}">
                <div class="card-body">
                    <h5>${p.title}</h5>
                    <p>${p.body}</p>
                    <button class="btn btn-danger btn-sm" onclick="softDeletePost('${p.id}')">Xoá mềm</button>
                </div>
            </div>
        `;
    });
}

async function softDeletePost(id) {
    await fetch(`${API}/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });
    loadPosts();
}

/* ================= COMMENTS ================= */

async function createComment() {
    const input = document.getElementById("comment-input");
    const content = input.value.trim();
    if (!content) return alert("Comment rỗng");

    const res = await fetch(`${API}/comments`);
    const comments = await res.json();
    const maxId = comments.length ? Math.max(...comments.map(c => Number(c.id))) : 0;

    await fetch(`${API}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: String(maxId + 1),
            content,
            isDeleted: false
        })
    });

    input.value = "";
    loadComments();
}

async function loadComments() {
    const res = await fetch(`${API}/comments`);
    const comments = await res.json();

    const list = document.getElementById("comment-list");
    list.innerHTML = "";

    comments.forEach(c => {
        list.innerHTML += `
            <div class="alert alert-secondary d-flex justify-content-between
                ${c.isDeleted ? 'text-decoration-line-through text-muted' : ''}">
                ${c.content}
                <div>
                    <button class="btn btn-warning btn-sm" onclick="editComment('${c.id}')">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteComment('${c.id}')">Xoá mềm</button>
                </div>
            </div>
        `;
    });
}

async function editComment(id) {
    const content = prompt("Nội dung mới:");
    if (!content) return;

    await fetch(`${API}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
    });

    loadComments();
}

async function deleteComment(id) {
    await fetch(`${API}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDeleted: true })
    });

    loadComments();
}

/* INIT */
loadPosts();
loadComments();
