// SIDEBAR TOGGLE
document.querySelector('.bx-menu').addEventListener('click', () => {
	const sidebar = document.getElementById('sidebar');
	sidebar.classList.toggle('hide');

	// Adjust content margin if needed
	const content = document.getElementById('content');
	content.classList.toggle('expanded'); 
});

// ACTIVE MENU ITEM
const menuItems = document.querySelectorAll('.side-menu li');

menuItems.forEach(item => {
	item.addEventListener('click', () => {
		menuItems.forEach(i => i.classList.remove('active'));
		item.classList.add('active');
	});
});

// NOTIFICATION CLICK
document.querySelector('.notification')?.addEventListener('click', () => {
	alert('You have 3 new notifications!');
});

// LOGOUT CONFIRMATION
const logoutBtn = document.querySelector('.logout-btn');
logoutBtn?.addEventListener('click', (e) => {
	e.preventDefault();
	const confirmLogout = confirm('Are you sure you want to log out?');
	if (confirmLogout) {
		window.location.href = 'loginSignin.html';
	}
});

// DYNAMICALLY SET DASHBOARD COUNTS
document.addEventListener('DOMContentLoaded', () => {
	const docCount = document.querySelector('.card-docs p');
	const complaintCount = document.querySelector('.card-complaints p');
	const resolvedCount = document.querySelector('.card-resolved p');

	// Simulated backend data (Replace with real fetch calls in the future)
	const dashboardData = {
		documents: 12,
		activeComplaints: 5,
		resolved: 34
	};

	docCount.textContent = dashboardData.documents;
	complaintCount.textContent = dashboardData.activeComplaints;
	resolvedCount.textContent = dashboardData.resolved;
});

// Page Navigation
const allSideMenu = document.querySelectorAll("#sidebar .side-menu li a");
const mainContent = document.querySelector("main");

// Sidebar Click Event Listener
allSideMenu.forEach((item) => {
	item.addEventListener("click", function (event) {
		event.preventDefault();

		// Remove active class from all menu items
		allSideMenu.forEach((i) => {
			i.parentElement.classList.remove("active");
		});
		
		// Add active class to clicked menu item
		this.parentElement.classList.add("active");

		// Get the page key from data-page attribute
		const pageKey = this.getAttribute("data-page");
		
		// Update the page title in the navbar
		const pageTitle = document.querySelector("#content nav h2");
		if (pageTitle) {
			pageTitle.textContent = this.querySelector(".text").textContent;
		}

		// Load the corresponding page content
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

if (switchMode) {
	switchMode.addEventListener("change", function () {
		document.body.classList.toggle("dark", this.checked);
	});
}

// Page Content
const pages = {
	dashboard: `
		<div class="head-title">
			<div class="left">
				<h1>Welcome to eGovFix Dashboard</h1>
				<p>Manage your government services efficiently.</p>
			</div>
		</div>
		<div class="cards">
			<div class="card card-docs">
				<h3>My Documents</h3>
				<p>0</p>
			</div>
			<div class="card card-complaints">
				<h3>Active Complaints</h3>
				<p>0</p>
			</div>
			<div class="card card-resolved">
				<h3>Resolved Issues</h3>
				<p>0</p>
			</div>
		</div>
		<div class="dashboard-sections">
			<section class="activity">
				<h2>Recent Activity</h2>
				<p>No activity found</p>
			</section>
			<section class="resources">
				<h2>Government Resources</h2>
				<ul>
					<li><a href="https://uidai.gov.in/">Aadhaar Card Portal</a></li>
					<li><a href="https://www.incometax.gov.in/">Income Tax Portal</a></li>
					<li><a href="https://parivahan.gov.in/">Driving License Portal</a></li>
					<li><a href="https://www.india.gov.in/">National Portal of India</a></li>
					<li><a href="#">More Resources</a></li>
				</ul>
			</section>
		</div>
	`,
	documents: `
		<div class="head-title">
			<div class="left">
				<h1>My Documents</h1>
				<p>Manage your uploaded documents</p>
			</div>
		</div>
		<div class="documents-container">
			<div class="documents-header">
				<button class="upload-btn">
					<i class='bx bx-upload'></i>
					Upload Document
				</button>
			</div>
			<div class="documents-grid">
				<!-- Document cards will be dynamically added here -->
			</div>
		</div>
	`,
	resources: `
		<div class="head-title">
			<div class="left">
				<h1>Government Resources</h1>
				<p>Access important government portals and services</p>
			</div>
		</div>
		<div class="resources-container">
			<div class="search-bar">
				<input type="text" class="search-input" placeholder="Search resources...">
				<button class="filter-btn">
					<i class='bx bx-filter'></i>
					Filter
				</button>
			</div>
			<div class="resources-grid">
				<!-- Resource cards will be dynamically added here -->
			</div>
		</div>
	`,
	manageUsers: `
		<div class="head-title">
			<div class="left">
				<h1>Manage Users</h1>
				<p>View and manage user accounts</p>
			</div>
		</div>
		<div class="users-container">
			<!-- User management interface will be added here -->
		</div>
	`,
	complaints: `
		<div class="head-title">
			<div class="left">
				<h1>All Complaints</h1>
				<p>View and manage user complaints</p>
			</div>
		</div>
		<div class="complaints-container">
			<!-- Complaints interface will be added here -->
		</div>
	`,
	verification: `
		<div class="head-title">
			<div class="left">
				<h1>Document Verification</h1>
				<p>Verify and approve user documents</p>
			</div>
		</div>
		<div class="verification-container">
			<!-- Verification interface will be added here -->
		</div>
	`,
	analytics: `
		<div class="head-title">
			<div class="left">
				<h1>Analytics & Reports</h1>
				<p>View system statistics and generate reports</p>
			</div>
		</div>
		<div class="analytics-container">
			<!-- Analytics interface will be added here -->
		</div>
	`
};

// Load Default Page
function loadContent(page) {
	if (mainContent) {
		mainContent.innerHTML = pages[page];

		// Initialize page-specific functionality
		if (page === "documents") {
			initializeDocumentsPage();
		} else if (page === "resources") {
			initializeResourcesPage();
		}
	}
}

// Initialize Documents Page
function initializeDocumentsPage() {
	const uploadBtn = document.querySelector('.upload-btn');
	if (uploadBtn) {
		uploadBtn.addEventListener('click', () => {
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = '.pdf,.jpg,.jpeg,.png';
			
			fileInput.onchange = (e) => {
				const file = e.target.files[0];
				if (file) {
					alert(`File ${file.name} selected for upload`);
				}
			};
			
			fileInput.click();
		});
	}
}

// Initialize Resources Page
function initializeResourcesPage() {
	const searchInput = document.querySelector('.search-input');
	const resourceCards = document.querySelectorAll('.resource-card');

	if (searchInput && resourceCards) {
		searchInput.addEventListener('input', (e) => {
			const searchTerm = e.target.value.toLowerCase();
			
			resourceCards.forEach(card => {
				const title = card.querySelector('h3').textContent.toLowerCase();
				const description = card.querySelector('.resource-description').textContent.toLowerCase();
				
				if (title.includes(searchTerm) || description.includes(searchTerm)) {
					card.style.display = 'block';
				} else {
					card.style.display = 'none';
				}
			});
		});
	}
}

// Load the default page when the page loads
document.addEventListener('DOMContentLoaded', () => {
	loadContent("dashboard");
});
