// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname.split("/").pop();

  // ✅ Always check current session on page load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && page === "index.html") {
      // Logged in user should go to dashboard
      window.location.href = "category.html";
    } else if (!session && page === "category.html") {
      // Not logged in but trying to access dashboard
      window.location.href = "index.html";
    }
  });

  // ✅ Also listen for future changes (handles restore after browser close)
  supabase.auth.onAuthStateChange((event, session) => {
    const page = window.location.pathname.split("/").pop();

    if (session && page === "index.html") {
      window.location.href = "category.html";
    } else if (!session && page === "category.html") {
      window.location.href = "index.html";
    }
  });

  // ✅ Handle login form submission
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // Redirect handled by onAuthStateChange
    }
  });
});
