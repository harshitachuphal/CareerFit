// =====================================
// CareerFit - Charts
// =====================================

let skillMatchChart = null;


// =====================================
// SKILL MATCH CHART
// =====================================

function createSkillMatchChart(
    matchedCount,
    missingCount
) {

    const canvas =
        document.getElementById(
            "skillMatchChart"
        );

    // Chart element nahi mila
    if (!canvas) {
        return;
    }


    // Agar chart pehle se bana hua hai
    // to purana chart destroy karo
    if (skillMatchChart) {
        skillMatchChart.destroy();
    }


    // Create Doughnut Chart
    skillMatchChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Matched Skills",
                        "Missing Skills"
                    ],

                    datasets: [
                        {
                            data: [
                                matchedCount,
                                missingCount
                            ]
                        }
                    ]
                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            position: "bottom"
                        }

                    }
                }
            }
        );
}
// =====================================
// TOP MISSING SKILLS DEMAND CHART
// =====================================

let skillDemandChart = null;

function createSkillDemandChart(missingSkills) {

    const canvas =
        document.getElementById("skillDemandChart");

    if (!canvas) {
        return;
    }

    // Destroy old chart if it exists
    if (skillDemandChart) {
        skillDemandChart.destroy();
    }

    // Highest demand first
    const sortedSkills =
        [...missingSkills].sort(
            (a, b) =>
                Number(b.count || 0) -
                Number(a.count || 0)
        );

    // Top 7 missing skills
    const topSkills =
        sortedSkills.slice(0, 7);

    const labels =
        topSkills.map(
            skill => skill.name
        );

    const demandValues =
        topSkills.map(
            skill => Number(skill.count || 0)
        );

    skillDemandChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {
                    labels: labels,

                    datasets: [
                        {
                            label: "Job Demand",
                            data: demandValues
                        }
                    ]
                },

                options: {
                    responsive: true,

                    maintainAspectRatio: false,

                    indexAxis: "y",

                    plugins: {
                        legend: {
                            display: false
                        }
                    },

                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
}
// =====================================
// DASHBOARD READINESS CHART
// =====================================

let readinessChart = null;

function createReadinessChart(score) {

    const canvas =
        document.getElementById("readinessChart");

    if (!canvas) {
        return;
    }

    if (readinessChart) {
        readinessChart.destroy();
    }

    const remainingScore =
        Math.max(0, 100 - score);

    readinessChart = new Chart(
        canvas,
        {
            type: "doughnut",

            data: {
                labels: [
                    "Ready",
                    "Remaining"
                ],

                datasets: [
                    {
                        data: [
                            score,
                            remainingScore
                        ]
                    }
                ]
            },

            options: {
                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );
}