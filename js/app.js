// =====================================
// CareerFit - Main Application
// =====================================

document.addEventListener("DOMContentLoaded", async () => {
    await loadCareerFitData();

    loadDashboard();

    console.log("CareerFit application started.");
});


// =====================================
// DASHBOARD
// =====================================

function loadDashboard() {

    const totalJobsElement = document.getElementById("totalJobs");
    const totalRolesElement = document.getElementById("totalRoles");
    const totalSkillsElement = document.getElementById("totalSkills");

    // Agar dashboard page nahi hai,
    // to function yahin stop ho jayega.
    if (!totalJobsElement) {
        return;
    }

    // Total jobs
    // Role-skill data se nahi, roles ke counts ka sum
    // actual job count ka approximate market count dega.
    const totalJobs = roles.reduce(
        (total, role) => total + Number(role.count || 0),
        0
    );

    totalJobsElement.textContent = totalJobs.toLocaleString();

    // Unique roles
    totalRolesElement.textContent =
        roles.length.toLocaleString();

    // Unique skills
    totalSkillsElement.textContent =
        skills.length.toLocaleString();


    // Popular roles
    displayPopularRoles();

    // Popular skills
    displayPopularSkills();
}


// =====================================
// POPULAR ROLES
// =====================================

function displayPopularRoles() {

    const container =
        document.getElementById("popularRoles");

    if (!container) {
        return;
    }

    const topRoles = roles.slice(0, 7);

    if (topRoles.length === 0) {
        container.innerHTML =
            "<p class='loading-text'>No role data available.</p>";

        return;
    }

    container.innerHTML = topRoles.map((role) => {

        return `
            <div class="role-item">

                <span class="role-name">
                    ${escapeHTML(role.title)}
                </span>

                <span class="role-count">
                    ${Number(role.count).toLocaleString()} jobs
                </span>

            </div>
        `;

    }).join("");
}


// =====================================
// POPULAR SKILLS
// =====================================

function displayPopularSkills() {

    const container =
        document.getElementById("popularSkills");

    if (!container) {
        return;
    }

    const topSkills = skills.slice(0, 7);

    if (topSkills.length === 0) {
        container.innerHTML =
            "<p class='loading-text'>No skill data available.</p>";

        return;
    }

    container.innerHTML = topSkills.map((skill) => {

        return `
            <div class="skill-item">

                <span class="skill-name">
                    ${escapeHTML(skill.name)}
                </span>

                <span class="skill-count">
                    ${Number(skill.count).toLocaleString()} mentions
                </span>

            </div>
        `;

    }).join("");
}


// =====================================
// BASIC HTML SAFETY
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}