// ================================
// CareerFit Data Loader
// ================================

let jobs = [];
let skills = [];
let roles = [];
let roleSkills = [];

// Load all CareerFit data
async function loadCareerFitData() {
  try {
    const [skillsResponse, rolesResponse, roleSkillsResponse] =
      await Promise.all([
        fetch("../data/skills.json"),
        fetch("../data/roles.json"),
        fetch("../data/roleSkills.json")
      ]);

    if (!skillsResponse.ok) {
      throw new Error("skills.json load nahi hua");
    }

    if (!rolesResponse.ok) {
      throw new Error("roles.json load nahi hua");
    }

    if (!roleSkillsResponse.ok) {
      throw new Error("roleSkills.json load nahi hua");
    }

    skills = await skillsResponse.json();
    roles = await rolesResponse.json();
    roleSkills = await roleSkillsResponse.json();

    console.log("CareerFit data loaded successfully");

    console.log("Skills:", skills.length);
    console.log("Roles:", roles.length);
    console.log("Role-Skills:", roleSkills.length);

  } catch (error) {
    console.error("CareerFit data loading error:", error);
  }
}