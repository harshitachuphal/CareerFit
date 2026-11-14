// =====================================
// CareerFit - Roadmap
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    const roadmapContent =
        document.getElementById("roadmapContent");

    if (!roadmapContent) {
        return;
    }

    const savedAnalysis =
        JSON.parse(
            localStorage.getItem("careerFitAnalysis")
        );

    // Analysis nahi hua hai
    if (!savedAnalysis) {
        return;
    }

    await loadCareerFitData();

    generateRoadmap(savedAnalysis);
});


// =====================================
// GENERATE ROADMAP
// =====================================

function generateRoadmap(analysis) {

    const emptyState =
        document.getElementById("roadmapEmpty");

    const roadmapContent =
        document.getElementById("roadmapContent");

    const roadmapRole =
        document.getElementById("roadmapRole");

    const roadmapSkillCount =
        document.getElementById("roadmapSkillCount");

    const roadmapList =
        document.getElementById("roadmapList");


    if (
        !analysis ||
        !analysis.missingSkills ||
        analysis.missingSkills.length === 0
    ) {
        return;
    }


    // Empty state hide
    emptyState.classList.add("hidden");

    // Roadmap show
    roadmapContent.classList.remove("hidden");


    // Role
    roadmapRole.textContent =
        analysis.role;


    // Missing skill count
    roadmapSkillCount.textContent =
        analysis.missingSkills.length;


    // Sort by market demand
    const roadmapSkills =
        [...analysis.missingSkills].sort(
            (a, b) =>
                Number(b.count || 0) -
                Number(a.count || 0)
        );


    roadmapList.innerHTML =
        roadmapSkills
            .map((skill, index) => {

                const demand =
                    Number(skill.count || 0);

                let demandLabel =
                    "Low Demand";

                if (demand >= 1000) {
                    demandLabel =
                        "Very High Demand";
                } else if (demand >= 300) {
                    demandLabel =
                        "High Demand";
                } else if (demand >= 100) {
                    demandLabel =
                        "Medium Demand";
                }


                return `
                    <div class="roadmap-item">

                        <div class="roadmap-number">
                            ${index + 1}
                        </div>


                        <div class="roadmap-info">

                            <h3>
                                ${escapeHTML(skill.name)}
                            </h3>

                            <p>
                                Develop this skill to improve
                                your readiness for ${escapeHTML(analysis.role)}.
                            </p>

                        </div>


                        <div class="roadmap-demand">

                            <strong>
                                ${demandLabel}
                            </strong>

                            <span>
                                ${demand.toLocaleString()}
                                job mentions
                            </span>

                        </div>

                    </div>
                `;

            })
            .join("");
}


// =====================================
// HTML SAFETY
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}