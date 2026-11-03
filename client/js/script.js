document.addEventListener("DOMContentLoaded", function () {
  console.log("Welcome to BlogSpace!");

  const startButtons = document.querySelectorAll(
    'a[href="register.html"]'
  );

  startButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      console.log("User clicked Get Started");
    });
  });

  loadHomeBlogs();
});

async function loadHomeBlogs() {
  const blogsContainer = document.getElementById("homeBlogsContainer");

  if (!blogsContainer) return;

  try {
    const result = await apiRequest("/blogs");
    const blogs = getBlogArray(result);

    if (blogs.length === 0) {
      blogsContainer.innerHTML = "<p>No blogs available yet.</p>";
      return;
    }

    blogsContainer.innerHTML = blogs.map(function (blog) {
      const image = blog.imageUrl
        ? escapeHTML(blog.imageUrl)
        : "https://placehold.co/600x400?text=BlogSpace";

      const title = escapeHTML(blog.title || "Untitled Blog");
      const content = escapeHTML(blog.content || "");

      return `
        <div class="blog-card">
          <img src="${image}" alt="${title}"
               onerror="this.src='https://placehold.co/600x400?text=BlogSpace'">

          <div class="blog-card-content">
            <h3>${title}</h3>
            <p>${content.substring(0, 120)}...</p>
            <a href="blog-details.html?id=${encodeURIComponent(blog._id)}">
              Read More
            </a>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error loading home blogs:", error);
    blogsContainer.innerHTML =
      "<p>Unable to load blogs. Please try again later.</p>";
  }
}
