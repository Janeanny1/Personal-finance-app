// Login logic
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.token) {
    // Store token in localStorage for persistence
    localStorage.setItem("authToken", data.token);
    window.location.href = "dashboard.html";
  } else {
    alert("Login failed. Please check your credentials.");
  }
});

// Signup logic
document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;

  const res = await fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (data.message === "User created!") {
    alert("Signup successful! You can now login.");
    window.location.href = "login.html";
  } else {
    alert("Signup failed. Please try again.");
  }
});
