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

  try {
    console.log("Sending signup request...");
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, date, aadhar, phone }),
    });

    const data = await response.json();
    console.log("Server response:", data);
    
    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "loginSignin.html";
    } else {
      alert(data.message || "Registration failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred. Please try again later.");
  }
});

// Handle Sign In
// Assuming you have a sign-in form element and an event listener
signInForm.addEventListener("submit", async (event) => {
  // Prevent the default form submission
  event.preventDefault();

  // Get the username and password input elements
  const usernameInput = document.getElementById("signin-username"); // Assuming the ID of your username input is "signin-username"
  const passwordInput = document.getElementById("signin-password"); // Assuming the ID of your password input is "signin-password"

  // Get the values from the input fields
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Get the error message element (assuming you have one)
  const errorElement = document.getElementById("signin-error-message"); // Assuming you have an element with this ID to display errors

  // Clear any previous error messages
  if (errorElement) {
      errorElement.textContent = "";
      errorElement.style.display = "none"; // Hide the error element initially
  }

  try {
      // Send a POST request to the server's /signin route
      const response = await fetch("http://localhost:3000/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) { // Check for both response.ok and data.success
          // Sign-in was successful
          console.log("Sign-in successful:", data);

          // Redirect the user to the URL provided by the server
          if (data.redirect) {
              window.location.href = data.redirect; // Use the redirect URL from the server response
          } else {
              // Fallback redirect if no redirect URL is provided
              window.location.href = "landing.html"; // Or a default landing page
          }
      } else {
          // Sign-in failed
          console.error("Sign-in failed:", data.message);

          // Display the error message to the user
          if (errorElement) {
              errorElement.textContent = data.message || "Sign-in failed. Please try again.";
              errorElement.style.display = "block"; // Show the error element
          } else {
              alert(data.message || "Sign-in failed. Please try again.");
          }

          // Clear the password field for security
          passwordInput.value = "";

      }

  } catch (error) {
      console.error("Error during sign-in:", error);

      // Display a generic error message for network or other errors
      if (errorElement) {
          errorElement.textContent = "An error occurred. Please try again later.";
          errorElement.style.display = "block"; // Show the error element
      } else {
          alert("An error occurred. Please try again later.");
      }

      // Clear the password field for security
      passwordInput.value = "";
  }
});

