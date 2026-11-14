// =====================================
// CareerFit - Skill Analysis
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    const roleSelect =
        document.getElementById("careerRole");

    if (!roleSelect) {
        return;
    }

    await loadCareerFitData();

    populateCareerRoles();

    const analyzeButton =
        document.getElementById("analyzeSkillsBtn");

    if (analyzeButton) {
        analyzeButton.addEventListener(
            "click",
            analyzeSkills
        );
    }
});


// =====================================
// POPULATE CAREER ROLES
// =====================================

function populateCareerRoles() {

    const roleSelect =
        document.getElementById("careerRole");

    if (!roleSelect) {
        return;
    }

    roleSelect.innerHTML = `
        <option value="">
            Select a role
        </option>
    `;

    const topRoles =
        roles.slice(0, 100);

    topRoles.forEach((role) => {

        const option =
            document.createElement("option");

        option.value =
            role.title;

        option.textContent =
            `${role.title} (${role.count} jobs)`;

        roleSelect.appendChild(option);
    });
}


// =====================================
// MAIN ANALYSIS
// =====================================

function analyzeSkills() {

    const selectedRole =
        document.getElementById(
            "careerRole"
        ).value;

    const userSkillsInput =
        document.getElementById(
            "userSkills"
        ).value;


    // Validation
    if (!selectedRole) {

        alert(
            "Please select a target career."
        );

        return;
    }


    if (!userSkillsInput.trim()) {

        alert(
            "Please enter your skills."
        );

        return;
    }


    // =================================
    // USER SKILLS
    // =================================

    const userSkills =
        userSkillsInput
            .split(",")
            .map(skill =>
                normalizeSkill(skill)
            )
            .filter(Boolean);


    const uniqueUserSkills =
        [...new Set(userSkills)];


    // =================================
    // FIND ROLE
    // =================================

    const roleData =
        roleSkills.find(
            item =>
                item.role.toLowerCase() ===
                selectedRole.toLowerCase()
        );


    if (!roleData) {

        alert(
            "Skill information for this role is not available."
        );

        return;
    }


    // =================================
    // REQUIRED SKILLS
    // =================================

    const requiredSkills =
        roleData.skills.map(skill => ({

            name: skill.name,

            normalized:
                normalizeSkill(
                    skill.name
                ),

            count:
                Number(skill.count || 0)

        }));


    // =================================
    // MATCHED / MISSING
    // =================================

    const matchedSkills = [];

    const missingSkills = [];


    requiredSkills.forEach(skill => {

        const isMatched =
            uniqueUserSkills.some(
                userSkill =>
                    skillsMatch(
                        userSkill,
                        skill.normalized
                    )
            );


        if (isMatched) {

            matchedSkills.push(skill);

        } else {

            missingSkills.push(skill);

        }

    });


    // =================================
    // READINESS SCORE
    // =================================

    let readinessScore = 0;


    if (requiredSkills.length > 0) {

        const totalDemand =
            requiredSkills.reduce(
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


        if (totalDemand > 0) {

            readinessScore =
                Math.round(
                    (matchedDemand /
                        totalDemand) *
                    100
                );

        } else {

            readinessScore =
                Math.round(
                    (matchedSkills.length /
                        requiredSkills.length) *
                    100
                );
        }
    }


    // Keep score between 0 and 100
    readinessScore =
        Math.max(
            0,
            Math.min(
                100,
                readinessScore
            )
        );


    // =================================
    // DISPLAY RESULTS
    // =================================

    displayReadiness(
        readinessScore,
        selectedRole
    );

    displayMatchedSkills(
        matchedSkills
    );

    displayMissingSkills(
        missingSkills
    );

    createSkillMatchChart(
        matchedSkills.length,
        missingSkills.length
    );
    createSkillDemandChart(
        missingSkills
    );

    displayRecommendation(
        readinessScore,
        missingSkills
    );


    // =================================
    // SHOW RESULTS
    // =================================

    const results =
        document.getElementById(
            "analysisResults"
        );

    if (results) {
        results.classList.remove(
            "hidden"
        );
    }


    // =================================
    // SAVE ANALYSIS
    // =================================
    // Dashboard + Roadmap ke liye

    localStorage.setItem(
        "careerFitAnalysis",
        JSON.stringify({

            role:
                selectedRole,

            readinessScore:
                readinessScore,

            matchedSkills:
                matchedSkills,

            missingSkills:
                missingSkills

        })
    );


    console.log(
        "CareerFit analysis saved:",
        {
            role: selectedRole,
            readinessScore,
            matchedSkills,
            missingSkills
        }
    );
}


// =====================================
// NORMALIZE SKILL
// =====================================

function normalizeSkill(skill) {

    return String(skill)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


// =====================================
// SKILL MATCHING
// =====================================

function skillsMatch(
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

        typescript: [
            "ts",
            "typescript"
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

        "c++": [
            "cpp",
            "c++"
        ],

        sql: [
            "sql",
            "mysql",
            "postgresql"
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
// DISPLAY READINESS
// =====================================

function displayReadiness(
    score,
    role
) {

    const scoreElement =
        document.getElementById(
            "readinessScore"
        );

    const messageElement =
        document.getElementById(
            "readinessMessage"
        );


    if (scoreElement) {

        scoreElement.textContent =
            `${score}%`;
    }


    if (!messageElement) {
        return;
    }


    if (score >= 80) {

        messageElement.textContent =
            `You have a strong skill match for ${role}.`;

    } else if (score >= 60) {

        messageElement.textContent =
            `You have a good foundation for ${role}, but some important skills are missing.`;

    } else if (score >= 40) {

        messageElement.textContent =
            `You have a partial match for ${role}. Focus on the missing skills.`;

    } else {

        messageElement.textContent =
            `You need to develop several important skills for ${role}.`;
    }
}


// =====================================
// DISPLAY MATCHED SKILLS
// =====================================

function displayMatchedSkills(
    matchedSkills
) {

    const container =
        document.getElementById(
            "matchedSkills"
        );


    if (!container) {
        return;
    }


    if (
        matchedSkills.length === 0
    ) {

        container.innerHTML =
            `
            <p class="empty-result">
                No required skills matched yet.
            </p>
            `;

        return;
    }


    container.innerHTML = `
        <div class="skill-result-list">

            ${matchedSkills
                .map(
                    skill => `
                        <span
                            class="skill-tag matched-tag"
                        >
                            ${escapeHTML(
                                skill.name
                            )}
                        </span>
                    `
                )
                .join("")}

        </div>
    `;
}


// =====================================
// DISPLAY MISSING SKILLS
// =====================================

function displayMissingSkills(
    missingSkills
) {

    const container =
        document.getElementById(
            "missingSkills"
        );


    if (!container) {
        return;
    }


    if (
        missingSkills.length === 0
    ) {

        container.innerHTML = `
            <p class="empty-result">
                Excellent! No major skill gaps found.
            </p>
        `;

        return;
    }


    // Highest demand first
    const sortedMissing =
        [...missingSkills].sort(
            (a, b) =>
                Number(b.count || 0) -
                Number(a.count || 0)
        );


    // Top 10
    const topMissing =
        sortedMissing.slice(
            0,
            10
        );


    container.innerHTML = `
        <div class="priority-list">

            ${topMissing
                .map(
                    (skill, index) => {

                        const demand =
                            Number(
                                skill.count || 0
                            );


                        let demandLabel =
                            "Low Demand";


                        if (
                            demand >= 1000
                        ) {

                            demandLabel =
                                "Very High Demand";

                        } else if (
                            demand >= 300
                        ) {

                            demandLabel =
                                "High Demand";

                        } else if (
                            demand >= 100
                        ) {

                            demandLabel =
                                "Medium Demand";
                        }


                        return `
                            <div
                                class="priority-item"
                            >

                                <div
                                    class="priority-number"
                                >
                                    ${index + 1}
                                </div>


                                <div
                                    class="priority-info"
                                >

                                    <strong>
                                        ${escapeHTML(
                                            skill.name
                                        )}
                                    </strong>

                                    <span>
                                        ${demandLabel}
                                    </span>

                                </div>


                                <div
                                    class="priority-count"
                                >
                                    ${demand.toLocaleString()}
                                    jobs
                                </div>

                            </div>
                        `;
                    }
                )
                .join("")}

        </div>
    `;
}


// =====================================
// RECOMMENDATION
// =====================================

function displayRecommendation(
    score,
    missingSkills
) {

    const element =
        document.getElementById(
            "analysisRecommendation"
        );


    if (!element) {
        return;
    }


    if (
        missingSkills.length === 0
    ) {

        element.textContent =
            "Your current skill profile strongly matches the selected career.";

        return;
    }


    const topMissing =
        [...missingSkills]
            .sort(
                (a, b) =>
                    Number(b.count || 0) -
                    Number(a.count || 0)
            )
            .slice(
                0,
                3
            )
            .map(
                skill =>
                    skill.name
            );


    if (score >= 70) {

        element.textContent =
            `You're close to job-ready. Prioritize: ${topMissing.join(", ")}.`;

    } else if (score >= 40) {

        element.textContent =
            `Build your profile by focusing first on: ${topMissing.join(", ")}.`;

    } else {

        element.textContent =
            `Start with the highest-demand skills: ${topMissing.join(", ")}.`;
    }
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