document.addEventListener("DOMContentLoaded", function () {
  const createBlogForm = document.getElementById("createBlogForm");

  if (!createBlogForm) return;

  if (!requireLogin()) return;

  createBlogForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const imageUrl = document.getElementById("imageUrl").value.trim();

    const button = createBlogForm.querySelector("button");

    if (!title || !content) {
      alert("Please enter blog title and content.");
      return;
    }

    try {
      button.disabled = true;
      button.textContent = "Publishing...";

      const result = await apiRequest("/blogs", "POST", {
        title,
        content,
        imageUrl
      });

      alert(result.message || "Blog published successfully!");

      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Publish Blog";
    }
  });
});