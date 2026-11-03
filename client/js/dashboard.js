document.addEventListener("DOMContentLoaded", function () {
  const blogsContainer = document.getElementById("blogsContainer");
  const blogDetails = document.getElementById("blogDetails");

  if (blogsContainer) {
    if (!requireLogin()) return;
    loadBlogs();
  }

  async function loadBlogs() {
    try {
      blogsContainer.innerHTML = "<p>Loading blogs...</p>";

      const result = await apiRequest("/blogs");
      const blogs = getBlogArray(result);

      if (blogs.length === 0) {
        blogsContainer.innerHTML = `
          <div class="empty-message">
            <h3>No blogs available yet.</h3>
            <p>Be the first person to share a story!</p>
            <a href="create-blog.html" class="btn">Create Blog</a>
          </div>
        `;
        return;
      }

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      blogsContainer.innerHTML = blogs.map(function (blog) {
        const title = escapeHTML(blog.title || "Untitled Blog");
        const content = escapeHTML(blog.content || "");

        const image = blog.imageUrl
          ? escapeHTML(blog.imageUrl)
          : "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600";

        const blogId = blog._id || blog.id;
        const id = encodeURIComponent(blogId);

        const shortContent = content.length > 120
          ? content.substring(0, 120) + "..."
          : content;

        const authorId = blog.author && typeof blog.author === "object"
          ? String(blog.author._id || blog.author.id)
          : String(blog.author || "");

        const userId = currentUser
          ? String(currentUser.id || currentUser._id || "")
          : "";

        const isOwner = userId && authorId === userId;

        return `
          <article class="blog-card">
            <img src="${image}" alt="${title}"
              onerror="this.src='https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600'">

            <div class="blog-card-content">
              <h3>${title}</h3>

              <p>${shortContent}</p>

              <a class="read-more"
                href="blog-details.html?id=${id}">
                Read More →
              </a>

              ${
                isOwner
                  ? `
                    <div class="blog-actions">
                      <a class="edit-btn"
                        href="edit-blog.html?id=${id}">
                        Edit Blog
                      </a>

                      <button class="delete-btn"
                        onclick="deleteBlog('${id}')">
                        Delete Blog
                      </button>
                    </div>
                  `
                  : ""
              }
            </div>
          </article>
        `;
      }).join("");

    } catch (error) {
      blogsContainer.innerHTML = `
        <p>Unable to load blogs: ${escapeHTML(error.message)}</p>
      `;
    }
  }

  if (blogDetails) {
    if (!requireLogin()) return;
    loadBlogDetails();
  }

  async function loadBlogDetails() {
    try {
      const params = new URLSearchParams(window.location.search);
      const blogId = params.get("id");

      if (!blogId) {
        blogDetails.innerHTML = "<p>Blog ID not found.</p>";
        return;
      }

      blogDetails.innerHTML = "<p>Loading blog...</p>";

      const result = await apiRequest(
        `/blogs/${encodeURIComponent(blogId)}`
      );

      const blog = getBlogObject(result);

      const title = escapeHTML(blog.title || "Untitled Blog");
      const content = escapeHTML(blog.content || "");

      const image = blog.imageUrl
        ? escapeHTML(blog.imageUrl)
        : "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900";

      const authorValue = blog.author
        ? (typeof blog.author === "object"
          ? blog.author.name
          : blog.author)
        : "Unknown Author";

      const author = escapeHTML(authorValue);

      blogDetails.innerHTML = `
        <img src="${image}" alt="${title}"
          onerror="this.src='https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900'">

        <h1>${title}</h1>

        <p class="blog-meta">Written by ${author}</p>

        <div class="blog-content">${content}</div>
      `;

    } catch (error) {
      blogDetails.innerHTML = `
        <p>Unable to load blog: ${escapeHTML(error.message)}</p>
      `;
    }
  }
});

async function deleteBlog(blogId) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this blog?"
  );

  if (!confirmDelete) return;

  try {
    const result = await apiRequest(
      `/blogs/${blogId}`,
      "DELETE"
    );

    alert(result.message || "Blog deleted successfully!");

    window.location.reload();

  } catch (error) {
    alert(error.message);
  }
}
