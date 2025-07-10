// js/auth.js

document.addEventListener("DOMContentLoaded", () => {
    const page = window.location.pathname.split("/").pop();

      // Check if user already logged in → redirect to Category page
        supabase.auth.getSession().then(({ data: { session } }) => {
            // Redirect to login if not logged in and not already on login page
                if (!session && page !== "index.html") {
                      window.location.href = "index.html";
                          }
                              // Redirect to category if logged in and on login page
                                  if (session && page === "index.html") {
                                        window.location.href = "category.html";
                                            }
                                              });

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

                                                                                        const { error } = await supabase.auth.signInWithPassword({ email, password });

                                                                                            if (error) {
                                                                                                  alert("Login failed: " + error.message);
                                                                                                      } else {
                                                                                                            window.location.href = "category.html";
                                                                                                                }
                                                                                                                  });
})