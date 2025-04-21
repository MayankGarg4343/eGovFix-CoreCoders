const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");
const mainContent = document.querySelector("main");

// Sidebar Click Event Listener
allSideMenu.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.preventDefault();

    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    this.parentElement.classList.add("active");

    const pageKey = this.dataset.page;
    if (pageKey && pages[pageKey]) {
      loadContent(pageKey);
    }
  });
});

// Toggle Sidebar
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

// Dark Mode Toggle
const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  document.body.classList.toggle("dark", this.checked);
});

// Page Content
const pages = {
  dashboard: `
    <div class="head-title">
      <div class="left">
        <h1>Government Web Links</h1>
        <p>Authorized government links for quick access.</p>
      </div>
    </div>
    <ul class="box-info">
      <li><a href="https://uidai.gov.in/"><img class="image" src="./img/aadhaar_card.jpg" alt="Aadhaar Card"></a></li>
      <li><a href="https://www.india.gov.in/content/aarogya-setu-app"><img class="image" src="./img/covid.png" alt="Covid Certificate"></a></li>
      <li><a href="https://parivahan.gov.in/parivahan//en/content/driving-licence-0"><img class="image" src="./img/drivinglicence.jpg" alt="Driving Licence"></a></li>
      <li><a href="https://www.incometax.gov.in/iec/foportal/"><img class="image" src="./img/incomecertificate.jpg" alt="Income Certificate"></a></li>
      <li><a href="https://nfsa.gov.in/portal/ration_card_state_portals_aa"><img class="image" src="./img/Ration-Card.jpg" alt="Ration Card"></a></li>
      <li><a href="https://parivahan.gov.in/parivahan//en/content/vehicle-registration"><img class="image" src="./img/vehicleregistration.jpg" alt="Vehicle Registration"></a></li>
    </ul>
    <div class="head-title">
      <div class="left">
        <h1>New On eGovFix </h1>
      </div>
    </div>
    <ul class="box-info">
      <li><a href="#"><img class="image" src="./img/umang.png" alt="Aadhaar Card"></a></li>
      <li><a href="#"><img class="image" src="./img/oversea.png" alt="Covid Certificate"></a></li>
      <li><a href="#"><img class="image" src="./img/apaarid.png" alt="Driving Licence"></a></li>
      <li><a href="#"><img class="image" src="./img/mp.png" alt="Income Certificate"></a></li>
      <li><a href="#"><img class="image" src="./img/corporation.png" alt="Ration Card"></a></li>
    </ul>
  `,
  uploaddocuments: `
    <div class="head-title">
      <div class="left">
        <h1>Upload Documents</h1>
        <p>Securely upload your documents to eGovFix.</p>
      </div>
    </div>
    <div class="upload-section">
      <form id="uploadForm">
        <label for="fileUpload">Select a file:</label>
        <input type="file" id="fileUpload" name="fileUpload" required>
        <button type="submit">Upload</button>
      </form>
      <p id="uploadStatus"></p>
    </div>
  `,
  issueddocuments: `
    <div class="head-title">
      <div class="left">
        <h1>Issued Documents</h1>
        <p>View your issued and verified documents.</p>
      </div>
    </div>
    <div class="issued-docs">
      <p>No issued documents found.</p>
    </div>
  `,
  drive: `
    <div class="head-title">
  <div class="left">
    <h1>Drive</h1>
    <p>Access your uploaded documents anytime.</p>
  </div>
</div>
<div class="drive-section">
  <h3>Your Documents</h3>
  <ul id="documentList"></ul>
</div>
  `,
};

// Load Default Page
function loadContent(page) {
  mainContent.innerHTML = pages[page];

  // Handle Upload Form Submission
  if (page === "uploaddocuments") {
    const uploadForm = document.getElementById("uploadForm");
    const uploadStatus = document.getElementById("uploadStatus");

    uploadForm.addEventListener("submit", function (event) {
      event.preventDefault();
      uploadStatus.innerHTML = "Uploading...";
      setTimeout(() => {
        uploadStatus.innerHTML = "File uploaded successfully!";
      }, 2000);
    });
  }
}

// Load the default page when the page loads
loadContent("dashboard");

// Handle Logout
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userType');
        window.location.href = 'register.html';
    }
});

// Check if user is logged in
window.addEventListener('load', () => {
    const userType = sessionStorage.getItem('userType');
    if (!userType || userType !== 'user') {
        window.location.href = 'loginSignin.html';
    }
});
