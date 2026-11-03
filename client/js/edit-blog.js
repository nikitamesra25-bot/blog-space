document.addEventListener("DOMContentLoaded", function () {
  if (!requireLogin()) return;

  const editBlogForm = document.getElementById("editBlogForm");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const imageInput = document.getElementById("imageUrl");
  const updateBtn = document.getElementById("updateBtn");

  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    alert("Blog ID not found.");
    window.location.href = "dashboard.html";
    return;
  }

  async function loadBlog() {
    try {
      const result = await apiRequest(
        `/blogs/${encodeURIComponent(blogId)}`
      );

      const blog = getBlogObject(result);

      const currentUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      const authorId = blog.author && typeof blog.author === "object"
        ? String(blog.author._id || blog.author.id)
        : String(blog.author || "");

      const userId = currentUser
        ? String(currentUser.id || currentUser._id || "")
        : "";

      if (!userId || authorId !== userId) {
        alert("You cannot edit someone else's blog.");
        window.location.href = "dashboard.html";
        return;
      }

      titleInput.value = blog.title || "";
      contentInput.value = blog.content || "";
      imageInput.value = blog.imageUrl || "";

    } catch (error) {
      alert(error.message);
      window.location.href = "dashboard.html";
    }
  }

  loadBlog();

  editBlogForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const imageUrl = imageInput.value.trim();

    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    try {
      updateBtn.disabled = true;
      updateBtn.textContent = "Updating...";

      const result = await apiRequest(
        `/blogs/${encodeURIComponent(blogId)}`,
        "PUT",
        {
          title,
          content,
          imageUrl
        }
      );

      alert(result.message || "Blog updated successfully!");

      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
    } finally {
      updateBtn.disabled = false;
      updateBtn.textContent = "Update Blog";
    }
  });
});
