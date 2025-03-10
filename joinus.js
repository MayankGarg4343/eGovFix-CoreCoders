document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const submitButton = form.querySelector("button[type='submit']"); // Get submit button

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent default form submission

        const formData = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            company: document.getElementById("company").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        // Validate required fields
        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            alert("❌ Please fill in all required fields.");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("❌ Please enter a valid email address.");
            return;
        }

        // Validate phone number (only digits, min 10 characters)
        const phoneRegex = /^[0-9]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("❌ Please enter a valid phone number (at least 10 digits).");
            return;
        }

        try {
            // Disable the submit button and show loading
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";

            const response = await fetch("http://localhost:3000/become_partner", { // Ensure correct backend URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit form");
            }

            alert("✅ " + data.message); // Show success message

            // Reset form fields after successful submission
            form.reset();

            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = "dashboard.html"; 
            }, 1000); // 1-second delay before redirecting
        } catch (error) {
            console.error("Error:", error);
            alert("⚠️ " + error.message);
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.textContent = "Submit";
        }
    });
});
