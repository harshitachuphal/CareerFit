// =====================================
// CareerFit - Career Switch
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    const roleSelect =
        document.getElementById("currentRole");

    const findCareerBtn =
        document.getElementById("findCareerBtn");

    if (!roleSelect || !findCareerBtn) {
        return;
    }

    // Load roles + role-skill data
    await loadCareerFitData();

    populateRoles();

    findCareerBtn.addEventListener(
        "click",
        findAlternativeCareers
    );
});


// =====================================
// POPULATE ROLES
// =====================================

function populateRoles() {

    const roleSelect =
        document.getElementById("currentRole");

    if (!roleSelect) {
        return;
    }

    // Avoid duplicate options
    roleSelect.innerHTML = `
        <option value="">
            Select your current role
        </option>
    `;

    // Use roles that actually have skill mappings
    const availableRoles = roleSkills
        .filter(item =>
            item.skills &&
            item.skills.length > 0
        )
        .slice(0, 500);


    availableRoles.forEach((role) => {

        const option =
            document.createElement("option");

        option.value = role.role;

        option.textContent =
            role.role;

        roleSelect.appendChild(option);
    });
}


// =====================================
// FIND ALTERNATIVE CAREERS
// =====================================

function findAlternativeCareers() {

    const selectedRole =
        document.getElementById(
            "currentRole"
        ).value;

    const skillsInput =
        document.getElementById(
            "switchSkills"
        ).value;


    if (!selectedRole) {

        alert(
            "Please select your current role."
        );

        return;
    }


    if (!skillsInput.trim()) {

        alert(
            "Please enter your current skills."
        );

        return;
    }


    // User skills
    const userSkills =
        skillsInput
            .split(",")
            .map(skill =>
                normalizeSwitchSkill(skill)
            )
            .filter(Boolean);


    const uniqueSkills =
        [...new Set(userSkills)];


    // Find current role
    const currentRoleData =
        roleSkills.find(
            item =>
                item.role.toLowerCase() ===
                selectedRole.toLowerCase()
        );


    if (!currentRoleData) {

        alert(
            "Skill information for this role is not available."
        );

        return;
    }


    // ---------------------------------
    // Find alternative careers
    // ---------------------------------

    const recommendations = [];


    roleSkills.forEach((career) => {

        // Don't recommend the same career
        if (
            career.role.toLowerCase() ===
            selectedRole.toLowerCase()
        ) {
            return;
        }


        if (
            !career.skills ||
            career.skills.length === 0
        ) {
            return;
        }


        const careerSkills =
            career.skills.map(skill => ({
                ...skill,
                normalized:
                    normalizeSwitchSkill(
                        skill.name
                    )
            }));


        const matchedSkills =
            careerSkills.filter(
                skill =>
                    uniqueSkills.some(
                        userSkill =>
                            skillsMatchSwitch(
                                userSkill,
                                skill.normalized
                            )
                    )
            );


        if (matchedSkills.length === 0) {
            return;
        }


        // ---------------------------------
        // Weighted match
        // ---------------------------------

        const totalDemand =
            careerSkills.reduce(
                (total, skill) =>
                    total +
                    Number(skill.count || 0),
                0
            );


        const matchedDemand =
            matchedSkills.reduce(
                (total, skill) =>
                    total +
                    Number(skill.count || 0),
                0
            );


        let matchScore = 0;


        if (totalDemand > 0) {

            matchScore =
                Math.round(
                    (matchedDemand /
                        totalDemand) *
                    100
                );

        } else {

            matchScore =
                Math.round(
                    (matchedSkills.length /
                        careerSkills.length) *
                    100
                );
        }


        // ---------------------------------
        // Store recommendation
        // ---------------------------------

        recommendations.push({

            role: career.role,

            score: matchScore,

            matchedSkills:
                matchedSkills
                    .slice(0, 8)
                    .map(skill =>
                        skill.name
                    ),

            totalSkills:
                careerSkills.length
        });

    });


    // ---------------------------------
    // Sort best matches first
    // ---------------------------------

    recommendations.sort(
        (a, b) =>
            b.score - a.score
    );


    // Keep top 8
    const topRecommendations =
        recommendations.slice(0, 8);


    displayCareerRecommendations(
        topRecommendations
    );
}


// =====================================
// DISPLAY RESULTS
// =====================================

function displayCareerRecommendations(
    recommendations
) {

    const results =
        document.getElementById(
            "switchResults"
        );

    const container =
        document.getElementById(
            "careerRecommendations"
        );


    results.classList.remove(
        "hidden"
    );


    if (recommendations.length === 0) {

        container.innerHTML = `
            <div class="career-card">

                <h3>
                    No strong career matches found.
                </h3>

                <p>
                    Try adding more skills to your
                    profile and analyze again.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        recommendations
            .map(
                (career, index) => {

                    return `
                        <article
                            class="career-card"
                        >

                            <div
                                class="career-card-header"
                            >

                                <div>

                                    <small>
                                        #${index + 1}
                                    </small>

                                    <h3>
                                        ${escapeHTML(
                                            career.role
                                        )}
                                    </h3>

                                </div>

                                <div
                                    class="match-score"
                                >
                                    ${career.score}%
                                    Match
                                </div>

                            </div>


                            <p>
                                Your existing skills
                                that can transfer to
                                this career:
                            </p>


                            <div
                                class="transfer-skills"
                            >

                                ${career.matchedSkills
                                    .map(
                                        skill => `
                                            <span
                                                class="transfer-skill"
                                            >
                                                ${escapeHTML(
                                                    skill
                                                )}
                                            </span>
                                        `
                                    )
                                    .join("")
                                }

                            </div>

                        </article>
                    `;

                }
            )
            .join("");
}


// =====================================
// NORMALIZE SKILL
// =====================================

function normalizeSwitchSkill(skill) {

    return String(skill)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


// =====================================
// SKILL MATCHING
// =====================================

function skillsMatchSwitch(
    userSkill,
    requiredSkill
) {

    if (
        userSkill ===
        requiredSkill
    ) {
        return true;
    }


    const variations = {

        javascript: [
            "js",
            "javascript"
        ],

        react: [
            "reactjs",
            "react.js",
            "react"
        ],

        nodejs: [
            "node",
            "node.js",
            "nodejs"
        ],

        html: [
            "html5",
            "html"
        ],

        css: [
            "css3",
            "css"
        ],

        typescript: [
            "ts",
            "typescript"
        ],

        "c++": [
            "cpp",
            "c++"
        ]

    };


    for (
        const key in variations
    ) {

        const values =
            variations[key];


        const userMatches =
            key === userSkill ||
            values.includes(
                userSkill
            );


        const requiredMatches =
            key === requiredSkill ||
            values.includes(
                requiredSkill
            );


        if (
            userMatches &&
            requiredMatches
        ) {
            return true;
        }
    }


    return false;
}


// =====================================
// HTML SAFETY
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}