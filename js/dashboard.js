// =====================================
// CareerFit - Dashboard
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    const savedAnalysis =
        JSON.parse(
            localStorage.getItem("careerFitAnalysis")
        );

    if (!savedAnalysis) {
        return;
    }


    // Elements
    const roleElement =
        document.getElementById("dashboardRole");

    const scoreElement =
        document.getElementById("dashboardScore");

    const gapsElement =
        document.getElementById("dashboardGaps");

    const emptySection =
        document.getElementById("dashboardEmpty");

    const profileSection =
        document.getElementById("dashboardProfile");


    // ---------------------------------
    // Basic stats
    // ---------------------------------

    roleElement.textContent =
        savedAnalysis.role || "—";

    scoreElement.textContent =
        `${savedAnalysis.readinessScore || 0}%`;

    gapsElement.textContent =
        savedAnalysis.missingSkills
            ? savedAnalysis.missingSkills.length
            : 0;


    // ---------------------------------
    // Show profile
    // ---------------------------------

    emptySection.classList.add(
        "hidden"
    );

    profileSection.classList.remove(
        "hidden"
    );


    // ---------------------------------
    // Detailed profile
    // ---------------------------------

    const matchedCount =
        document.getElementById(
            "matchedCount"
        );

    const missingCount =
        document.getElementById(
            "missingCount"
        );

    const profileScore =
        document.getElementById(
            "profileScore"
        );


    matchedCount.textContent =
        savedAnalysis.matchedSkills
            ? savedAnalysis.matchedSkills.length
            : 0;

    missingCount.textContent =
        savedAnalysis.missingSkills
            ? savedAnalysis.missingSkills.length
            : 0;

    profileScore.textContent =
        `${savedAnalysis.readinessScore || 0}%`;
        createReadinessChart(
    savedAnalysis.readinessScore || 0
);
});