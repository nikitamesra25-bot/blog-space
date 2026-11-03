const API_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Cannot connect to server. Please start your backend.");
    }

    throw error;
  }
}

function requireLogin() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return false;
  }

  return true;
}

function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, function (char) {
    const characters = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return characters[char];
  });
}

function getBlogArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.blogs)) return result.blogs;
  if (Array.isArray(result.data)) return result.data;
  return [];
}

function getBlogObject(result) {
  return result.blog || result.data || result;
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutUser);
  }
});