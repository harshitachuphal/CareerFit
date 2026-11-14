const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Excel dataset ka path
const filePath = path.join(
  __dirname,
  "..",
  "dataset",
  "raw",
  "indian-job-market-dataset-2025.xlsx"
);

// Excel read karo
const workbook = XLSX.readFile(filePath);

// First sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Excel ko JavaScript objects mein convert karo
const jobs = XLSX.utils.sheet_to_json(worksheet, {
    defval: ""
});

console.log("Columns found in Excel:");

if (jobs.length > 0) {
    console.log(Object.keys(jobs[0]));
}
function findColumn(row, possibleNames) {
    const actualColumns = Object.keys(row);

    return actualColumns.find((column) => {
        const normalizedColumn = column
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();

        return possibleNames.some((name) => {
            const normalizedName = name
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

            return normalizedColumn === normalizedName;
        });
    });
}

const titleColumn = findColumn(jobs[0], [
    "Title",
    "Job Title"
]);

const skillsColumn = findColumn(jobs[0], [
    "tagsandSkills",
    "tags and Skills",
    "tags & Skills",
    "Skills"
]);

console.log("Title column:", titleColumn);
console.log("Skills column:", skillsColumn);
console.log("Total jobs:", jobs.length);

// -------------------------
// SKILLS
// -------------------------

const skillMap = {};

jobs.forEach((job) => {
 const rawSkills = job[skillsColumn];

  if (!rawSkills) return;

  const skills = String(rawSkills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  skills.forEach((skill) => {
    const key = skill.toLowerCase();

    if (!skillMap[key]) {
      skillMap[key] = {
        name: skill,
        count: 0
      };
    }

    skillMap[key].count++;
  });
});

const skills = Object.values(skillMap).sort(
  (a, b) => b.count - a.count
);

// -------------------------
// ROLES
// -------------------------

const roleMap = {};

jobs.forEach((job) => {
  const title = job[titleColumn];

  if (!title) return;

  const role = String(title).trim();
  const key = role.toLowerCase();

  if (!roleMap[key]) {
    roleMap[key] = {
      title: role,
      count: 0
    };
  }

  roleMap[key].count++;
});

const roles = Object.values(roleMap).sort(
  (a, b) => b.count - a.count
);

// -------------------------
// ROLE → SKILLS
// -------------------------

// -------------------------
// ROLE → SKILLS
// -------------------------

const roleSkillMap = {};

jobs.forEach((job) => {

  const title = job[titleColumn];
  const rawSkills = job[skillsColumn];

  if (!title || !rawSkills) {
    return;
  }

  const role = String(title).trim();

  if (!role) {
    return;
  }

  const roleKey = role.toLowerCase();

  // Create role if it doesn't exist
  if (!roleSkillMap[roleKey]) {

    roleSkillMap[roleKey] = {
      role: role,
      skills: {}
    };
  }


  // Extract skills
  const extractedSkills = String(rawSkills)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);


  extractedSkills.forEach((skill) => {

    const skillName = String(skill).trim();

    if (!skillName) {
      return;
    }

    const skillKey = skillName.toLowerCase();


    if (!roleSkillMap[roleKey].skills[skillKey]) {

      roleSkillMap[roleKey].skills[skillKey] = {
        name: skillName,
        count: 0
      };

    }


    roleSkillMap[roleKey].skills[skillKey].count++;

  });

});


const roleSkills = Object.values(roleSkillMap).map((item) => {

  return {
    role: item.role,

    skills: Object.values(item.skills).sort(
      (a, b) => b.count - a.count
    )
  };

});
// SAVE JSON FILES
// -------------------------

const dataFolder = path.join(__dirname, "..", "data");

if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

fs.writeFileSync(
  path.join(dataFolder, "skills.json"),
  JSON.stringify(skills, null, 2)
);

fs.writeFileSync(
  path.join(dataFolder, "roles.json"),
  JSON.stringify(roles, null, 2)
);

fs.writeFileSync(
  path.join(dataFolder, "roleSkills.json"),
  JSON.stringify(roleSkills, null, 2)
);

console.log("Skills extracted:", skills.length);
console.log("Roles extracted:", roles.length);
console.log("Role-skill mappings:", roleSkills.length);

console.log("✅ Dataset extraction complete!");