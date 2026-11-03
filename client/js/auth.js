const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const button = registerForm.querySelector("button");

    try {
      button.disabled = true;
      button.textContent = "Creating Account...";

      const result = await apiRequest("/auth/register", "POST", {
        name,
        email,
        password
      });

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      alert("Registration successful!");

      if (result.token) {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "login.html";
      }

    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Create Account";
    }
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const button = loginForm.querySelector("button");

    try {
      button.disabled = true;
      button.textContent = "Logging In...";

      const result = await apiRequest("/auth/login", "POST", {
        email,
        password
      });

      if (!result.token) {
        throw new Error("Login response did not contain a token.");
      }

      localStorage.setItem("token", result.token);

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      alert("Login successful!");

      window.location.href = "dashboard.html";

    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
      button.textContent = "Login";
    }
  });
}