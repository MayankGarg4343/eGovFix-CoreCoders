const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signUpForm = document.querySelector("#sign-up-form");
const signInForm = document.querySelector("#sign-in-form");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

// Handle Sign Up
signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#signup-username").value;
  const password = document.querySelector("#signup-password").value;
  const date = document.querySelector("#signup-date").value;
  const aadhar = document.querySelector("#signup-aadhar").value;
  const phone = document.querySelector("#signup-phone").value;

  const response = await fetch("http://localhost:3000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, date, aadhar, phone }),
  });

  const data = await response.json();
  alert(data.message);
});

// Handle Sign In
signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#signin-username").value;
  const password = document.querySelector("#signin-password").value;

  const response = await fetch("http://localhost:3000/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Login successful!");
    window.location.href = "landing.html"; // Redirect to landing page
  } else {
    alert(data.message);
  }
});
