/*===== MENU SHOW Y HIDDEN =====*/
const navMenu = document.getElementById('nav-menu'),
    toggleMenu = document.getElementById('nav-toggle'),
    closeMenu = document.getElementById('nav-close')

// SHOW
toggleMenu.addEventListener('click', ()=>{
    navMenu.classList.toggle('show')
})

// HIDDEN
closeMenu.addEventListener('click', ()=>{
    navMenu.classList.remove('show')
})

/*===== MOUSEMOVE HOME IMG =====*/
document.addEventListener('mousemove', move);
function move(e){
    this.querySelectorAll('.move').forEach(layer =>{
        const speed = layer.getAttribute('data-speed')

        const x = (window.innerWidth - e.pageX*speed)/120
        const y = (window.innerHeight - e.pageY*speed)/120

        layer.style.transform = `translateX(${x}px) translateY(${y}px)`
    })
}

/*===== FETCH USER DATA =====*/
document.addEventListener("DOMContentLoaded", async () => {
    const homeTitle = document.querySelector(".home__title");
    const logoutBtn = document.querySelector(".nav__link[href='#contact']");

    // Fetch user data from session/local storage or backend
    const response = await fetch("http://localhost:3000/user", { method: "GET", credentials: "include" });
    const data = await response.json();
    
    if (response.ok) {
        homeTitle.innerHTML = `Welcome, <br> ${data.username}`;
    } else {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html"; // Redirect to login page
    }

    // Logout functionality
    logoutBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        await fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" });
        window.location.href = "index.html"; // Redirect to login page
    });
});

/*===== GSAP ANIMATION =====*/
// NAV
gsap.from('.nav__logo, .nav__toggle', {opacity: 0, duration: 1, delay:2, y: 10})
gsap.from('.nav__item', {opacity: 0, duration: 1, delay: 2.1, y: 30, stagger: 0.2,})

// HOME
gsap.from('.home__title', {opacity: 0, duration: 1, delay:1.6, y: 30})
gsap.from('.home__description', {opacity: 0, duration: 1, delay:1.8, y: 30})
gsap.from('.home__button', {opacity: 0, duration: 1, delay:2.1, y: 30})
gsap.from('.home__img', {opacity: 0, duration: 1, delay:1.3, y: 30})


//logout 

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();

            try {
                const response = await fetch("/logout", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    console.log("Logout successful");

                    // Clear local storage and session storage
                    sessionStorage.clear();
                    localStorage.clear();

                    // Redirect to login page
                    window.location.href = "index.html";
                } else {
                    console.error("Logout failed:", response.statusText);
                }
            } catch (error) {
                console.error("Error during logout:", error);
            }
        });
    }
});

