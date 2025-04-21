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
signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#signin-username").value;
  const password = document.querySelector("#signin-password").value;
  const userType = new URLSearchParams(window.location.search).get('type') || 'user';

  // Clear any previous error messages
  const errorMessage = document.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }

  try {
    console.log("Attempting to sign in user:", username);
    const response = await fetch("http://localhost:3000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, userType }),
    });

    const data = await response.json();
    console.log("Server response:", data);
    
    if (response.ok && data.success) {
      // Store user type in session storage
      sessionStorage.setItem('userType', data.userType);
      sessionStorage.setItem('username', username);
      
      alert("Login successful!");
      window.location.href = data.redirect;
    } else {
      // Show specific error message based on error type
      let errorElement = document.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        signInForm.appendChild(errorElement);
      }

      errorElement.textContent = data.message;
      errorElement.style.display = 'block';
      errorElement.style.color = 'red';
      errorElement.style.marginTop = '10px';
      errorElement.style.padding = '10px';
      errorElement.style.borderRadius = '5px';
      errorElement.style.backgroundColor = '#ffebee';

      // Clear password field for security
      document.querySelector("#signin-password").value = '';

      // If username not found, suggest signing up
      if (data.errorType === 'username_not_found') {
        const signUpLink = document.createElement('a');
        signUpLink.href = 'loginSignin.html?type=' + userType;
        signUpLink.textContent = ' Sign up here';
        signUpLink.style.color = 'blue';
        signUpLink.style.textDecoration = 'underline';
        errorElement.appendChild(signUpLink);
      }
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    const errorElement = document.querySelector('.error-message') || document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = "An error occurred. Please try again later.";
    errorElement.style.display = 'block';
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '10px';
    errorElement.style.padding = '10px';
    errorElement.style.borderRadius = '5px';
    errorElement.style.backgroundColor = '#ffebee';
    signInForm.appendChild(errorElement);
  }
});
